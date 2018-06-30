import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import SideBar from './Component/SideBar';
import Error from './Component/Error'
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
        <Switch>
          <Route path='/' component={SideBar} exact></Route>
          <Route component={Error}></Route>
        </Switch>
      </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
