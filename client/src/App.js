// Libraries
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";

// Utility
import { authenticate } from "./utils/auth";

// Components
import Login from "./components/auth/Login.js";
import Register from "./components/auth/Register.js";
import DuckNavbar from "./components/Navbar.js";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import UserProfile from "./components/profile/UserProfile";
import UserChat from "./components/chat/UserChat";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import Leaderboard from "./components/Leaderboard";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: {},
      users: [],
      posts: []
    };
  }

  fecthData = async () => {
    try {
      // get all users and posts to pass down to other components
      const usersResponse = await axios.get(
        "https://cluster-duck-server.herokuapp.com/api/users/"
      );
      this.setState({ users: usersResponse.data });

      const postsResponse = await axios.get(
        "https://cluster-duck-server.herokuapp.com/api/posts/"
      );
      this.setState({ posts: postsResponse.data });
    } catch (err) {
      console.error(err);
    }
  };

  getAuth = authInfo => {
    if (authInfo) this.setState({ auth: authInfo });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    let should = false;

    if (this.state.auth !== nextState.auth) should = true;
    else if (this.state.users !== nextState.users) should = true;
    else if (this.state.posts !== nextState) should = true;

    return should;
  };

  render() {
    const isAuth = authenticate();
    return (
      <Router>
        <ProtectedRoute
          path="/"
          getAuth={this.getAuth}
          component={DuckNavbar}
          auth={isAuth}
        />
        <ProtectedRoute
          exact
          path="/profile/:email"
          auth={isAuth}
          component={UserProfile}
        />
        <ProtectedRoute
          exact
          path="/leaderboard"
          auth={isAuth}
          component={Leaderboard}
        />
        <ProtectedRoute
          exact
          path="/chat"
          auth={isAuth}
          component={UserChat}
        />
        <Route exact path="/login">
          <Login getAuth={this.getAuth} auth={isAuth} />
        </Route>
        <Route exact path="/register">
          <Register auth={isAuth} />
        </Route>
      </Router>
    );
  }
}

export default App;
