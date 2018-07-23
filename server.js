/**
 * Server endpoints:
 * / --> "It's working"
 * /signin --> POST = success/failure
 * /register --> POST = user
 * /profile/:userId --> GET = user
 * /image --> PUT = user
 */

const Express = require('express');
const bodyParser = require('body-parser');
const app = Express();
app.use(bodyParser.json());

const db = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
};


app.get('/', (req, res) => {
  res.json(db.users);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  db.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json('User not found');
  }
});

app.post('/signin', (req, res) => {
  if (req.body.email === db.users[0].email &&
      req.body.password === db.users[0].password) {
        res.json('signin');
      } else {
        res.status(401).json('Error logging in');
      }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });

  res.json(db.users[db.users.length - 1]);
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  db.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries += 1;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json('User not found');
  }
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});