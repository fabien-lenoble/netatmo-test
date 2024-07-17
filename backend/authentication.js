
import sqlite3 from 'sqlite3';

const getUserByMailSqlRequest = 'SELECT * FROM User WHERE mail = ?';
const db = new sqlite3.Database('netatmo.db');

async function authenticate(req, res) {
  // get payload from request body
  if (!req.body) {
    res.status(400).json({ error: 'Missing request body', code: 1 });
    return;
  }

  if (!req.body.mail) {
    res.status(400).json({ error: 'Missing mail parameter', code: 2 });
    return;
  }

  if (!req.body.password) {
    res.status(400).json({ error: 'Missing password parameter', code: 3 });
    return;
  }

  const { mail, password } = req.body;


  let promise = new Promise((resolve, reject) => {
    db.get(getUserByMailSqlRequest, [mail], async (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message, code: 0 });
        return;
      }
      // handle user mail not found
      if (!row) {
        reject({ error: 'No account found with this email', code: 4, status: 404 });
        return
      }

      // handle invalid password
      if (row.password !== password) {
        reject({ error: 'Invalid password', code: 5, status : 401 });
        return
      }

      const token = getTokenFromMail(mail);
      resolve(token)
    });
  })

  try {
    let token = await promise;
    res.json({
      token
    });

  } catch (error) {
    res.status(error.status).json({ error: error.error, code: error.code });
  }

}

async function checkTokenMiddleware(req, res, next) {
  // get bearer token from authorization header
  let token = req.headers['authorization'];
  token = token.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Missing token', code: 6 });
    return;
  }

  // decode token
  console.log("token: ", token);
  const decodedToken = atob(token);
  console.log("decodedToken: ", decodedToken);
  const [mail, password, timestamp] = decodedToken.split(':');
  // check if token is valid
  console.log("mail: ", mail);
  if (await getTokenFromMail(mail) !== token) {
    res.status(401).json({ error: 'Invalid token', code: 7 });
    return;
  }

  // check if token is still valid
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (timestamp !== today.getTime().toString()) {
    res.status(401).json({ error: 'Token expired', code: 8 });
    return;
  }

  next()
}

async function getTokenFromMail(mail) {
  let promise = new Promise((resolve, reject) => {
    db.get(getUserByMailSqlRequest, [mail], (err, row) => {
      console.log("row: ", row);
      if (err) {
        res.status(500).json({ error: err.message, code: 0 });
        return;
      }

      // get today's date at 00:00:00 so that token is valid for the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const token = btoa(`${row.mail}:${row.password}:${today.getTime()}`);
      resolve(token)
    })

  });

  let token = await promise;
  return token;

}

export { authenticate, checkTokenMiddleware };
