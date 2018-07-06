import React, { Component } from 'react';
import superagent from 'superagent';
import NavBar from '../NavBar'
class Create extends  Component {
  constructor() {
    super();
    this.state = {
      name: '' ,
      description: '' ,
      date: ''
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
    handleDateChanged = (event) => {
    this.setState({
      date: event.target.value
    })
  }
  submit = (event) => {
    event.preventDefault();
    const payload = {
      name: this.state.name,
      description: this.state.description,
      date: this.state.date

    }

    superagent
    .post("http://54.157.21.6:8089/events")
      .set('x-auth' , this.getAuthenticationToken())
      .send(payload)
      .then(res => {
        console.log(res.body._id);
    //     const newTodo = {
    //   text: this.state.text , 
    //   _id: res.body._id
    // } 
    //   this.props.addTodo(newTodo)    
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
      <NavBar />
        <div className="wrapper">
          <form 
            className="form-signin"
            onSubmit={this.submit}
            >       
            <h2 className="form-signin-heading text-center">Create Event</h2>
           <input type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.handleNameChanged}
              placeholder="Enter Title"
              />
              <input type="text"
              className="form-control"
              value={this.state.description}
              onChange={this.handleDescriptionChanged}
              placeholder="Enter Description"
              /> 
              <input type="text"
              className="form-control"
              value={this.state.date}
              onChange={this.handleDateChanged}
              placeholder="Enter Date"
              />  
              <br/>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Create</button>   
          </form>
        </div>
        </div>
      );
  }
}

export default Create;

