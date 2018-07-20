import React, { Component } from 'react';
import superagent from 'superagent';
import NavBar from '../NavBar';
import footer from '../../footer.png';
import footerweb from '../../web_footer.svg';
import { Redirect } from 'react-router-dom';
import '../../App.css';
class Create extends  Component {
  constructor() {
    super();
    this.state = {
      username: '',
      submit: '',
      error: '',
      redirect: false,
      head: 'USERNAME'
    }
  }
  componentDidMount() {
    const name=localStorage.getItem('name');
    console.log(name);
    if(name!=='User')
    {
     this.setState({
      redirect: true
     })
    }
  }
   getAuthenticationToken() {
    return localStorage.getItem('token');
  }
  handleNameChanged = (event) => {
    this.setState({
      username: event.target.value
    })
  }

  submitForm = (event) => {
    event.preventDefault();
    const payload = {
      name: this.state.username
    }
    superagent
    .post("http://54.157.21.6:8089/user")
      .set('x-auth' , this.getAuthenticationToken())
      .send(payload)
      .then(res => {
       this.setState({
        redirect: true,
        submit: 'Submit Successfully'
       })   
      })
      .catch(err => {
        this.setState({
          error: 'Failed'
        })
      });
  }
  render() {
    const redirect = this.state.redirect;
    return (
      <div>
      { redirect ? <Redirect to={{
        pathname: '/'
      }}/> : (
        <div>
      <NavBar head={this.state.head} />
        <form 
         onSubmit={this.submitForm}
         >
        <div className="d-flex justify-content-center align-items-center text-white create_height" id="loginform" style={{ backgroundColor: 'rgb(6,115,184)' , flexDirection: 'column'}}>
          <h1 style={{fontSize: '28px'}}>Event Manager</h1>
          <h5>Enter Username</h5>
          <br/>
          <img src="http://via.placeholder.com/125x125" className="rounded-circle d-none d-sm-block" style={{marginBottom: '15px'}} alt="login"/>
          <input type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.handleNameChanged}
              placeholder="Enter Society/Faculty Name"
              />
               <br/>
             <br/>
               <button className="login-button text-center" type="submit">SUBMIT</button>
               <br/>
                <p className="text-center" style={{color: '#fff'}}>{this.state.submit}</p>
                <p className="text-center" style={{color: '#fff'}}>{this.state.error}</p>
               <br/>
            </div>
        </form>
       
        <img src={footer} className="footerimage d-block d-sm-none" alt="footer"/>
        <img src={footerweb} className="footerimage d-none d-md-block" alt="footer"/>
        </div>
        )
    }
        </div>
      );
  }
}

export default Create;

