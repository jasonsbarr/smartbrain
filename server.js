const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const app = Express();

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'smartbrain',
    password: 'smartbrain',
    database: 'smartbrain'
  } 
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  db.select('*').from('users')
    .then(users => {
      if (users.length) {
        res.json(users);
      } else {
        res.status(404).json('No users found.');
      }
    })
    .catch(res.status(400).json('There was a problem.'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
  .then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(404).json('User not found.');
    }
  })
  .catch(err => res.status(400).json('Something went wrong.'));
});

app.post('/signin', (req, res) => {
  if (req.body.email === db.users[0].email &&
      req.body.password === db.users[0].password) {
        res.json(db.users[0]);
      } else {
        res.status(401).json('Error logging in');
      }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx.insert({
        email: loginEmail[0],
        name,
        joined: new Date()
        })
        .into('users')
        .returning('*')
        .then(user => res.json(user[0]))
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("Unable to register."));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where({id}).increment('entries', 1).returning('entries')
    .then(entries => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(404).json('User not found.');
      }
    })
    .catch(err => res.status(400).json('Something went wrong.'));
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});