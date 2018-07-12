import React, { Component } from 'react';
import superagent from 'superagent';
import NavBar from '../NavBar';
class Create extends  Component {
  constructor() {
    super();
    this.state = {
      name: '' ,
      description: '' ,
      date: '',
      submit: '',
      error: ''
    }
  }
   getAuthenticationToken() {
    return localStorage.getItem('token');
  }
  handleNameChanged = (event) => {
    this.setState({
      name: event.target.value
    })
  }
    handleDescriptionChanged = (event) => {
    this.setState({
      description: event.target.value
    })
  }

  submitForm = (event) => {
    event.preventDefault();
    const value = document.getElementById('date').value
    const date= new Date(value)
    const payload = {
      name: this.state.name,
      description: this.state.description,
      date: date
    }

    superagent
    .post("http://54.157.21.6:8089/events")
      .set('x-auth' , this.getAuthenticationToken())
      .send(payload)
      .then(res => {
       this.setState({
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
    return (
      <div>
      <NavBar />
        <form 
         onSubmit={this.submitForm}
         >
        <div className="d-flex justify-content-center align-items-center text-white create_height" id="loginform" style={{ backgroundColor: 'rgb(6,115,184)' , flexDirection: 'column'}}>
          <h1 style={{fontSize: '40px'}}>Event Manager</h1>
          <h3>Create Event</h3>
          <br/>
          <img src="http://via.placeholder.com/125x125" className="rounded-circle" alt="login"/>
          <br/>
          <input type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.handleNameChanged}
              placeholder="Enter Title"
              />
              <input type="datetime-local"
              className="form-control"
              id="date"
              onChange={this.handleDateChanged}
              placeholder="Enter Date"
              />
               <br/>
             <textarea 
              className="textarea"
              value={this.state.description}
              onChange={this.handleDescriptionChanged}
              placeholder="Enter Description"
              style={{height: '100px'}}
              />     
               <br/>
              <br /><br/>
               <button className="login-button text-center" type="submit">Login</button>
               <br/>
                <p>{this.state.submit}</p>
                <p>{this.state.error}</p>

            </div>
        </form>
        </div>
      );
  }
}

export default Create;

