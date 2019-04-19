import React, { Component } from "react";
import superagent from "superagent";
import SideBar from "../SideBar";
import Moment from "react-moment";
import "../../App.css";
import bell from "../../bell.png";
import belltwo from "../../bell2.png";
import cross from "../../cross.png";
import footer from "../../footer.png";
import footerweb from "../../web_footer_new.svg";
import tune from "../../tune.mp3";
import DOMPurify from "dompurify";
import { NavLink } from "react-router-dom";
import { setScroll, getScroll } from "./scroll";



const URL = process.env.REACT_APP_URL;

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: [],
      expand: false,
      individualEvent: {},
      loading: true,
      head: "EVENT MANAGER"
    };
  }

  ImageChange(id) {
    var music = new Audio(tune);
    const user_id = localStorage.getItem("userId");
    const event_id = id;
    const senddata = {
      user_id: user_id,
      event_id: event_id
    };
    if (user_id !== "null" && event_id) {
      superagent
        .post(URL)
        .set("Content-Type", "application/json")
        .send(senddata)
        .then(res => {
          music.play();
          document.getElementById(id).src = bell;
          let notices = localStorage.getItem("notices");
          if (notices) {
            notices = notices.split(",");
            notices.push(id);
            localStorage.setItem("notices", notices);
          } else {
            notices = new Array();
            notices.push(id);
            localStorage.setItem("notices", notices);
          }
        })
        .catch(err => {
          alert(err);
        });
    }
  }
  componentDidMount() {
    let scrollValue = getScroll();
    superagent
      .get(URL)
      .set("Content-Type", "application/json")
      .then(res => {
        const event = res.body;
        this.setState({ event: event });
    window.scrollTo(0, scrollValue);

      })
      .catch(err => {
        console.log("error", err);
      });
      
  }

  componentWillUnmount(){
    setScroll(window.pageYOffset);
  }

  render() {
    const isExpand = this.state.expand;
    const { loading } = this.state;

    return (
      <div>
        {!isExpand ? (
          <div className="bodyleft" style={{ paddingBottom: "150px" }}>
            <div className="container-fluid" style={{ PaddingBottom: "60px" }}>
              <SideBar head={this.state.head} />
              {this.state.event.map(data => {
                const date = data.date;
                let notices = localStorage.getItem("notices");
                let isNotified = false;
                if (notices) {
                  notices = notices.split(",");
                  if (notices.indexOf(data._id) >= 0) {
                    isNotified = true;
                  }
                }
                return (
                  <div
                    key={data._id}
                    className="row"
                    style={{ backgroundColor: "rgb(15, 140, 219)!important" }}
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
                            
                             <NavLink
                             className="btn btn-link w-25 d-none d-md-block"
                             onClick={this.expand}
                
                to={`/eventdetail/${data._id}`}
              >Read More
              </NavLink>
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
                             <NavLink
                             className="btn btn-link w-50 d-block d-md-none"

                                to={`/eventdetail/${data._id}`}
                              >
                              Read More
                              </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-3">
                      <button
                        className="bell"
                        onClick={this.ImageChange.bind(this, data._id)}
                        style={{ float: "right" }}
                      >
                        {isNotified ? (
                          <img
                            src={bell}
                            id={data._id}
                            style={{ marginTop: "10px" }}
                            width="40px"
                            height="40px"
                            alt="notified"
                          />
                        ) : (
                          <img
                            src={belltwo}
                            id={data._id}
                            width="40px"
                            style={{ marginTop: "10px" }}
                            height="40px"
                            alt="notify me"
                          />
                        )}
                      </button>
                      <div className="d-block d-md-none">
                        <br />
                        <br />
                      </div>
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
              <hr style={{ borderBottom: "2px solid rgba(255,255,255,0.8)" }} />
            </section>
            <section className="lower">
              <form>
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
              <hr style={{ borderBottom: "2px solid rgba(255,255,255,0.8)" }} />
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
    );
  }
}
export default Event;
