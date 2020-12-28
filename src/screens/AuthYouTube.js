import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'

import firebase from "firebase";
import 'firebase/database';

import Cookies from 'universal-cookie';

import { OAuth2PopupFlow } from 'oauth2-popup-flow';

class AuthYouTube extends React.Component{

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

        //const cookies = new Cookies();
        //const returnToken = cookies.get('ytAuthReturn')

        //console.log('returnToken')
        //console.log(returnToken)
        //this.parseToken(returnToken)
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("YES logged in")
                console.log(user.uid)
                this.setState({uid: user.uid})
                
                const cookies = new Cookies();
                const returnToken = cookies.get('ytAuthReturn', { path: '/', domain: 'https://smauthlanding.herokuapp.com/' })
                const returnToken2 = cookies.get('ytAuthReturn', { path: '/' })

                console.log('returnToken')
                console.log(returnToken)
                console.log(returnToken2)
                this.parseToken(returnToken)
            } else {
              console.log("NO logged in")

              //this.parseToken("temp")

              this.props.history.push("/OpenScreen");
            }
        }.bind(this));

        //this.authTwitch()
        //this.authInstagram()
    }
    
    parseToken(returnToken){
        //const returnUrl = returnToken
        const returnUrl = window.location.href
        console.log("checking window")
        console.log(returnUrl)
        console.log(window.location.href)
        var authToken = ''
        for(var i=0; i<returnUrl.length; i++){
            var currSubstring = returnUrl.substr(i, 5)
            if('code=' == currSubstring){
                console.log("access_token= found")
                authToken = returnUrl.substr(i+5, 75)
                console.log(authToken)
                i = returnUrl.length
            }
        }

        var ytToken = ''
        const exchangeEndpoint = 'https://smbackendnodejs.herokuapp.com/postYouTubeExchange'
        //local
        //const exchangeEndpoint = '/postYouTubeExchange'
        axios.post(exchangeEndpoint + "/?token=" + authToken).then(response => {
            console.log(response)
            console.log(response.data.access_token)
            ytToken = response.data.access_token

            const collPath = '/mainCollection/' + this.state.uid +'/ytInfo'
            firebase.database().ref(collPath).update({
                youtubeAuthToken: ytToken
            })

            const cookies = new Cookies()
            cookies.set('ytToken', ytToken, { path: '/' })
        })
        .catch(error=>console.log(error))

        //this.authInstagram()
    }

    authInstagram(){    
        const auth = new OAuth2PopupFlow({
            authorizationUri: 'https://api.instagram.com/oauth/authorize',
            clientId: '971610706609059',
            //redirectUri: 'https://localhost:3005/',
            redirectUri: 'https://smauthlanding.herokuapp.com/',
            scope: 'user_profile,user_media',
            responseType: 'code'
        });
 
        console.log("1")
        auth.tryLoginPopup();
        console.log("2")
         
        window.close();
    }

    skipInstagram(){
        console.log("skipping instagram")
        window.open("https://thesocialmediumappjs.herokuapp.com/#/AuthInstagram?code=NoIg" ,"_self");
    }

    render(){
        return(
            <div style={rootStyle} className="authyoutube-screen" id="AuthYouTube">

                <Container style={mainContainer}>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <h2 style={{color: '#e8e6e3'}} className="display-1 font-weight-bolder">Authorize Instagram</h2>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.authInstagram} style={button}><h4 style={textStyle}>Auth Instagram</h4></Button>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.skipInstagram} style={button}><h4 style={textStyle}>Skip Instagram</h4></Button>
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

export default withRouter(AuthYouTube);