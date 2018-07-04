import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import SideBar from './Component/SideBar';
import Create from './Component/Create';
import Error from './Component/Error'
import NavBar from './Component/NavBar'
import Login from './Component/Login'
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
        <Switch>
          <Route path='/' component={SideBar} exact></Route>
          <Route path='/login' component={ Login } exact></Route>
          <Route  path="/App" component= { NavBar } />
          <Route path='/App/create' component={ Create } exact></Route>
          <Route component={Error}></Route>
        </Switch>
      </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
