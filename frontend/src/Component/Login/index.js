import React, { Component } from 'react';
import superagent from 'superagent';
import SideBar from '../SideBar'
import './login.css'
class Login extends  Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }
  handleusernameChanged(event) {
    this.setState({username: event.target.value});
  }
   handlePasswordChanged(event) {
    this.setState({password: event.target.value});
  }
  submitForm(event) {
    event.preventDefault();
    const payload = {
      username: this.state.username,
      password: this.state.password
    }
    superagent
  .post("http://54.157.21.6:8089/login")
      .set("Content-Type", "application/json")
      .send(payload)
      .then(res => {
        console.log(res.headers);        
        localStorage.setItem("token", res.headers["x-auth"]);
        this.props.onSuccessfulLogin();
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  render() {
    return (
      <div>
      <SideBar />
        <div className="wrapper">
          <form 
            className="form-signin"
            onSubmit={this.submitForm.bind(this)}
            >       
            <h2 className="form-signin-heading">Please login</h2>
            <input type="username"
              className="form-control"
              value={this.state.username}
              onChange={this.handleusernameChanged.bind(this)}
              placeholder="username"
              />
            <input type="password" 
              className="form-control" 
              value={this.state.password} 
              name="password"
              placeholder="Password"
              onChange={this.handlePasswordChanged.bind(this)}
              />      
            <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>   
          </form>
        </div>
      </div>
      );
  }
}

export default Login;
