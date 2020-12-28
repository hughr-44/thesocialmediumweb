import React from 'react';
import {withRouter} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'

import firebase from "firebase";
import 'firebase/database';

//import { db, auth } from '../services/firebase'

import Cookies from 'universal-cookie';

import { OAuth2PopupFlow } from 'oauth2-popup-flow';

class AuthTwitch extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            email: "",
            uid: "",
            password: "",
            errorMessage: null,
            twitterName: "",
            igName: ""
        };
        console.log(window.location.href)
        //console.log(this.state.uid)
        //this.parseToken()
    }

    componentDidMount(){

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("YES logged in")
                console.log(user.uid)
                this.setState({uid: user.uid})
                //this.props.history.push("/");
                this.parseToken()
            } else {
              console.log("NO logged in")
              //this.props.history.push("/OpenScreen");
              this.parseToken()
            }
        }.bind(this));

        //this.authTwitch()
        //this.authInstagram()
    }

    parseToken(){
        console.log("parse token")
        console.log(window.location.href)

        const returnUrl = window.location.href

        var authToken = ''
        for(var i=0; i<returnUrl.length; i++){
            var currSubstring = returnUrl.substr(i, 13)
            if('access_token=' == currSubstring){

                if(returnUrl.substr(i+13, 8) == "NoTwitch"){
                    console.log("twitch was skipped")
                    authToken = "NA"
                    console.log(authToken)
                    i = returnUrl.length
                }
                else{
                    console.log("access_token= found")
                    authToken = returnUrl.substr(i+13, 30)
                    console.log(authToken)
                    i = returnUrl.length
                }
                
            }
        }

        const cookies = new Cookies();
        //cookies.set('twitchToken', authToken)
        cookies.set('twitchToken', authToken, { path: '/' })

        const collPath = '/mainCollection/' + this.state.uid +'/twitchInfo'
        firebase.database().ref(collPath).update({
            twitchAuthToken: authToken
        })

        //this.authYT()
    }

    authYT(){
        const auth = new OAuth2PopupFlow({
            authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
            clientId: '749462796772-g5kquq4trrnbdhan4c6npo7kjjn2av1q.apps.googleusercontent.com',
            //redirectUri: 'http://localhost:3005/',
            redirectUri: 'https://smauthlanding.herokuapp.com/',
            responseType: 'code',
            scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner-channel-audit https://www.googleapis.com/auth/youtube.channel-memberships.creator https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube.upload'
        });

        console.log("1")
        auth.tryLoginPopup();
        console.log("2")

        window.close();

        console.log("3")
    }

    render(){
        return(
            <div style={rootStyle} className="authtwitch-screen" id="AuthTwitch">

                <Container style={mainContainer}>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <h2 style={{color: '#e8e6e3'}} className="display-1 font-weight-bolder">Authorize YouTube</h2>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.authYT} style={button}><h4 style={textStyle}>Auth YT</h4></Button>
                    </Row>
                </Container>

            </div>
        );
    }
}

const rootStyle = {
    height: "100vh",
    backgroundColor: "#25282a"
    //backgroundColor: "#ACACAC"
}
const mainContainer = {
    //backgroundColor: "#ACACAC",
    backgroundColor: "#25282a",
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

export default withRouter(AuthTwitch);