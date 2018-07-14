import React, { Component } from 'react';
import superagent from 'superagent'; 
import SideBar from '../SideBar';
import Moment from 'react-moment';
import bell from  '../../bell.png';
import belltwo from '../../bell2.png'
import cross from '../../cross.png';
import footer from '../../footer.png';
import footerweb from '../../web_footer.svg';
class Event extends Component {
  constructor(props) {
    super(props);
      this.state = {
        event: [],
        expand: false,
        individualEvent: { } 
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
        const event = res.body;
        this.setState({ 
        individualEvent: event,
        expand: true
        });    
      })
      .catch(err => {
        console.log("error", err);
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
    return (
      <div> 
        { !isExpand ? (
          <div>
            <div className="container-fluid" style={{marginBottom:'60px'}}>
             <SideBar />
             {this.state.event.map(data => {
              const date = data.date;
              let notices = localStorage.getItem('notices');
              let isNotified = false;
              if(notices){
                notices=notices.split(',');
                if(notices.indexOf(data._id)>=0)
                { 
                isNotified=true;
                }
              }
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
                        READ MORE</button>
                      </div>
                      <div className="col-md-4">
                        <p style={{marginBottom:'0.35rem'}} className="society">NIBBLE COMPUTER SOCIETY</p>
                      </div>
                      <div className="col-md-3">
                        <button
                         className="btn btn-link d-block d-md-none"
                        onClick={this.ExpandMore.bind(this, data._id)}
                        >
                        READ MORE</button>
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
          <div style={{paddingTop: '0px'}}>
            <button 
              style={{position: 'absolute' , right:'20px' , top:'20px'}}
              className="close"
              onClick={this.ExpandLess}
            >
              <img src={cross} width="30px" height="30px" alt="close" />
            </button>
            <section className="upper">
              <h1 className="text-center">{this.state.individualEvent.event.name}</h1>
              <h3 className="text-center">Nibble Computer Society</h3>
              <hr style={{borderBottom: '2px solid rgba(255,255,255,0.8)'}} />
            </section>
            <section className="lower">
              <p 
              style={{fontSize: '14px'}}>
                {this.state.individualEvent.event.description}
              </p>
              <br/>
              <hr style={{borderBottom: '2px solid rgba(255,255,255,0.8)'}} />
            </section>
            <div className="nibble">
              <p className="text-center" style={{fontSize: '14px' , marginBottom: '0px'}}>
                Nibble Computer Society
              </p>
            </div>
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


