import 'dotenv/config';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';
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

app.post('/api/create-order', async (req, res, next) => {
  try {
    const body = req.body;
    console.log(body);
    if (!body) {
      throw new ClientError(401, 'invalid user ID');
    }
  } catch (err) {
    next(err);
  }
});

app.post('/api/cart/delete', async (req, res, next) => {
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
