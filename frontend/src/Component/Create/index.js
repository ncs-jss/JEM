import React, { Component } from 'react';
import superagent from 'superagent';
import { Redirect } from 'react-router-dom';
class Create extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: true
    }
  }
    componentDidMount() {
    superagent
      .get('http://54.157.21.6:8089/protected')
      .then(res => { 
         console.log(res.statusCode);
      })
      .catch(err => {
        console.log("error", err);
        console.log(err.statusCode);
      });
  }
  render() {
    const isAlreadyAuthenticated = this.state.isAuthenticated;
    return (
     <div>
      { !isAlreadyAuthenticated ? <Redirect to={{
        pathname: '/login'
      }}/> : (
        <div>
       <h2>Create</h2>
       </div>
      )
      }
      </div>
    );
  }
}
export default Create;
