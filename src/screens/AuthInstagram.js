import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import firebase from "firebase";
import 'firebase/database';

import Cookies from 'universal-cookie';

import { OAuth2PopupFlow } from 'oauth2-popup-flow';

class AuthInstagram extends React.Component{

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

        const cookies = new Cookies();
        const returnToken = cookies.get('igAuthReturn')

        //this.parseToken(returnToken)
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("YES logged in")
                console.log(user.uid)
                this.setState({uid: user.uid})
                
                const cookies = new Cookies();
                const returnToken = cookies.get('igAuthReturn')

                console.log('returnToken')
                console.log(returnToken)
                this.parseToken(returnToken)
            } else {
              console.log("NO logged in")
              this.props.history.push("/OpenScreen");
            }
        }.bind(this));

        //this.authTwitch()
        //this.authInstagram()
    }

    parseToken(returnToken){
        const returnUrl = returnToken
        var authToken = ''
        for(var i=0; i<returnUrl.length; i++){
            var currSubstring = returnUrl.substr(i, 5)
            if('code=' == currSubstring){
                console.log("code= found")
                authToken = returnUrl.substr(i+5, 238)
                console.log(authToken)
                i = returnUrl.length
            }
        }

        var igToken = ''
        var igID = ''
        const exchangeEndpoint = 'https://smbackendnodejs.herokuapp.com/postInstagramExchange'
        //local
        //const exchangeEndpoint = '/postInstagramExchange'
        axios.post(exchangeEndpoint + "/?token=" + authToken).then(response => {
            console.log(response.data.access_token)
            igToken = response.data.access_token
            igID = response.data.user_id

            const collPath = '/mainCollection/' + this.state.uid +'/igInfo'
            firebase.database().ref(collPath).update({
                igAuthToken: igToken,
                igUserID: igID
            })

        })
        .catch(error=>console.log(error))
    }

    /*
    authTwitter(){    
        const auth = new OAuth2PopupFlow({
            authorizationUri: 'https://api.instagram.com/oauth/authorize',
            clientId: '971610706609059',
            redirectUri: 'https://localhost:3005/',
            scope: 'user_profile,user_media',
            responseType: 'code'
        });
 
        console.log("1")
        auth.tryLoginPopup();
        console.log("2")
         
        window.close();
    }*/

    authTwitter(){

        var twitterToken = ''
        const exchangeEndpoint = 'https://smbackendnodejs.herokuapp.com/postTwitterExchange'
        //local
        //const exchangeEndpoint = '/postTwitterExchange'
        axios.post(exchangeEndpoint).then(response => {
            console.log(response)
            console.log(response.data)
            console.log(response.data.access_token)
            twitterToken = response.data.access_token

            const collPath = '/mainCollection/' + this.state.uid +'/twitterInfo'
            firebase.database().ref(collPath).update({
                twitterAuthToken: twitterToken,
                userName: this.state.twitterName
            })

            this.props.history.push("/LoadSocials", {testProp: "test test"});
        })
        .catch(error=>console.log(error))
    }


    render(){
        return(
            <div style={rootStyle} className="authinstagram-screen" id="AuthInstagram">

                <Container style={mainContainer}>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        auth
                    </Row>
                
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                    <Form style={{marginTop: 60}}>
                        <Form.Group controlId="formBasicUserName">
                            <Form.Label>Twitter Name: </Form.Label>
                            <Form.Control type="username" placeholder="Twitter @ (don't include @)" onChange={e => this.setState({ twitterName: e.target.value })} />
                        </Form.Group>

                        <Button onClick={this.authTwitter.bind(this)} style={button}><h4 style={textStyle}>Auth Twitter</h4></Button>
                    </Form>
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

export default withRouter(AuthInstagram);