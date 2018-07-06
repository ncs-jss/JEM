import React, { Component } from 'react';
import superagent from 'superagent'; 
import SideBar from '../SideBar';
class Protected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: [],
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
  return (
    <div className="App"> 
    <SideBar />
    <h1 style={{textAlign: 'center'}}>Events</h1>
    <br/>
      {this.state.event.map(data => {
        const id= '#' + data._id
          return (
              <div key={data._id} className="text-center">

                  <h3 style={{display: 'inline-block'}}>
                      {this.state.event.indexOf(data)+1})&nbsp;
                  </h3>
                  <h3 style={{ textTransform: "upperCase" , display: 'inline-block' }}>
                          { data.name}
                  </h3>
                  <h3>{data.description}</h3>
                  <p>{data.date}</p>
                  <button 
                      className="btn btn-danger"
                      id={data._id}
                      onClick={this.handleDelete.bind(this, data._id )}>
                      Delete
                  </button>
                  <button 
                      className="btn btn-primary" 
                      data-toggle="modal" 
                      data-target={id}>
                      Edit
                  </button>
                   <div className="modal" id={data._id}>
                      <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                          <h4 className="modal-title">Modal Heading</h4>
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            Modal body..
                          </div> 
                        </div>
                      </div>
                    </div>
              </div>
          );
        })}
    </div>
    );
  }
}
export default Protected;
