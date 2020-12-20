import React from 'react';

import {HashRouter as Router, Link, Route} from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import './App.css';

import OpenScreen from './screens/OpenScreen';
import LoginScreen from './screens/LoginScreen';
import LoadScreen from './screens/LoadScreen';
import AuthTwitch from './screens/AuthTwitch';
import AuthYouTube from './screens/AuthYouTube';
import AuthInstagram from './screens/AuthInstagram';

import FeedScreen from './screens/FeedScreen';

import ProfileScreen from './screens/ProfileScreen';

import SearchScreen from './screens/SearchScreen';

import LoadSocials from './screens/LoadSocials';

import OthersProfile from './screens/OthersProfile';

import firebase from "firebase";
import 'firebase/database';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  render(){
    const styles = require('./App.css');
    return (
      <Router>
        <Container className="p-0" fluid={true}>
      
          <div className="main-body">
          <Route path="/" exact render={() => <OpenScreen />} />
          <Route path="/LoginScreen" exact render={() => <LoginScreen />} />
          <Route path="/LoadScreen" exact render={() => <LoadScreen />} />
          <Route path="/AuthTwitch" exact render={() => <AuthTwitch />} />
          <Route path="/AuthYouTube" exact render={() => <AuthYouTube />} />
          <Route path="/AuthInstagram" exact render={() => <AuthInstagram />} />
          <Route path="/LoadSocials" exact render={() => <LoadSocials />} />

          <Route path="/FeedScreen" exact render={() => <FeedScreen />} />
          <Route path="/ProfileScreen" exact render={() => <ProfileScreen />} />
          <Route path="/SearchScreen" exact render={() => <SearchScreen />} />

          <Route path="/OthersProfile" exact render={() => <OthersProfile />} />
          </div>

        </Container>
      </Router>
    );
  }
}

var firebaseConfig = {
  apiKey: "AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY",
  authDomain: "thesocialmedium-110a0.firebaseapp.com",
  databaseURL: "https://thesocialmedium-110a0.firebaseio.com",
  projectId: "thesocialmedium-110a0",
  storageBucket: "thesocialmedium-110a0.appspot.com",
  messagingSenderId: "749462796772",
  appId: "1:749462796772:web:44df3752d82016615caff1",
  measurementId: "G-K9HLH22Z19"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default App;