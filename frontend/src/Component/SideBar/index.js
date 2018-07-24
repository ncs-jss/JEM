import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import superagent from "superagent";
import event from "../../event.png";
import create from "../../create.png";
import dashboard from "../../dashboard.png";
import log from "../../log.png";
import logo from "../../logo.png";
import "../../App.css";
class SideBar extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false
    };
  }
  getAuthenticationToken() {
    return localStorage.getItem("token");
  }

  handleLogout = () => {
    superagent
      .del("http://54.157.21.6:8089/logout")
      .set("x-auth", this.getAuthenticationToken())
      .then(res => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        console.log(res);
      })
      .catch(err => console.log(err));
  };
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return token && token.length > 10;
  }
  render() {
    const isAlreadyAuthenticated = this.isAuthenticated();
    return (
      <div className="App">
        <nav
          className="navbar navbar-expand-lg navbar-dark bg-primary-main fixed-top"
          id="sideNav"
          style={{ backgroundColor: "#fff!important" }}
        >
          <img className="logo" src={logo} alt="logo" />
          <NavLink to="/" className="navbar-brand d-block d-md-none">
            <span className="eventmanager">{this.props.head}</span>
          </NavLink>
          <NavLink to="/" className="navbar-brand d-none d-md-block">
            <span className="eventmanager">EVENT MANAGER</span>
          </NavLink>{" "}
          <hr
            className="d-none d-md-block"
            width="90%"
            style={{ borderBottom: "2px solid black" }}
          />
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <hr className="d-block d-md-none" width="100%" />
            <ul className="navbar-nav">
              <li className="nav-item">
                <img src={event} className="icon" width="35px" alt="event" />
                <NavLink className="navlink" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <img src={event} className="icon" width="35px" alt="event" />
                <NavLink className="navlink" to="/past">
                  PastEvents
                </NavLink>
              </li>
              {isAlreadyAuthenticated ? (
                <div>
                  <li className="nav-item">
                    <img
                      src={dashboard}
                      className="icon"
                      width="30px"
                      alt="dashboard"
                    />
                    <NavLink
                      className="navlink"
                      activeClassName="active"
                      to="/dashboard"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <img
                      src={create}
                      className="icon"
                      width="30px"
                      alt="create"
                    />
                    <NavLink
                      className="navlink"
                      activeClassName="active"
                      to="/create"
                    >
                      Create
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <img src={log} className="icon" width="30px" alt="logout" />
                    <NavLink to="#">
                      <button className="logout" onClick={this.handleLogout}>
                        Logout
                      </button>
                    </NavLink>
                  </li>
                </div>
              ) : (
                <li className="nav-item">
                  <img src={log} className="icon" width="35px" alt="login" />
                  <NavLink className="navlink" to="/login">
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default SideBar;
