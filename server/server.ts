import 'dotenv/config';
import express from 'express';
import { ClientError, errorMiddleware, generateUUID } from './lib/index.js';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

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
    console.log(user);
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

// get inventory from db
app.get('/api/inventory/:userId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      throw new ClientError(401, 'invalid user ID');
    }
    const sql = `
      select *
        from "items"
        join "category" using ("categoryId")
        where "userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const inventory = result.rows;
    if (!inventory) throw new ClientError(401, 'Did not find Inventory');
    res.status(201).json(inventory);
  } catch (err) {
    next(err);
  }
});

// get all the categories
app.get('/api/category/:userId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      throw new ClientError(401, 'invalid user ID');
    }
    const sql = `
      select *
        from "category"
        where "userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const categories = result.rows;
    if (!categories) throw new ClientError(401, 'Did not find categories');
    res.status(201).json(categories);
  } catch (err) {
    next(err);
  }
});

// delete item from db
app.post('/api/inventory/delete', async (req, res, next) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      throw new ClientError(401, 'invalid item');
    }
    const sql = `
    delete
    from "items"
    where "itemId" = $1
    returning *
    `;
    const params = [itemId];
    const result = await db.query(sql, params);
    if (!result) throw new Error('Delete not completed');
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

// add item/category to db
app.post('/api/inventory/add', async (req, res, next) => {
  try {
    const { formData, userId } = req.body;
    const category = formData.category;
    const item = formData.item;
    const itemCategory = formData.itemCategory;
    if ((!category && !item && !userId) || !userId || (category && item)) {
      throw new ClientError(401, 'invalid input');
    }
    const sql = `
  insert into ${!item ? 'category' : 'items'} ${
      !item ? `("categoryName", "userId")` : `("par", "item", "categoryId")`
    }
    values ${!item ? `($1, $2)` : `($1, $2, $3)`}
    returning *
  `;
    const params = !item ? [category, userId] : [0, item, itemCategory];
    const result = await db.query(sql, params);
    if (!result) throw new Error('add not completed');
    const [addedItem] = result.rows;
    res.status(201).json(addedItem);
  } catch (err) {
    next(err);
  }
});

// create new order sheet
app.post('/api/createorder', async (req, res, next) => {
  try {
    const { formData, userId } = req.body;
    if (!formData || !userId) {
      throw new ClientError(401, 'invalid input');
    }
    const entries = Object.entries(formData);

    type Map = {
      [key: string]: {
        par: number;
        stock: number;
      };
    };
    const map: Map = {};
    for (let i = 0; i < entries.length; i++) {
      const split = entries[i][0].split(' ');
      split.pop();
      const key = split.join(' ');
      if (!map[key]) {
        map[key] = {
          par: Number(entries[i][1]),
          stock: Number(entries[i + 1][1]),
        };
      }
    }

    let sql = `
      insert into "orders" ("userId", "orderId", "orderedAt")
      values ($1, $2, $3)
      returning "orderId"
    `;
    let params = [userId, generateUUID(), Date()];
    const orderNumber = await db.query(sql, params);
    if (!orderNumber) throw new Error('invalid user');
    const orderId = orderNumber.rows[0].orderId;

    const orderItems = Object.entries(map);
    orderItems.forEach(async (item) => {
      const quantity = item[1].par - item[1].stock;
      sql = `
      insert into "orderItem" ("orderId", "item", "quantity")
        values ($1, $2, $3)
        returning *
      `;
      params = [orderId, item[0], quantity];
      const orderItem = await db.query(sql, params);
      if (!orderItem) throw new Error(`Item ${item[0]} could not be added`);
    });
    res.status(201).json(orderId);
  } catch (err) {
    next(err);
  }
});

// create new order sheet
type Map = {
  [key: string]: {
    par: number;
    stock: number;
  };
};
app.post('/api/createorder', async (req, res, next) => {
  try {
    const { formData, userId } = req.body;
    if (!formData || !userId) {
      throw new ClientError(401, 'invalid input');
    }
    const entries = Object.entries(formData);

    const map: Map = {};
    for (let i = 0; i < entries.length; i++) {
      const split = entries[i][0].split(' ');
      split.pop();
      const key = split.join(' ');
      if (!map[key]) {
        map[key] = {
          par: Number(entries[i][1]),
          stock: Number(entries[i + 1][1]),
        };
      }
    }

    let sql = `
      insert into "orders" ("userId", "orderId", "orderedAt")
      values ($1, $2, $3)
      returning "orderId"
    `;
    let params = [userId, generateUUID(), Date()];
    const orderNumber = await db.query(sql, params);
    if (!orderNumber) throw new Error('invalid user');
    const orderId = orderNumber.rows[0].orderId;

    const orderItems = Object.entries(map);

    orderItems.forEach(async (item) => {
      let parSql = `
        select "par"
        from "items"
        where "item" = $1
        returning *
      `;
      let parParams = [item[0]];
      const itemPar = await db.query(parSql, parParams);
      if (!itemPar) throw new Error(`Item ${item[0]} could not be found`);
      if (item[1].par !== Number(itemPar)) {
        parSql = `
        update "items"
          set "par" = $1
          where "item" = $2
          returning *
        `;
        parParams = [item[1].par.toString(), item[0]];
        const updatedPar = await db.query(parSql, parParams);
        if (!updatedPar) throw new Error(`Item ${item[0]} could not be found`);
      }
    });

    orderItems.forEach(async (item) => {
      const quantity = item[1].par - item[1].stock;
      sql = `
      insert into "orderItem" ("orderId", "item", "quantity")
        values ($1, $2, $3)
        returning *
      `;
      params = [orderId, item[0], quantity];
      const orderItem = await db.query(sql, params);
      if (!orderItem) throw new Error(`Item ${item[0]} could not be added`);
    });

    res.status(201).json(orderId);
  } catch (err) {
    next(err);
  }
});

// get order items
app.get('/api/order/:orderId', async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const sql = `
      select *
      from "orderItem"
      where  "orderId" = $1
    `;
    const params = [orderId];
    const orderedItems = await db.query(sql, params);
    if (!orderedItems)
      throw new Error(`Could not find ordered items by ${orderId}`);
    const order = orderedItems.rows;
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// update pars
app.post('/api/parupdate', async (req, res, next) => {
  try {
    const { formData, userId } = req.body;
    if (!formData || !userId) {
      throw new ClientError(401, 'invalid input');
    }
    const entries = Object.entries(formData);
    const map: Map = {};
    for (let i = 0; i < entries.length; i++) {
      const split = entries[i][0].split(' ');
      split.pop();
      const key = split.join(' ');
      if (!map[key]) {
        map[key] = {
          par: Number(entries[i][1]),
          stock: Number(entries[i + 1][1]),
        };
      }
    }
    const orderItems = Object.entries(map);
    orderItems.forEach(async (item) => {
      let parSql = `
        select "par"
        from "items"
        join "category" using ("categoryId")
        where "item" = $1 and "userId" = $2
      `;
      let parParams = [item[0], userId];
      const result = await db.query(parSql, parParams);
      if (!result) throw new Error(`Item ${item[0]} could not be found`);
      const itemPar = result.rows[0];
      if (item[1].par !== itemPar.par) {
        parSql = `
        update "items"
          set "par" = $1
          join "category" using ("categoryId")
          where "item" = $2 and "userId" = $3
        `;
        parParams = [item[1].par.toString(), item[0], userId];
        const updatedPar = await db.query(parSql, parParams);
        if (!updatedPar)
          throw new Error(`Item ${item[0]}'s par could not be updated`);
      }
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// get all orders
app.get('/api/all/order/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const sql = `
      select "userId", "username", "orderId", "orderedAt"
      from "orders"
      join "users" using ("userId")
      ${userId === '1' ? '' : `where  "userId" = $1`}
    `;
    const params = [userId];
    const result =
      userId === '1' ? await db.query(sql) : await db.query(sql, params);
    if (!result) throw new Error(`Could not find ordered items by ${userId}`);
    const orders = result.rows;
    res.status(201).json(orders);
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

app.use('/api', (req, res) => {
  res.status(404).json({ error: `cannot ${req.method} ${req.url}` });
});

app.use(errorMiddleware);

app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
