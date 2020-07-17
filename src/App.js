import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar.js';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import axios from 'axios';
import './App.css';

class App extends Component {

  state = {
    users: [],
    loading: false,
    alert: null,
    user: {},
    repos: []
  };

  github = axios.create({
    baseURL: 'https://api.github.com',
    timeout: 1000,
    headers: { Authorization: process.env.REACT_APP_GITHUB_TOKEN }
  });
  //Search Github Users
  searchUsers = async (text) => {
    this.setState({ loading: true })

    const res = await this.github.get(`/search/users?q=${text}`);

    this.setState({ users: res.data.items, loading: false });
  }

  //Get single Github user
  getUser = async (username) => {
    this.setState({ loading: true });

    const res = await this.github.get(`/users/${username}`);

    this.setState({ user: res.data, loading: false });
  }

  //Get user repos
  getUserRepos = async (username) => {
    this.setState({ loading: true });

    const res = await this.github.get(`/users/${username}/repos?per_page=5&sort=created:asc`);

    this.setState({ repos: res.data, loading: false });
  }

  //Clear users from state
  clearUsers = () => this.setState({ users: [], loading: false });

  //Set Alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg: msg, type: type } });

    setTimeout(() => this.setState({ alert: null }), 5000);
  }

  render() {
    const { users, user, loading, repos } = this.state;

    return (
      <Router>
        <div className='App'>
          <Navbar />
          <div className='container'>
            <Alert alert={this.state.alert} />
            <Switch>
              <Route exact path='/' render={props => (
                <Fragment>
                  <Search searchUsers={this.searchUsers} clearUsers={this.clearUsers} showClear={users.length > 0 ? true : false} setAlert={this.setAlert} />
                  <Users loading={loading} users={users} />
                </Fragment>
              )} />
              <Route exact path='/about' component={About} />
              <Route exact path='/user/:login' render={props => (
                <User {...props} getUser={this.getUser} user={user} loading={loading} getUserRepos={this.getUserRepos} repos={repos} />
              )} />
            </Switch>

          </div>
        </div>
      </Router>
    );
  }
}
export default App;
