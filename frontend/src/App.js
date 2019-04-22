import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Event from "./Component/Event";
import Create from "./Component/Create";
import Error from "./Component/Error";
import Dashboard from "./Component/Dashboard";
import Username from "./Component/Username";
import LoginForm from "./Component/LoginForm";
import Past from "./Component/Past";
import DashboardPast from "./Component/DashboardPast";
import EventDetail from "./Component/EventDetail";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Switch>
            <Route path="/" component={Event} exact />
            <Route path="/eventdetail/:eventId" component={EventDetail} exact />
            <Route path="/past" component={Past} exact/>
            <Route path="/login" component={LoginForm} />
            <Route path="/Create" component={Create} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/pastevents" component={DashboardPast} />
            <Route path="/username" component={Username} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
