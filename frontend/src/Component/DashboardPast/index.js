import React, { Component } from "react";
import superagent from "superagent";
import NavBar from "../NavBar";
import Moment from "react-moment";
import "../../App.css";
import cross from "../../cross.png";
import footer from "../../footer.png";
import footerweb from "../../web_footer.svg";
import DOMPurify from "dompurify";
import { NavLink } from "react-router-dom";
class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: [],
      expand: false,
      individualEvent: {},
      loading: true,
      Redirect: false,
      head: "PAST EVENTS"
    };
  }

  ExpandMore(id) {
    superagent
      .get("http://54.157.21.6:8089/events/" + id)
      .set("Content-Type", "application/json")
      .then(res => {
        const event = res.body;
        this.setState({
          individualEvent: event,
          expand: true
        });
      })
      .catch(err => {
        console.log("error", err);
      });
  }
  getAuthenticationToken() {
    return localStorage.getItem("token");
  }
  ExpandLess = () => {
    this.setState({
      expand: false
    });
  };
  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 2000);
    superagent
      .get("http://54.157.21.6:8089/dashboard")
      .set("x-auth", this.getAuthenticationToken())
      .set("Content-Type", "application/json")
      .then(res => {
        console.log(res);
        const event = res.body.PastEvents;
        if (event == null) {
          this.setState({
            Redirect: true
          });
        }
        this.setState({
          event: event
        });
      })
      .catch(err => {
        console.log("error", err);
      });
  }

  render() {
    const isExpand = this.state.expand;
    const { loading } = this.state;
    const isRedirect = this.state.redirect;
    if (loading) {
      // if your component doesn't have to wait for an async action, remove this block
      return null; // render null when app is not ready
    }
    return (
      <div>
        {isRedirect ? (
          <div className="bodyleft">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <h1>No Past Event </h1>
            </div>
          </div>
        ) : (
          <div>
            {!isExpand ? (
              <div className="bodyleft" style={{ paddingBottom: "150px" }}>
                <div
                  className="container-fluid"
                  style={{ PaddingBottom: "60px" }}
                >
                  <NavBar head={this.state.head} />
                  {this.state.event.map(data => {
                    const date = data.date;
                    return (
                      <div
                        key={data._id}
                        className="row"
                        style={{
                          backgroundColor: "rgb(15, 140, 219)!important"
                        }}
                      >
                        <div className="col-9">
                          <div className="web">
                            <div className="row">
                              <div className="col-md-5">
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
                                  READ MORE
                                </button>
                              </div>
                              <div className="col-md-3">
                                <p
                                  style={{ marginBottom: "0.35rem" }}
                                  className="society"
                                >
                                  {data.creatorname}
                                </p>
                              </div>
                              <div className="col-md-3 text-center">
                                <p className="eventdate d-none d-md-block">
                                  <Moment format="DD MMM YYYY">{date}</Moment>
                                </p>
                                <button
                                  className="btn btn-link d-block d-md-none"
                                  onClick={this.ExpandMore.bind(this, data._id)}
                                >
                                  READ MORE
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-3">
                          <p
                            className="eventdate d-block d-md-none"
                            style={{ textAlign: "right" }}
                          >
                            <Moment format="DD MMM">{date}</Moment>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ paddingTop: "0px", width: "100vw" }}>
                <button
                  style={{ position: "absolute", right: "20px", top: "20px" }}
                  className="close"
                  onClick={this.ExpandLess}
                >
                  <img src={cross} width="30px" height="30px" alt="close" />
                </button>
                <section className="upper">
                  <h2
                    className="text-center"
                    style={{ textTransform: "capitalize" }}
                  >
                    {this.state.individualEvent.event.name}
                  </h2>
                  <h4 className="text-center">
                    {this.state.individualEvent.event.creatorname}
                  </h4>
                  <h5 className="text-center">
                    Time-
                    <Moment format="HH:mm A">
                      {this.state.individualEvent.event.date}
                    </Moment>
                  </h5>
                  <hr
                    style={{ borderBottom: "2px solid rgba(255,255,255,0.8)" }}
                  />
                </section>
                <section className="lower">
                  <form className="scroll">
                    <div
                      className="text-center"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          this.state.individualEvent.event.description
                        )
                      }}
                    />
                  </form>
                  <br />
                  <hr
                    style={{ borderBottom: "2px solid rgba(255,255,255,0.8)" }}
                  />
                </section>
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
            <img
              src={footerweb}
              className="d-none d-md-block"
              style={{ position: "fixed", bottom: "0", width: "100vw" }}
              alt="footer"
            />
          </div>
        )}
      </div>
    );
  }
}
export default Event;
