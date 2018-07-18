import React, { Component } from 'react';
import superagent from 'superagent'; 
import NavBar from '../NavBar';
import Moment from 'react-moment';
import footer from '../../footer.png';
import CKEditor from "react-ckeditor-component";
import cross from '../../cross.png';
import '../../App.css';
class Event extends Component {
  constructor(props) {
    super(props);
      this.state = {
        event: [],
        expand: false,
        name: '',
        date: '',
        description: '',
        id: '',
        loading: true,
        content: '',
        edit: "Edit"
      }
    }
 getAuthenticationToken() {
    return localStorage.getItem('token');
  }
  ExpandMore(id)
  {
    superagent
      .get('http://54.157.21.6:8089/events/' + id)
      .set("Content-Type", "application/json")
      .then(res => {
        const name = res.body.event.name;
        const date = res.body.event.date;
        const description = res.body.event.description;
        const id = res.body.event._id;
        console.log(id)
        this.setState({ 
        expand: true,
        name: name,
        date: date,
        content: description,
        id: id
        });    
      })
      .catch(err => {
        console.log("error", err);
      });
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
  handlename = (event) => {
    this.setState({
      name: event.target.value
    })
  }
  
  handleData(e,id) {
    e.preventDefault();
    this.setState({
      edit: 'Editing'
    })
    const value = document.getElementById('date').value
    const date= new Date(value)
    const payload = {
      name: this.state.name,
      description: this.state.content,
      date: date
    }
    superagent
    .patch("http://54.157.21.6:8089/events/" + id)
      .set('x-auth' , this.getAuthenticationToken())
      .send(payload)
      .then(res => {
       this.setState({
      expand: false
    })
      })
      .catch(err => {
        console.log(err)
      });
  }
   ExpandLess = () => {
    this.setState({
      expand: false
    })
  }
  handleDelete(id) {
    console.log(id)
    const remainingEvents = this.state.event.filter(event => event._id !== id)
    console.log({remainingEvents});
    this.setState({
     event: remainingEvents
    })
    superagent
     .del('http://54.157.21.6:8089/events/' + id)
      .set('x-auth' , this.getAuthenticationToken())
      .then(res => {
        console.log(res);
      })
      .catch(err =>
         console.log(err)
        );
  }
  componentDidMount() {
     setTimeout(() => this.setState({ loading: false }), 2000);
    superagent
      .get('http://54.157.21.6:8089/dashboard')
      .set('x-auth' , this.getAuthenticationToken())
      .set("Content-Type", "application/json")
      .then(res => {
        const event = res.body;
         this.setState({ event: event });       
      })
      .catch(err => {
        console.log("error", err);
      });
  }

  render() {
   const isExpand = this.state.expand;
   const id = this.state.id;
   const { loading } = this.state;
    
    if(loading) { // if your component doesn't have to wait for an async action, remove this block 
      return null; // render null when app is not ready
    }
    return (
      <div> 
        { !isExpand ? (
          <div>
            <div className="container-fluid" style={{marginBottom:'60px'}}>
             <NavBar />
             {this.state.event.map(data => {
              const date = data.date6
            return (
              <div key={data._id} className="row">
                <div className="col-8">
                  <div className="web">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 style={{textTransform: 'capitalize' , marginBottom: '0.35rem' , fontWeight: 'bold'}} className="name">
                          {data.name}
                         </h6>
                         <button
                         className="btn btn-link d-none d-md-block"
                          onClick={this.ExpandMore.bind(this, data._id)}
                        >
                        EDIT</button>
                      </div>
                      <div className="col-md-4">
                        <p style={{marginBottom:'0.35rem'}} className="society">{data.creator}</p>
                      </div>
                      <div className="col-md-2">
                        <button
                         className="btn btn-link d-block d-md-none"
                        onClick={this.ExpandMore.bind(this, data._id)}
                        >
                        EDIT</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <button 
                  className="btn btn-danger"
                  style={{marginTop: '10px'}}
                  onClick={this.handleDelete.bind(this, data._id )}
                  >
                  Delete
                  </button>
                  
                  <p className="eventdate">
                    <Moment format="DD MMM YYYY">
                      {date}
                    </Moment>
                  </p>
                </div>
              </div>
            )}
          )
        }
      </div>
    </div>
        ):
        ( 
        <div>
         <button 
              style={{position: 'absolute' , right:'20px' , top:'20px'}}
              className="close"
              onClick={this.ExpandLess}
            ><img src={cross} width="30px" height="30px" alt="close" />
            </button>
        <form
        >

          <div className="d-flex justify-content-center align-items-center text-white create_height" id="loginform" style={{ backgroundColor: 'rgb(6,115,184)' , flexDirection: 'column'}}>
            <h1 style={{fontSize: '28px'}}>Event Manager</h1>
            <h5>Create Event</h5>
            <br/>
            <input type="text"
              className="form-control"
              placeholder="Enter Title"
              onChange={this.handlename}
              value={this.state.name}
              id="name"
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
               <button className="login-button text-center" type="submit"
               onClick={(e) => this.handleData(e, id)}
               >{this.state.edit}</button>
               <br/>
            </div>
        </form>
        <p>
        <span style={{color:'red'}}>{this.state.error}</span>
        </p>
        </div> 
        )
      }
      <img src={footer} className="d-block d-sm-none" style={{position:'fixed' , bottom: '0' , width: '100vw' , paddingTop:'30px'}} alt="footer"/>
    </div>
    );
  }
}
export default Event;


