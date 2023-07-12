import 'dotenv/config';
import express from 'express';
import {
  ClientError,
  errorMiddleware,
  uploadsMiddleware,
} from './lib/index.js';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import path from 'path';
const stripe = new Stripe(`${process.env.STRIPE_KEY}`, {
  apiVersion: '2022-11-15',
});

const tokenSecret = process.env.TOKEN_SECRET;
if (!tokenSecret) throw new Error('token secret not defined');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

// Create paths for static directories
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

// Static directory for file uploads server/public/
app.use(express.static(reactStaticDir));
app.use(express.static(uploadsStaticDir));
app.use(express.static('public'));
app.use(express.json());

// User registers for new username/hashedpasswords
app.post('/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning *
    `;
    const params = [username, hashedPassword];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// verify user exists on database
app.post('/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
      select "userId",
            "hashedPassword",
            "admin"
        from "users"
      where "username" = $1
    `;
    const params = [username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword, admin } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username, admin };
    const token = jwt.sign(payload, tokenSecret);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

// Take information from form to add into products
app.post(
  '/upload',
  uploadsMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const { name, price, stock, type, longDescription } = req.body;
      if (!name || !price || !type || !stock || !req.file) {
        throw new ClientError(401, 'invalid product details');
      }
      const url = `${req.file.location}`;
      const sql = `
      insert into "products" ("name", "price", "imageUrl", "longDescription", "stock", "type")
        values ($1, $2, $3, $4, $5, $6)
        returning *
    `;
      const params = [name, price, url, longDescription, stock, type];
      const result = await db.query(sql, params);
      const [product] = result.rows;
      if (!product) {
        throw new ClientError(401, 'invalid product details');
      }
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

// pulls all the products by type of product
app.post('/catalog', async (req, res, next) => {
  try {
    const { type, searchString } = req.body;
    if (!type) {
      throw new ClientError(401, 'invalid product type');
    }
    let sql = `
      select *
        from "products"
        where "type" = $1
    `;
    if (type === 'card') {
      sql = `
      select *
        from "products"
        where "type" = $1 OR "type" = $2
    `;
    }
    if (type === 'all') {
      sql = `
      select *
        from "products"
      `;
    }
    if (type === 'search') {
      sql = `
      select *
        from "products"
        where "name" ilike '%${searchString}%'
      `;
    }
    const params = type === 'card' ? [type, 'sets'] : [type];
    const result =
      type === 'all' || type === 'search'
        ? await db.query(sql)
        : await db.query(sql, params);
    const [...products] = result.rows;
    if (!products) {
      throw new ClientError(401, 'invalid product');
    }
    res.status(201).json(products);
  } catch (err) {
    next(err);
  }
});

app.get('/products/:productId', async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    if (!productId) {
      throw new ClientError(401, 'invalid product ID');
    }
    const sql = `
    select *
      from "products"
      where "productId" = $1
    `;
    const params = [productId];
    const result = await db.query(sql, params);
    const [product] = result.rows;
    if (!product) {
      throw new ClientError(401, 'invalid product');
    }
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// adds item to cart
app.post('/add-to-cart', async (req, res, next) => {
  try {
    const { name, price, quantity, productId, userId, imageUrl, priceId } =
      req.body;
    if (!name) {
      throw new ClientError(401, 'cart item');
    }
    if (!userId) {
      let sql = `
        select *
          from "cartItems"
          where "cartId" is null and "productId" = $1
      `;
      let params = [productId];
      let result = await db.query(sql, params);
      const [cartItemExists] = result.rows;
      if (cartItemExists) {
        sql = `
        update "cartItems"
          set "quantity" = $1
          where "cartId" is null and "productId" = $2
          returning *
        `;
        params = [quantity, productId];
        result = await db.query(sql, params);
        const [cartItem] = result.rows;
        if (!cartItem) {
          throw new ClientError(401, 'Did not add to cart');
        }
        res.status(201).json(cartItem);
        return;
      } else {
        sql = `
        insert into "cartItems" ("name", "price", "productId", "quantity", "imageUrl", "priceId")
          values ($1,$2,$3,$4, $5, $6)
          returning *
        `;
        const params = [name, price, productId, quantity, imageUrl, priceId];
        result = await db.query(sql, params);
        const [cartItem] = result.rows;
        if (!cartItem) {
          throw new ClientError(401, 'Did not add to cart');
        }
        res.status(201).json(cartItem);
        return;
      }
    }

    if (userId) {
      let sql = `
      select "cartId"
        from "carts"
        where "userId" = $1
      `;
      let params = [userId];
      const cartResult = await db.query(sql, params);
      let [cartId] = cartResult.rows;
      if (!cartId) {
        const sql = `
        insert into "carts" ("userId")
          values ($1)
          returning "cartId"
        `;
        const params = [userId];
        const cartResult = await db.query(sql, params);
        const [newCartId] = cartResult.rows;
        cartId = newCartId;
      }
      sql = `
        select *
          from "cartItems"
          join "carts" using ("cartId")
          where "productId" = $1 and "userId" = $2
      `;
      params = [productId, userId];
      const result = await db.query(sql, params);
      const [cartItemExists] = result.rows;
      if (cartItemExists) {
        const sql = `
        update "cartItems"
          set "quantity" = $1
          where "productId" = $2 and "cartId" = $3
          returning *
        `;
        const params = [quantity, productId, cartId.cartId];
        const result = await db.query(sql, params);
        const [cartItem] = result.rows;
        if (!cartItem) {
          throw new ClientError(401, 'Did not add to cart');
        }
        res.status(201).json(cartItem);
        return;
      } else {
        sql = `
        insert into "cartItems" ("name", "price", "productId", "quantity", "cartId", "imageUrl", "priceId")
          values ($1, $2, $3, $4, $5, $6, $7)
          returning *
        `;
        const params = [
          name,
          price,
          productId,
          quantity,
          cartId.cartId,
          imageUrl,
          priceId,
        ];
        const result = await db.query(sql, params);
        const [cartItem] = result.rows;
        if (!cartItem) {
          throw new ClientError(401, 'Did not add to cart');
        }
        res.status(201).json(cartItem);
      }
    }
  } catch (err) {
    next(err);
  }
});

// pulls cart by user
app.get('/cart/:userId', async (req, res, next) => {
  const user = req.params;
  const userId = user.userId;

  try {
    if (userId === 'guest') {
      const sql = `
    select *
      from "cartItems"
      where "cartId" is null
    `;
      const result = await db.query(sql);
      const [...cart] = result.rows;
      if (!cart) {
        throw new ClientError(401, 'Could not find cart');
      }
      res.status(201).json(cart);
    } else {
      const sql = `
    select *
      from "cartItems"
      join "carts" using ("cartId")
      where "userId" = $1
    `;
      const params = [userId];
      const result = await db.query(sql, params);
      const [...cart] = result.rows;
      if (!cart) {
        throw new ClientError(401, 'Could not find cart');
      }
      res.status(201).json(cart);
    }
  } catch (err) {
    next(err);
  }
});

// updates cart with new quanitity of item
app.patch('/cart/update', async (req, res, next) => {
  try {
    const { quantity, cartId, cartItemId } = req.body;
    if (!quantity) {
      throw new ClientError(401, 'invalid cart update');
    }
    if (cartId === null) {
      const sql = `
    update "cartItems"
      set "quantity" = $1
      where "cartId" is null and "cartItemId" = $2
    `;
      const params = [quantity, cartItemId];
      const result = await db.query(sql, params);
      const product = result.rowCount;
      if (!product) {
        throw new ClientError(401, 'invalid product');
      }
      res.sendStatus(204);
      return;
    } else {
      const sql = `
      update "cartItems"
        set "quantity" = $1
        where "cartId" = $2 and "cartItemId" = $3
      `;
      const params = [quantity, cartId, cartItemId];
      const result = await db.query(sql, params);
      const product = result.rowCount;
      if (!product) {
        throw new ClientError(401, 'invalid product');
      }
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
});

// removes cart item
app.post('/cart/delete', async (req, res, next) => {
  try {
    const { cartId, cartItemId } = req.body;
    if (cartId === null) {
      const sql = `
  delete
    from "cartItems"
    where "cartId" is null and "cartItemId" = $1
    returning *
  `;
      const params = [cartItemId];
      const result = await db.query(sql, params);
      if (!result) throw new Error('Delete not completed');
      res.sendStatus(200);
      return;
    }
    if (!cartId) {
      throw new ClientError(401, 'invalid cart item delete');
    }
    const sql = `
  delete
    from "cartItems"
    where "cartId" = $1 and "cartItemId" = $2
    returning *
  `;
    const params = [cartId, cartItemId];
    const result = await db.query(sql, params);
    if (!result) throw new Error('Delete not completed');
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

// handles stripe redirection and adds item from cart
type CheckoutProps = {
  cartItemId: number;
  cartId: number | null;
  productId: number;
  quantity: number;
  price: string;
  name: string;
  imageUrl: string;
  priceId: string;
};
type LineItemProps = {
  price: string;
  quantity: number;
};
app.post('/checkout', async (req, res, next) => {
  const { cart } = req.body;
  try {
    const priceCart: LineItemProps[] = [];
    cart.forEach((item: CheckoutProps) =>
      priceCart.push({
        price: item.priceId,
        quantity: item.quantity,
      })
    );
    const session = await stripe.checkout.sessions.create({
      line_items: priceCart,
      mode: 'payment',
      success_url: `http://gimmepokemon.dylandao.dev/success`,
      cancel_url: `http://gimmepokemon.dylandao.dev`,
      automatic_tax: { enabled: true },
    });
    res.status(303).json(session.url);
  } catch (err) {
    next(err);
  }
});

/**
 * Serves React's index.html if no api route matches.
 *
 * Implementation note:
 * When the final project is deployed, this Express server becomes responsible
 * for serving the React files. (In development, the Create React App server does this.)
 * When navigating in the client, if the user refreshes the page, the browser will send
 * the URL to this Express server instead of to React Router.
 * Catching everything that doesn't match a route and serving index.html allows
 * React Router to manage the routing.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use('/api', (req, res) => {
  res.status(404).json({ error: `cannot ${req.method} ${req.url}` });
});

app.use((req, res) => {
  res.sendFile('/index.html', {
    // you'll need to require the built-in path module
    // into your server code if you haven't already
    root: path.join(__dirname, 'public'),
  });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
