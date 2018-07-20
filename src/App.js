import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Api from './Api.js';
import './App.css';

const particlesParams = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const clarifai = new Clarifai.App({
  apiKey: Api.apiKey
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Transparent5x5.gif'
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    clarifai.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input
    ).then(
      response => console.log(response.outputs[0].data.regions[0].region_info.bounding_box),
      err => console.log(err)
    );
  };

  render() {
    return (
      <div className="App">
        <Navigation />
        <Particles className='particles' params={particlesParams} />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={ this.state.imageUrl } />
      </div>
    );
  }
}

export default App;
