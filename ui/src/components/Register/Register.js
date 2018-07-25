import React from 'react';
import config from '../../config';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: ''
    };
  }

  onEmailChange = (e) => {
    this.setState({email: e.target.value});
  };
  
  onPasswordChange = (e) => {
    this.setState({password: e.target.value});
  };
  
  onNameChange = (e) => {
    this.setState({name: e.target.value});
  };

  onRegisterSubmit = () => {
    fetch(`${config.apiUrl}/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      })
    }).then(response => response.json())
      .then(user => {
        if (user.id) {
          this.props.loadUser(user);
          this.props.onRouteChange('home');
        }
      })
  };

  render(props) {
    return (
      <div className='br3 ba b--black-10 mv4 mw6 shadow-5 center'>
        <main className="pa4 black-80">
          <form className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                <input
                  onChange={this.onNameChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  onChange={this.onPasswordChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
            </fieldset>
            <div className="">
              <button
                onClick={this.onRegisterSubmit}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                type="button"
              >
                Register
              </button>
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => this.props.onRouteChange('signin')} className="f6 link dim black pointer db underline">Sign in</p>
            </div>
          </form>
        </main>
      </div>
    );
  }
}

export default Register;