const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'smartbrain',
    password: 'smartbrain',
    database: 'smartbrain'
  } 
});

const index = () => (_, res) => {
  db.select('*').from('users').orderBy('id', 'asc')
    .then(users => {
      if (users.length) {
        res.json(users);
      } else {
        res.status(404).json('No users found.');
      }
    })
    .catch(err => res.status(400).json('There was a problem.'));
};

const get = () => (req, res) => {
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
};

const create = () => (req, res) => {
  const { email, name, password } = req.body;

  if (!validateRegister(email, name, password)) {
    return res.status(400).json('You must enter all the required information.');
  }
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
};

const login = () => (req, res) => {
  const { email, password } = req.body;

  if (!validateLogin(email, password)) {
    return res.status(401).json('The username and password combination is invalid.');
  }
  db.select('email', 'hash').from('login').where('email', email)
  .then(data => {
    if (bcrypt.compareSync(password, data[0].hash)) {
      return db.select('*').from('users').where('email', email)
      .then(user => res.json(user[0]))
      .catch(err => res.status(400).json('Error fetching user.'));
    }
    res.status(401).json('Email/password combination is invalid.');
  })
};

const updateEntries = () => (req, res) => {
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
};

function validateRegister(args) {
  const [email, name, password] = args;
  let valid = false;
  if (email && name && password) {
    valid = true;
  }

  return valid;
}

function validateLogin(args) {
  const [email, password] = args;
  let valid = false;
  if (email && password) {
    valid = true;
  }

  return valid;
}

module.exports = {
  index,
  get,
  create,
  login,
  updateEntries
};