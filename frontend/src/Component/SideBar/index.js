import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import './sidebar.css';

class SideBar extends Component {
  render() {
    return (
      <div className="wrapper">
        <nav id="sidebar">
          <div className="sidebar-header">
            <h3>Event Manager</h3>
          </div>
          <ul className="list-unstyled components">
            <p>Dummy Heading</p>
          <li className="active">
          <NavLink to="/login">kunal</NavLink>
        </li>
      </ul>
    </nav>
    <div id="content">
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" id="sidebarCollapse" className="btn btn-info navbar-btn">
              <i className="glyphicon glyphicon-align-left"></i>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li>Page</li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </div>
    );
  }
}

export default SideBar;
