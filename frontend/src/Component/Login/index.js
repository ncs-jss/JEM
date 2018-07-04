import React, { Component } from 'react';
import superagent from 'superagent';
import { Redirect } from 'react-router-dom';
import './login.css'
class Login extends  Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      isAuthenticated: false
    }
  }
  handleusernameChanged = (event) => {
    this.setState({username: event.target.value});
  }
   handlePasswordChanged = (event) => {
    this.setState({password: event.target.value});
  }
  submitForm = (event) => {
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
        console.log(res);        
        this.setState({
          isAuthenticated: true
        })
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  render() {
    const isAlreadyAuthenticated = this.state.isAuthenticated;
    return (
      <div>
      { isAlreadyAuthenticated ? <Redirect to={{
        pathname: '/App/create'
      }}/> : ( 
        <div className="wrapper">
          <form 
            className="form-signin"
            onSubmit={this.submitForm}
            >       
            <h2 className="form-signin-heading">Please login</h2>
            <input type="username"
              className="form-control"
              value={this.state.username}
              onChange={this.handleusernameChanged}
              placeholder="username"
              />
            <input type="password" 
              className="form-control" 
              value={this.state.password} 
              name="password"
              placeholder="Password"
              onChange={this.handlePasswordChanged}
              />      
            <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>   
          </form>
        </div>
        )
      }
      </div>
      );
  }
}

export default Login;
