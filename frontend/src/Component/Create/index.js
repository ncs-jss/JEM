import React, { Component } from 'react';
import superagent from 'superagent';
import NavBar from '../NavBar';
import footer from '../../footer.png';
import footerweb from '../../web_footer.svg';
class Create extends  Component {
  constructor() {
    super();
    this.state = {
      name: '' ,
      description: '' ,
      date: '',
      submit: '',
      error: '',
      disabled: false,
      text: 'Create'
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
    this.setState({ 
      disabled: true,
      text:' creating'
       });
    const value = document.getElementById('date').value
    const date= new Date(value)
    console.log(date)
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
        submit: 'Submit Successfully',
        disabled: false,
        text: 'created'
       })   
      })
      .catch(err => {
        this.setState({
          error: 'Failed'
        })
      });
     setTimeout(() => this.setState({ text: "create" }), 3500);
  }
  render() {
    let date=new Date();
    return (
      <div>
      <NavBar />
        <form 
         onSubmit={this.submitForm}
         >
        <div className="d-flex justify-content-center align-items-center text-white create_height" id="loginform" style={{ backgroundColor: 'rgb(6,115,184)' , flexDirection: 'column'}}>
          <h1 style={{fontSize: '28px'}}>Event Manager</h1>
          <h5>Create Event</h5>
          <br/>
          <img src="http://via.placeholder.com/125x125" className="rounded-circle d-none d-sm-block" style={{marginBottom: '15px'}} alt="login"/>
         
          <input type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.handleNameChanged}
              placeholder="Enter Title"
              required
              />
              <br/>
              <input type="datetime-local"
              className="form-control"
              id="date"
              required
              />
               <br/><br/>
             <textarea 
              className="textarea"
              onChange={this.handleDescriptionChanged}
              placeholder="Enter Description"
              style={{height: '100px'}}
              required
              />     
               <br/>
             <br/>
               <button 
               disabled={this.state.disabled}
               className="login-button text-center" type="submit">{this.state.text}</button>
               <br/>
                <p className="text-center" style={{color: '#fff'}}>{this.state.submit}</p>
                <p className="text-center" style={{color: '#fff'}}>{this.state.error}</p>
               <br/>
            </div>
        </form>
       
        <img src={footer} className="footerimage d-block d-sm-none" alt="footer"/>
        <img src={footerweb} className="footerimage d-none d-md-block" alt="footer"/>

        </div>
      );
  }
}

export default Create;

