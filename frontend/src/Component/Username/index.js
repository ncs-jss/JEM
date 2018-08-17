import React, { Component } from "react";
import superagent from "superagent";
import NavBar from "../NavBar";
import footer from "../../footer.png";
import footerweb from "../../web_footer.svg";
import { Redirect } from "react-router-dom";
import "../../App.css";
import login from "../../login.gif";
class Create extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      submit: "",
      error: "",
      redirect: false,
      head: "USERNAME"
    };
  }
  componentDidMount() {
    const name = localStorage.getItem("name");
    if (name !== "User") {
      this.setState({
        redirect: true
      });
    }
  }
  getAuthenticationToken() {
    return localStorage.getItem("token");
  }
  handleNameChanged = event => {
    this.setState({
      username: event.target.value
    });
  };

  submitForm = event => {
    event.preventDefault();
    const payload = {
      name: this.state.username
    };
    superagent
      .post("http://yashasingh.tech:8084/user")
      .set("x-auth", this.getAuthenticationToken())
      .send(payload)
      .then(res => {
        this.setState({
          redirect: true,
          submit: "Submit Successfully"
        });
      })
      .catch(err => {
        this.setState({
          error: "Failed"
        });
      });
  };
  render() {
    const redirect = this.state.redirect;
    return (
      <div className="bodyleft">
        {redirect ? (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
        ) : (
          <div>
            <NavBar head={this.state.head} />
            <form onSubmit={this.submitForm}>
              <div
                className="d-flex align-items-center text-white create_height"
                id="loginform"
                style={{
                  backgroundColor: "rgb(6,115,184)",
                  flexDirection: "column",
                  minHeight: "100vh",
                  paddingTop: "15vh"
                }}
              >
                <h2>Enter Username</h2>
                <br />
                <img
                  src={login}
                  width="150px"
                  className="rounded-circle"
                  style={{ marginBottom: "15px" }}
                  alt="login"
                />
                <input
                  type="text"
                  className="form-control"
                  value={this.state.name}
                  onChange={this.handleNameChanged}
                  placeholder="Enter Society/Faculty Name"
                />
                <br />
                <br />
                <button className="login-button text-center" type="submit">
                  SUBMIT
                </button>
                <br />
                <p className="text-center" style={{ color: "#fff" }}>
                  {this.state.submit}
                </p>
                <p className="text-center" style={{ color: "#fff" }}>
                  {this.state.error}
                </p>
                <br />
              </div>
            </form>

            <img
              src={footer}
              className="footerimage d-block d-sm-none"
              alt="footer"
            />
            <img
              src={footerweb}
              className="footerimage d-none d-md-block"
              alt="footer"
            />
          </div>
        )}
      </div>
    );
  }
}

export default Create;
