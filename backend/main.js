import cors from 'cors';
import express from 'express';
import sqlite3 from 'sqlite3';
import homeMeasureJson from './api-samples/gethomemeasures.json' assert { type: 'json' };
import homesDataJson from './api-samples/homesdata.json' assert { type: 'json' };
import homeStatusJson from './api-samples/homestatus.json' assert { type: 'json' };
import { authenticate, checkTokenMiddleware } from './authentication.js';

const db = new sqlite3.Database('netatmo.db');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!\n')
});

app.get('/homesData', checkTokenMiddleware, (req, res) => {
  console.log('homesData', homesDataJson);
  res.json(homesDataJson)
})

app.get('/homeStatus', checkTokenMiddleware, (req, res) => {
  // get home_id from query params
  const { home_id } = req.query;
  // TODO: add checks for query params
  if (homeStatusJson.body.home.id === home_id) {
    res.json(homeStatusJson)
  } else {
    res.status(404).json({ error: 'Home not found', code: 9 });
  }
})

app.get('/homeMeasures', checkTokenMiddleware, (req, res) => {
  // get home_id from query params
  const { home_id } = req.query;
  // TODO: add checks for query params
  if (homeMeasureJson.body.home.id === home_id) {
    res.json(homeMeasureJson)
  } else {
    res.status(404).json({ error: 'Home not found', code: 9 });
  }
})

app.post('/login', authenticate)

const port = 3001;
app.listen(port);

// close db connection on process exit
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error while closing the database:', err.message);
    } else {
      console.log('SQLite database closed.');
    }
  });
  process.exit(0);
});
