import React, { Component } from "react";
import superagent from "superagent";
import SideBar from "../SideBar";
import footer from "../../footer.png";
import footerweb from "../../web_footer.svg";
import "../../App.css";
import login from "../../login.gif";
class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      error: "",
      disabled: false,
      head: "LOGIN"
    };
  }
  handleusernameChanged = event => {
    this.setState({ username: event.target.value });
  };
  handlePasswordChanged = event => {
    this.setState({ password: event.target.value });
  };
  submitForm = event => {
    event.preventDefault();
    this.setState({
      disabled: true
    });
    const payload = {
      username: this.state.username,
      password: this.state.password
    };
    superagent
      .post("http://yashasingh.tech:8084/login")
      .set("Content-Type", "application/json")
      .send(payload)
      .then(res => {
        localStorage.setItem("token", res.headers["x-auth"]);
        localStorage.setItem("name", res.body.name);
        this.props.onSuccessfulLogin();
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: "Unauthorized",
          disabled: false
        });
      });
  };

  render() {
    return (
      <div className="bodyleft">
        <SideBar head={this.state.head} />
        <form onSubmit={this.submitForm}>
          <div
            className="d-flex  align-items-center text-white"
            id="loginform"
            style={{
              backgroundColor: "rgb(6,115,184)",
              flexDirection: "column",
              paddingTop: "15vh"
            }}
          >
            <h1 className="float-right d-none d-md-block">Login</h1>
            <img src={login} width="150px" alt="login" />
            <input
              type="username"
              className="form-control"
              value={this.state.username}
              onChange={this.handleusernameChanged}
              placeholder="Username"
            />
            <br />
            <input
              type="password"
              className="form-control"
              value={this.state.password}
              name="password"
              placeholder="Password"
              onChange={this.handlePasswordChanged}
            />
            <br />
            <br />
            <br />
            <button
              disabled={this.state.disabled}
              className="login-button text-center"
              type="submit"
            >
              Login
            </button>
            <br />
            <p>{this.state.error}</p>
          </div>
        </form>
        <img
          src={footerweb}
          className="footerimage d-none d-md-block"
          alt="footer"
        />
      </div>
    );
  }
}

export default Login;
