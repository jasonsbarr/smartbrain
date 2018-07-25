const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const UsersController = require('./controllers/UsersController');
const ImageController = require('./controllers/ImageController');

const app = Express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', UsersController.index());
app.get('/profile/:id', UsersController.get());
app.post('/signin', UsersController.login());
app.post('/register', UsersController.create());
app.post('/imageurl', ImageController.handleApiCall());
app.put('/image', UsersController.updateEntries());

app.listen(3000, () => {
  console.log('App is running on port 3000');
});