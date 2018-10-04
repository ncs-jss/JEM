import React, { Component } from "react";
import superagent from "superagent";
import NavBar from "../NavBar";
import CKEditor from "react-ckeditor-component";
import footerweb from "../../web_footer.svg";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import moment from "moment";
import "rc-datetime-picker/dist/picker.min.css";

const URL = process.env.REACT_APP_URL;

class Create extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      date: "",
      submit: "",
      error: "",
      disabled: false,
      text: "Create",
      content: "content",
      moment: moment(),
      current: moment(),
      head: "CREATE"
    };
  }
  updateContent = newContent => {
    this.setState({
      content: newContent
    });
  };

  onChange = evt => {
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
  };

  onBlur = evt => {
    console.log("onBlur event called with event info: ", evt);
  };

  afterPaste = evt => {
    console.log("afterPaste event called with event info: ", evt);
  };
  handleChange = moment => {
    this.setState({
      moment
    });
  };
  getAuthenticationToken() {
    return localStorage.getItem("token");
  }
  handleNameChanged = event => {
    this.setState({
      name: event.target.value
    });
  };

  submitForm = event => {
    event.preventDefault();
    this.setState({
      disabled: true,
      text: " creating"
    });
    const value = this.state.moment;
    const date = new Date(value);
    const new_date = date.toString();
    const payload = {
      name: this.state.name,
      description: this.state.content,
      date: new_date
    };
    superagent
      .post(URL + 'events')
      .set("x-auth", this.getAuthenticationToken())
      .send(payload)
      .then(res => {
        this.setState({
          submit: "Submit Successfully",
          disabled: false,
          text: "created",
          moment: moment(),
          content: "content",
          name: ""
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: "Failed",
          disabled: false
        });
      });
    setTimeout(() => this.setState({ text: "create" }), 3500);
  };
  render() {
    const shortcuts = {
      Clear: ""
    };
    return (
      <div className="bodyleft">
        <NavBar head={this.state.head} />
        <form onSubmit={this.submitForm}>
          <div
            className="d-flex align-items-center"
            id="loginform"
            style={{
              backgroundColor: "rgb(6,115,184)",
              flexDirection: "column",
              paddingTop: "10vh"
            }}
          >
            <h1 className="d-none d-md-block" style={{ color: "#fff" }}>
              Create Event
            </h1>
            <br />
            <input
              type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.handleNameChanged}
              placeholder="Enter Title"
              required
            />
            <br />
            <DatetimePickerTrigger
              shortcuts={shortcuts}
              minDate={this.state.current}
              moment={this.state.moment}
              onChange={this.handleChange}
            >
              <input
                type="text"
                className="form-control"
                value={this.state.moment.format("YYYY-MM-DD HH:mm")}
                readOnly
              />
            </DatetimePickerTrigger>
            <br />
            <br />
            <CKEditor
              activeClass="p10"
              content={this.state.content}
              events={{
                blur: this.onBlur,
                afterPaste: this.afterPaste,
                change: this.onChange
              }}
            />
            <br />
            <br />
            <button
              disabled={this.state.disabled}
              className="login-button text-center"
              type="submit"
            >
              {this.state.text}
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
        <img src={footerweb} className=" d-none d-md-block" alt="footer" />
      </div>
    );
  }
}

export default Create;
