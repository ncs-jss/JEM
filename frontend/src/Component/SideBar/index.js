import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import './sidebar.css';

class SideBar extends Component {
  constructor() {
    super();
    this.state= {
      isAuthenticated: false
    }
  }
   getAuthenticationToken() {
    return localStorage.getItem('token');
  }
  render() {
    return (
      <div className='App'>
       <nav className="navbar navbar-expand-lg navbar-dark bg-primary-main fixed-top" id="sideNav">
      <a className="navbar-brand js-scroll-trigger" href="#page-top">
        <span style={{color: 'black' , fontSize: '24px'}}>Event Manager</span>
      </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
              <NavLink style={{color: 'black'}} to=""> Events</NavLink>
          </li>
          <li className="nav-item">
              <NavLink style={{color: 'black'}} to="/login"> Login </NavLink>
          </li>
           <li className="nav-item">
             <NavLink style={{color: 'black'}} to="/Create">Create</NavLink>
          </li>
        </ul>
      </div>
    </nav>
 </div>

    );
  }
}

export default SideBar;
