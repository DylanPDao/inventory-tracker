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

app.post(
  '/upload',
  uploadsMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const { name, price, shortDescription, stock, type, longDescription } =
        req.body;
      if (!name || !price || !type || !stock) {
        throw new ClientError(401, 'invalid product details');
      }
      const url = `/images/${req.file.filename}`;
      const sql = `
      insert into "products" ("name", "price", "imageUrl", "shortDescription", "longDescription", "stock", "type")
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *
    `;
      const params = [
        name,
        price,
        url,
        shortDescription,
        longDescription,
        stock,
        type,
      ];
      const result = await db.query(sql, params);
      const [product] = result.rows;
      if (!product) {
        throw new ClientError(401, 'invalid login');
      }
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

app.post('/catalog', async (req, res, next) => {
  try {
    const { type } = req.body;
    if (!type) {
      throw new ClientError(401, 'invalid login');
    }
    let sql = `
    select *
    from "products"
    where "type" = $1
    `;
    if (type === 'cards') {
      sql = `
    select *
    from "products"
    where "type" = $1 OR "type" = $2
    `;
    }
    const params = type === 'cards' ? [type, 'set'] : [type];
    const result = await db.query(sql, params);
    const [products] = result.rows;
    if (!products) {
      throw new ClientError(401, 'invalid login');
    }
    res.status(201).json(products);
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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
