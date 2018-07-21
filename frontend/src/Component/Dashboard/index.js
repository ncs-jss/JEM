import React, { Component } from "react";
import superagent from "superagent";
import NavBar from "../NavBar";
import Moment from "react-moment";
import footer from "../../footer.png";
import CKEditor from "react-ckeditor-component";
import cross from "../../cross.png";
import "../../App.css";
import { NavLink } from "react-router-dom";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import moment from "moment";
import "rc-datetime-picker/dist/picker.min.css";
class Event extends Component {
  constructor() {
    super();
    this.state = {
      event: [],
      expand: false,
      name: "",
      date: "",
      description: "",
      id: "",
      loading: true,
      content: "",
      edit: "Edit",
      none: false,
      moment: moment(),
      current: moment(),
      head: "DASHBOARD"
    };
  }
  getAuthenticationToken() {
    return localStorage.getItem("token");
  }
  ExpandMore(id) {
    superagent
      .get("http://54.157.21.6:8089/events/" + id)
      .set("Content-Type", "application/json")
      .then(res => {
        const name = res.body.event.name;
        const date = res.body.event.date;
        const description = res.body.event.description;
        const id = res.body.event._id;
        console.log(id);
        this.setState({
          expand: true,
          name: name,
          moment: moment(date),
          content: description,
          id: id
        });
      })
      .catch(err => {
        console.log("error", err);
      });
  }
  updateContent = newContent => {
    this.setState({
      content: newContent
    });
    console.log(this.state.content);
  };

  onChange = evt => {
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
    console.log(this.state.content);
  };

  onBlur = evt => {
    console.log("onBlur event called with event info: ", evt);
  };

  afterPaste = evt => {
    console.log("afterPaste event called with event info: ", evt);
  };
  handlename = event => {
    this.setState({
      name: event.target.value
    });
  };
  handleChange = moment => {
    this.setState({
      moment
    });
  };
  handleData(e, id) {
    e.preventDefault();
    this.setState({
      edit: "Editing"
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
      .patch("http://54.157.21.6:8089/events/" + id)
      .set("x-auth", this.getAuthenticationToken())
      .send(payload)
      .then(res => {
        this.setState({
          expand: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  ExpandLess = () => {
    this.setState({
      expand: false
    });
  };
  handleDelete(id) {
    const remainingEvents = this.state.event.filter(event => event._id !== id);
    this.setState({
      event: remainingEvents
    });
    superagent
      .del("http://54.157.21.6:8089/events/" + id)
      .set("x-auth", this.getAuthenticationToken())
      .then(res => {
        console.log(res);
      })
      .catch(err => alert(err));
  }
  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 2000);
    superagent
      .get("http://54.157.21.6:8089/dashboard")
      .set("x-auth", this.getAuthenticationToken())
      .set("Content-Type", "application/json")
      .then(res => {
        const event = res.body.UpcomingEvents;
        this.setState({ event: event });
        const array = res.body.length;
        if (array === 0) {
          this.setState({
            none: true
          });
        }
      })
      .catch(err => {
        console.log("error", err);
      });
  }

  render() {
    const shortcuts = {
      Clear: ""
    };
    const isExpand = this.state.expand;
    const id = this.state.id;
    const isNone = this.state.none;
    const { loading } = this.state;

    if (loading) {
      // if your component doesn't have to wait for an async action, remove this block
      return null; // render null when app is not ready
    }
    return (
      <div>
        {isNone ? (
          <div className="bodyleft">
            <NavBar head={this.state.head} />
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "100vh", flexDirection: "column" }}
            >
              <h1 className="text-white">No Events </h1>
              <NavLink to="/create">
                <button className="btn btn-success">Create</button>
              </NavLink>
            </div>
          </div>
        ) : (
          <div>
            {!isExpand ? (
              <div className="bodyleft">
                <div
                  className="container-fluid"
                  style={{ marginBottom: "60px" }}
                >
                  <NavBar head={this.state.head} />
                  {this.state.event.map(data => {
                    const date = data.date;
                    const id = `#${data._id}`;
                    return (
                      <div key={data._id} className="row">
                        <div className="modal" id={data._id}>
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-body">
                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="modal"
                                >
                                  &times;
                                </button>
                                <h4
                                  className="text-center"
                                  style={{ color: "black" }}
                                >
                                  Sure to Delete?
                                </h4>
                              </div>
                              <div className="modal-footer">
                                <button
                                  className="btn btn-danger"
                                  style={{ marginTop: "10px" }}
                                  data-dismiss="modal"
                                  onClick={this.handleDelete.bind(
                                    this,
                                    data._id
                                  )}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="web">
                            <div className="row">
                              <div className="col-md-6">
                                <h6
                                  style={{
                                    textTransform: "capitalize",
                                    marginBottom: "0.35rem",
                                    fontWeight: "bold"
                                  }}
                                  className="name"
                                >
                                  {data.name}
                                </h6>
                                <button
                                  className="btn btn-link d-none d-md-block"
                                  onClick={this.ExpandMore.bind(this, data._id)}
                                >
                                  EDIT
                                </button>
                              </div>
                              <div className="col-md-4">
                                <p
                                  style={{ marginBottom: "0.35rem" }}
                                  className="society"
                                >
                                  {data.creator}
                                </p>
                              </div>
                              <div className="col-md-2">
                                <button
                                  className="btn btn-link d-block d-md-none"
                                  onClick={this.ExpandMore.bind(this, data._id)}
                                >
                                  EDIT
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <button
                            type="button"
                            className="btn btn-danger"
                            data-toggle="modal"
                            data-target={id}
                          >
                            Delete
                          </button>
                          <p className="eventdate">
                            <Moment format="DD MMM YYYY">{date}</Moment>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ width: "100vw" }}>
                <button
                  style={{ position: "absolute", right: "20px", top: "20px" }}
                  className="close"
                  onClick={this.ExpandLess}
                >
                  <img src={cross} width="30px" height="30px" alt="close" />
                </button>
                <form style={{ paddingTop: "5vh" }}>
                  <div
                    className="d-flex align-items-center text-white"
                    id="loginform"
                    style={{
                      backgroundColor: "rgb(6,115,184)",
                      flexDirection: "column"
                    }}
                  >
                    <h1 style={{ fontSize: "28px" }}>Event Manager</h1>
                    <h5>Edit Event</h5>
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Title"
                      onChange={this.handlename}
                      value={this.state.name}
                      id="name"
                      required
                    />
                    <br />
                    <DatetimePickerTrigger
                      shortcuts={shortcuts}
                      moment={this.state.moment}
                      minDate={this.state.current}
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
                      className="login-button text-center"
                      type="submit"
                      onClick={e => this.handleData(e, id)}
                    >
                      {this.state.edit}
                    </button>
                    <br />
                  </div>
                </form>
                <p>
                  <span style={{ color: "red" }}>{this.state.error}</span>
                </p>
              </div>
            )}
            <img
              src={footer}
              className="d-block d-sm-none"
              style={{
                position: "fixed",
                bottom: "0",
                width: "100vw",
                paddingTop: "30px"
              }}
              alt="footer"
            />
          </div>
        )}
      </div>
    );
  }
}
export default Event;
