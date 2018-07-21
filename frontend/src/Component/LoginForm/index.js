import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Login from "../Login";
class Loginform extends Component {
  state = {
    isAuthenticated: false
  };
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return token && token.length > 10;
  }
  handleSuccessfulLogin = () => {
    this.setState({
      isAuthenticated: true
    });
  };
  render() {
    const isAlreadyAuthenticated = this.isAuthenticated();
    return (
      <div>
        {isAlreadyAuthenticated ? (
          <Redirect
            to={{
              pathname: "/username"
            }}
          />
        ) : (
          <Login onSuccessfulLogin={this.handleSuccessfulLogin} />
        )}
      </div>
    );
  }
}

export default Loginform;
