import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import superagent from 'superagent';
class NavbarMain extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false
    }
  }

  handleLogout = () => {
  this.setState({
    isAuthenticated: false
  })
  }
 
    componentDidMount() {
    superagent
      .get('http://54.157.21.6:8089/protected')
      .then(res => {
         this.setState({ 
            isAuthenticated: true
          });       
      })
      .catch(err => {
        console.log("error", err);
      });
  }

  render() {
     const isAlreadyAuthenticated = this.state.isAuthenticated;
    return (
      <div className="App">
      { !isAlreadyAuthenticated ? <Redirect to={{
        pathname: '/Login'
      }}/> : (
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav">
              <li>
              <NavLink to="#">
                <button
                className="btn btn-link" 
                onClick={this.handleLogout}>
                Logout
                </button>
                </NavLink>
                </li>
            </ul>
          </div>
        </nav>
        )
    }
      </div>
      );
  }
}

export default NavbarMain;
