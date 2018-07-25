const Clarifai = require('clarifai');
const env = require('../env');

const clarifai = new Clarifai.App({
  apiKey: env.clarifai
});

const handleApiCall = () => (req, res) => {
  clarifai.models
  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => res.json(data))
  .catch(err => res.status(400).json('Could not fetch data from API.'));
}

module.exports = {
  handleApiCall
};
