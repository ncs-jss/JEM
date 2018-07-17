import React, { Component } from 'react';
import superagent from 'superagent';
import NavBar from '../NavBar';
import footer from '../../footer.png';
import CKEditor from "react-ckeditor-component";
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
      text: 'Create',
      content: "content",
      loading: true
    }
  }
  updateContent = (newContent) => {
    this.setState({
      content: newContent
    });
    console.log(this.state.content)
  }

  onChange = (evt) => {
    
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
    console.log(this.state.content)
  }

  onBlur = (evt) => {
    console.log("onBlur event called with event info: ", evt);
  }

  afterPaste = (evt) => {
    console.log("afterPaste event called with event info: ", evt);
  }

   getAuthenticationToken() {
    return localStorage.getItem('token');
  }
  handleNameChanged = (event) => {
    this.setState({
      name: event.target.value
    })
  }
  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 1500); 
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
      description: `<html><head></head><body>${this.state.content}</body></html>`,
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
    const { loading } = this.state;
    if(loading) { // if your component doesn't have to wait for an async action, remove this block 
      return null; // render null when app is not ready
    }
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
             <CKEditor
        activeClass="p10"
        content={this.state.content}
        events={{
          blur: this.onBlur,
          afterPaste: this.afterPaste,
          change: this.onChange
        }}
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
       
        <img src={footer} className="d-block d-sm-none" style={{width: '100vw'}} alt="footer"/>
        <img src={footerweb} className=" d-none d-md-block" alt="footer"/>

        </div>
      );
  }
}

export default Create;

