import React from 'react';
import {withRouter} from 'react-router-dom';

import axios from "axios";

import { TwitchEmbed, TwitchChat, TwitchClip, TwitchPlayer } from 'react-twitch-embed';

import YouTube from 'react-youtube-embed'

import { Timeline, Tweet } from 'react-twitter-widgets'

import InstagramEmbed from 'react-instagram-embed';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'

import firebase from "firebase";
import 'firebase/database';

//var passport = require("passport");
//var twitchStrategy = require("passport-twitch").Strategy;

//import passport from "passport"
//import twitchStrategy from "passport-twitch"

import OauthPopup from "react-oauth-popup";

import { OAuth2PopupFlow } from 'oauth2-popup-flow';

import TwitterLogin from 'react-twitter-auth'

import InstagramLogin from "react-instagram-login";

import { InstagramMedia } from 'react-instagram-media'

class LoadScreen extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            email: "",
            //uid: firebase.auth().currentUser.uid,
            password: "",
            errorMessage: null,
            twitterName: "",
            igName: ""
        };
    }

    componentDidMount(){

        console.log(this.props.testProp)

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("YES logged in")
                
                //this.props.history.push("/");
            } else {
              console.log("NO logged in")
              this.props.history.push("/OpenScreen");
            }
        }.bind(this));

        //this.authTwitch()
        //this.closeWindow()
    }

    authTwitch(){
        const auth = new OAuth2PopupFlow({
            authorizationUri: 'https://id.twitch.tv/oauth2/authorize',
            clientId: '2fnwtwy41t2avoiqdc1py6oybitz4r',
            //redirectUri: 'http://localhost:3000/#/AuthTwitch',
            redirectUri: 'https://thesocialmediumappjs.herokuapp.com/#/AuthTwitch',
            responseType: 'token',
            scope: 'user:edit user:read:email user:edit:follows'
        });
        //user:edit:follows 
        console.log("1")
        auth.tryLoginPopup();
        console.log("2")

        //window.open("", "_self");
        window.close();
    }

    closeWindow(){
        window.close();
    }

    skipTwitch(){
        console.log("skipping twitch")
        window.open("https://thesocialmediumappjs.herokuapp.com/#/AuthTwitch?access_token=NoTwitch" ,"_self");
    }

    render(){
        const igHtml = '<iframe width="320" height="440" src="http://instagram.com/p/CIMN_BVhsZ3/embed" frameborder="0"></iframe>'
        return(
            <div style={rootStyle} className="login-screen" id="login">

                <Container style={mainContainer}>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        load screen
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.authTwitch} style={button}><h4 style={textStyle}>Auth</h4></Button>
                    </Row>

                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.skipTwitch} style={button}><h4 style={textStyle}>Skip Twitch</h4></Button>
                    </Row>

                </Container>

            </div>
        );
    }
}

const rootStyle = {
    height: "100vh",
    backgroundColor: "#ACACAC"
}
const mainContainer = {
    backgroundColor: "#ACACAC",
    height: "100%",
    fluid: true
}
const button = {
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    elevation: 1,
    marginTop: '5%',
    backgroundColor: "#401058",
    borderRadius: 5,
    borderColor: "#393939",
    borderWidth: 1,
    width: 120
}
const textStyle = {
    color: "white"
}

export default withRouter(LoadScreen);