import React, { Component } from 'react';
import superagent from 'superagent'; 
import SideBar from '../SideBar';
import './event.css';
import bell from  '../../bell.png';
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
  ExpandMore(id)
  {
    console.log(id);
    superagent
      .get('http://54.157.21.6:8089/events/' + id)
      .set("Content-Type", "application/json")
      .then(res => {
        const event = res.body;
         this.setState({ 
          individualEvent: event,
          expand: true
           });  
         console.log(this.state.individualEvent)     
      })
      .catch(err => {
        console.log("error", err);
      });
  }
  ExpandLess() {
    this.setState({
      expand: false
    })
  }
  dateChange(kunal) {
    return 'hi'
  }
  componentDidMount() {
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
  return (
    <div> 
    { !isExpand ? (
      <div>
        <div className="container-fluid">
          <SideBar />
          {this.state.event.map(data => {
            return (
              <div key={data._id} className="row">
                <div className="col-8">
                  <h3 style={{textTransform: 'capitalize' , marginBottom: '1px'}}>
                          {data.name}
                  </h3>
                  <p>NIBBLE COMPUTER SOCIETY</p>
                  <button className="btn btn-link"
                  onClick={this.ExpandMore.bind(this, data._id)}
                  >
                  READ MORE</button>
                </div>
                <div className="col-4">
                  <button className="btn btn-warning" style={{float: 'right'}}>
                  <img src={bell} width="50px" height="50px" alt="notify me"/>
                  </button>
                  <br/><br/><br/>
                  <p style={{float: 'right', paddingRight: '20px'}}>14 Aug 2018</p>
                </div>
              </div>
                )}
            )
          }
        </div>
        <div className="nibble">
          <p className="text-center" style={{fontSize: '14px' , marginBottom: '0px'}}>
            Nibble Computer Society
          </p>
         </div>
      </div>
        ):
        (
            <div>
              <h3>{this.state.individualEvent.event.name}</h3>
              <h3>{this.state.individualEvent.event.description}</h3>
              <button className="btn btn-default"
                 onClick={this.ExpandLess.bind(this)}
                 >
                 Back
              </button>
            </div>
          )
        }
    </div>
    );
}
}
export default Event;
