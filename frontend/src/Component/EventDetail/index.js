import React , {Component} from "react";
import superagent from "superagent";
import "../../App.css";
import Moment from "react-moment";
import cross from "../../cross.png"
import { NavLink } from "react-router-dom"
import DOMPurify from "dompurify";

const URL = process.env.REACT_APP_URL;


class EventDetail extends Component {
  constructor(props){
  super(props)
  this.state = {
    id: this.props.match.params.eventId,
    individualEvent: {}
  }
}
componentDidMount(){
  window.scrollTo(0, 0);
  superagent
      .get(URL + 'events/' + this.state.id)
      .set("Content-Type", "application/json")
      .then(res => {
        console.log(res.body)
        const event = res.body.event;
        this.setState({
          individualEvent: event,
        });
      })
      .catch(err => {
        console.log("error", err);
      });
    }
  render(){
    const {id , individualEvent} = this.state;
    return(
      <div>
      <div style={{ paddingTop: "0px", width: "100vw" }}>
            <NavLink
            to="/"
              style={{ position: "absolute", right: "20px", top: "20px" }}
              className="close"
              
            >
              <img src={cross} width="30px" height="30px" alt="close" />
            </NavLink>
            <section className="upper">
              <h2
                className="text-center"
                style={{ textTransform: "capitalize" }}
              >
                {individualEvent.name}
              </h2>
              <h4 className="text-center">
                {individualEvent.creatorname}
              </h4>
               <h4 className="text-center">
              <b> Venue:</b>
                {individualEvent.venue}
              </h4>
              <h5 className="text-center">
                Time-
                <Moment format="HH:mm A">
                  {individualEvent.date}
                </Moment>
              </h5>
              <hr style={{ borderBottom: "2px solid rgba(255,255,255,0.8)" }} />
            </section>
            <section className="lower">
              <form className="scroll">
                <div
                  className="text-center"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      individualEvent.description
                    )
                  }}
                />
              </form>
              <br />
              <hr style={{ borderBottom: "2px solid rgba(255,255,255,0.8)" }} />
            </section>
          </div>
       
      </div>
      )
      }
      }
export default EventDetail;
