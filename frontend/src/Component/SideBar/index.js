import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import './sidebar.css';
import superagent from 'superagent'; 

class SideBar extends Component {
  constructor() {
    super();
    this.state= {
      isAuthenticated: false,
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
         this.setState({
          Authenticated: 'no'
        })
         localStorage.removeItem('token');
         localStorage.removeItem('name');
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
      <div className='App'>
       <nav className="navbar navbar-expand-lg navbar-dark bg-primary-main fixed-top" id="sideNav" style={{backgroundColor: '#fff!important'}}>
      <a className="navbar-brand js-scroll-trigger" href="#page-top">
        <span className="eventmanager" style={{color: 'black'}}>Event Manager</span>
      </a>
      <hr className="d-none d-md-block" width="70%" style={{borderBottom: '2px solid black'}} />
   
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
              <NavLink style={{color: 'black'}} to="/">Events</NavLink>
          </li>
          { isAlreadyAuthenticated ? (
            <div>
          <li className="nav-item">
              <NavLink style={{color: 'black'}} to="/dashboard"> Dashboard </NavLink>
          </li>
          <li className="nav-item">
              <NavLink style={{color: 'black'}} to="/create">Create</NavLink>
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
                    </div> 
            ) : (
          <li className="nav-item">
              <NavLink style={{color: 'black'}} to="/login"> Login </NavLink>
          </li>
          ) 
          }
        </ul>
      </div>
    </nav>
    <p className="d-none">{this.state.Authenticated}</p>
 </div>

    );
  }
}

export default SideBar;
