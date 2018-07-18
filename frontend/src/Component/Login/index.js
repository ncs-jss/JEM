import React, { Component } from 'react';
import superagent from 'superagent';
import SideBar from '../SideBar'
import footer from '../../footer.png';
import footerweb from '../../web_footer.svg';
import '../../App.css';
class Login extends  Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error:'',
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
        localStorage.setItem("token", res.headers["x-auth"]);
        localStorage.setItem("name", res.body.name); 
        this.props.onSuccessfulLogin();
      })
      .catch(err => {
        console.log(err)
       this.setState({
        error: 'Unauthorized'
       })
      });
  }

  render() {
    return (
      <div>
      <SideBar />
      <form 
         onSubmit={this.submitForm}
         >
        <div className="d-flex justify-content-center align-items-center text-white" id="loginform" style={{height: '100vh' , backgroundColor: 'rgb(6,115,184)' , flexDirection: 'column'}}>
          <h1 style={{fontSize: '40px'}}>Event Manager</h1>
          <h3 className="float-right">Login</h3>
          <br/>
          <img src="http://via.placeholder.com/125x125" className="rounded-circle d-none d-md-block" alt="login"/>
          <br/>
          <input type="username"
              className="form-control"
               value={this.state.username}
               onChange={this.handleusernameChanged}
               placeholder="Username"
               />
               <br/>
             <input type="password" 
               className="form-control" 
               value={this.state.password} 
               name="password"
               placeholder="Password"
               onChange={this.handlePasswordChanged}
               />    
               <br/><br/><br/>
               <button className="login-button text-center" type="submit">Login</button>
               <br/>
               <p>{this.state.error}</p>
        </div>
        </form>
        <img src={footer} className="footerimage d-block d-sm-none" alt="footer"/>
        <img src={footerweb} className="footerimage d-none d-md-block" alt="footer"/>
       
      </div>
      );
  }
}

export default Login;
