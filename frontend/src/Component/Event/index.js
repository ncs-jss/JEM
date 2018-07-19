import React, { Component } from 'react';
import superagent from 'superagent'; 
import SideBar from '../SideBar';
import Moment from 'react-moment';
import '../../App.css';
import bell from  '../../bell.png';
import belltwo from '../../bell2.png'
import cross from '../../cross.png';
import footer from '../../footer.png';
import footerweb from '../../web_footer.svg';
import tune from '../../tune.mp3';
import DOMPurify from 'dompurify';
class Event extends Component {
  constructor(props) {
    super(props);
      this.state = {
        event: [],
        expand: false,
        individualEvent: { },
        loading: true
      }
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
  ImageChange(id) {
    var music = new Audio(tune);
    const user_id = localStorage.getItem('userId');
    const event_id = id;
    const senddata = {
      user_id: user_id,
      event_id: event_id
    }
    console.log(senddata)
    console.log(user_id);
    if( user_id!=="null" && event_id)
    {
      superagent 
        .post('http://54.157.21.6:8089/')
        .set("Content-Type", "application/json")
          .send(senddata)
          .then(res => {
           music.play();  
           document.getElementById(id).src=bell 
           let notices = localStorage.getItem('notices')
            if(notices){
              notices = notices.split(',');
              notices.push(id);
              localStorage.setItem('notices' , notices);
            }
            else {
              notices = new Array();
              notices.push(id);
              localStorage.setItem('notices' , notices);
          }   
              })
      .catch(err => {
        console.log("error", err);
      });
    }
    
  }
  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 2000); 
    superagent
      .get('http://54.157.21.6:8089/')
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
    const { loading } = this.state;
    
    if(loading) { // if your component doesn't have to wait for an async action, remove this block 
      return null; // render null when app is not ready
    }
    return (
      <div> 
        { !isExpand ? (
          <div className="bodyleft" style={{paddingBottom: '150px'}}>
            <div className="container-fluid" style={{PaddingBottom:'60px'}}>
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
              <div key={data._id} className="row" style={{backgroundColor: 'rgb(15, 140, 219)!important'}}>
                <div className="col-9">
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
                      <div className="col-md-3">
                        <p style={{marginBottom:'0.35rem'}} className="society">{data.creatorname}</p>
                      </div>
                      <div className="col-md-3 text-center">
                      <p className="eventdate d-none d-md-block">
                    <Moment format="DD MMM YYYY">
                      {date}
                    </Moment>
                  </p>
                        <button
                         className="btn btn-link d-block d-md-none"
                          onClick={this.ExpandMore.bind(this, data._id)}
                        >
                        READ MORE</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <button 
                    className="bell"
                    onClick={this.ImageChange.bind(this, data._id)}
                    style={{float: 'right'}}>
                    { isNotified ? (
                       <img src={bell} id={data._id} style={{marginTop: '10px'}} width="40px" height="40px" alt="notified"/> 
                       ) : (
                       <img src={belltwo} id={data._id} width="40px" style={{marginTop: '10px'}} height="40px" alt="notify me"/> 
                       )
                    }
                  </button>
                  <div className="d-block d-md-none">
                 <br/><br/>
                 </div>
                  <p className="eventdate d-block d-md-none" style={{textAlign: 'right'}}>
                    <Moment format="DD MMM">
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
          <div style={{paddingTop: '0px' , width: '100vw'}}>
            <button 
              style={{position: 'absolute' , right:'20px' , top:'20px'}}
              className="close"
              onClick={this.ExpandLess}
            >
              <img src={cross} width="30px" height="30px" alt="close" />
            </button>
            <br/>
            <section className="upper">
              <h2 className="text-center" style={{textTransform: 'capitalize'}}>{this.state.individualEvent.event.name}</h2>
              <h4 className="text-center">{this.state.individualEvent.event.creatorname}</h4>
              <h5 className="text-center">Time- 
              <Moment format="HH:mm A">
                      {this.state.individualEvent.event.date}
                    </Moment>
              </h5>
              <hr style={{borderBottom: '2px solid rgba(255,255,255,0.8)'}} />
            </section>
            <section className="lower">
            <form>
              <div className="text-center" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.individualEvent.event.description)}}></div>
              </form>
              <br/>
              <hr style={{borderBottom: '2px solid rgba(255,255,255,0.8)'}} />
            </section>
          </div>  
        )
      }
      <img src={footer} className="d-block d-sm-none" style={{position:'fixed' , bottom: '0' , width: '100vw' , paddingTop:'30px'}} alt="footer"/>
      <img src={footerweb} className="d-none d-md-block" style={{position:'fixed' , bottom: '0' , width: '100vw'}} alt="footer"/>
    </div>
    );
  }
}
export default Event;


