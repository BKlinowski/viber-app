import express from 'express';
import path from 'path';

import sqlite3 from 'sqlite3';

const app = express();

const __dirname = path.resolve();

export const db = new sqlite3.Database(
  './viberFiles/viber.db',
  sqlite3.OPEN_READONLY,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the viber database.');
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  }
);
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

import routes from './routes/main.js';

app.use(routes);

app.get('/', (rqe, res, next) => {
  res.render('index');
});
