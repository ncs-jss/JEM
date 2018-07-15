import React, { Component } from 'react';
import superagent from 'superagent'; 
import SideBar from '../SideBar';
import Moment from 'react-moment';
import footer from '../../footer.png';
import footerweb from '../../web_footer.svg';
class Event extends Component {
  constructor(props) {
    super(props);
      this.state = {
        event: [],
        expand: false,
        name: '',
        date: '',
        description: '',
        id: ''
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
        description: description,
        id: id
        });    
      })
      .catch(err => {
        console.log("error", err);
      });
  }
  handlename = (event) => {
    this.setState({
      name: event.target.value
    })
  }
    handledescription = (event) => {
    this.setState({
      description: event.target.value
    })
  }
  
  handleData(e,id) {
    e.preventDefault();
    const value = document.getElementById('date').value
    const date= new Date(value)
    const payload = {
      name: this.state.name,
      description: this.state.description,
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
    return (
      <div> 
        { !isExpand ? (
          <div>
            <div className="container-fluid" style={{marginBottom:'60px'}}>
             <SideBar />
             {this.state.event.map(data => {
              const date = data.date;
            return (
              <div key={data._id} className="row">
                <div className="col-8">
                  <div className="web">
                    <div className="row">
                      <div className="col-md-5">
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
                      <div className="col-md-3">
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
                  <div className="d-block d-md-none">
                 <br/><br/>
                 </div>
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
        <form
        
        >
          <div className="d-flex justify-content-center align-items-center text-white create_height" id="loginform" style={{ backgroundColor: 'rgb(6,115,184)' , flexDirection: 'column'}}>
            <h1 style={{fontSize: '28px'}}>Event Manager</h1>
            <h5>Create Event</h5>
            <br/>
            <img src="http://via.placeholder.com/125x125" className="rounded-circle d-none d-sm-block" style={{marginBottom: '15px'}} alt="login"/>
            <input type="text"
              className="form-control"
              placeholder="Enter Title"
              onChange={this.handlename}
              value={this.state.name}
              id="name"
              />
              <br/>
              <input type="datetime-local"
              className="form-control"
              id="date"
              placeholder="Enter Date"
              />
               <br/><br/>
             <textarea 
              className="textarea"
              placeholder="Enter Description"
              value={this.state.description}
              onChange={this.handledescription}
              style={{height: '100px'}}
              id="description"
              />     
               <br/>
             <br/>
               <button className="login-button text-center" type="submit"
               onClick={(e) => this.handleData(e, id)}
               >EDIT</button>
               <br/>
            </div>
        </form>
        <p>
        <span style={{color:'red'}}>{this.state.error}</span>
        <span>{this.state.submit}</span>
        </p>

        <img src={footer} className="footerimage d-block d-sm-none" alt="footer"/>
        <img src={footerweb} className="footerimage d-none d-md-block" alt="footer"/>
        </div> 
        )
      }
      <img src={footer} className="d-block d-sm-none" style={{position:'fixed' , bottom: '0' , width: '100vw' , paddingTop:'30px'}} alt="footer"/>
      <img src={footerweb} className="d-none d-md-block" style={{width: '100vw'}} alt="footer"/>
    </div>
    );
  }
}
export default Event;


