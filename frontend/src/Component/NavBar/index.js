import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import superagent from 'superagent';
class NavbarMain extends Component {
  constructor() {
    super();
    this.state = {
      Authenticated: ''
    }
  }
 getAuthenticationToken() {
    return  localStorage.getItem('token');
  }

  handleLogout = () => {
      superagent
     .del('http://54.157.21.6:8089/logout')
      .set('x-auth' , this.getAuthenticationToken())
      .then(res => {
         localStorage.removeItem('token');
         localStorage.removeItem('name');
        this.setState({
          Authenticated: 'no'
        })
       
        console.log(res)
        })
       .catch(err =>
          console.log(err)
         );
           
      
  }
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return token && token.length > 10;
  }
  render() {
     const isAlreadyAuthenticated = this.isAuthenticated();
    return (
      <div className="App">
      { !isAlreadyAuthenticated ? <Redirect to={{
        pathname: '/Login'
      }}/> : (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary-main fixed-top" id="sideNav" style={{backgroundColor: '#fff!important'}}>
      <a className="navbar-brand js-scroll-trigger" href="#page-top">
        <span className="eventmanager" style={{color: 'black'}}>Event Manager</span>

      </a>
      <hr className="d-none d-sm-block" width="70%" style={{borderBottom: '2px solid black'}} />
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink  to=""> Events</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="#">
                <button
                className="logout" 
                onClick={this.handleLogout}>
                Logout
                </button>
            </NavLink>
          </li>
          <li className="nav-item">
             <NavLink to="/dashboard">Dashboard</NavLink>
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
