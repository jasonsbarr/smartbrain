const Express = require('express');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const bodyParser = require('body-parser');
const cors = require('cors');

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

app.use(cors());
app.use(bodyParser.json());

const UsersController = require('./controllers/UsersController');

app.get('/', (req, res) => UsersController.updateEntries(req, res, db));

app.get('/profile/:id', (req, res) => UsersController.updateEntries(req, res, db));

app.post('/signin', (req, res) => UsersController.login(req, res, db, bcrypt));

app.post('/register', (req, res) => UsersController.create(req, res, db, bcrypt));

app.put('/image', (req, res) => UsersController.updateEntries(req, res, db));

app.listen(3000, () => {
  console.log('App is running on port 3000');
});