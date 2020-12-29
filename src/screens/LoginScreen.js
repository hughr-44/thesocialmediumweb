import React from 'react';
import {Redirect, withRouter} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import firebase from "firebase";
import 'firebase/database';


class LoginScreen extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            email: "",
            //uid: auth.currentUser.uid,
            password: "",
            errorMessage: null,
            twitterName: "",
            igName: "",
            loggedIn: false
        };
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log(user)
                console.log("YES logged in")
                this.setState({loggedIn: true})

                //this.props.history.push("/LoadSocials", {testProp: "test test"});
            } else {
              console.log("NO logged in")
            }
        }.bind(this));

        //this.logoutTest()
    }
/*
    logoutTest(){
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log("signed out")
          }).catch(function(error) {
            // An error happened.
            console.log("sign out failed")
          });
    }
*/
    handleLogin = () => {
        const{email, password} = this.state

        console.log("login clicked")
        console.log(email)
        console.log(password)

        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log(email)
            console.log(password)
            //this.props.navigation.navigate("LoadScreen2", {displayName: "login"}
            this.setState({loggedIn: true})
            //this.props.history.push("/LoadScreen");
            this.props.history.push({ pathname: "/LoadScreen", state: this.state});
        })
        .catch(error => this.setState({ errorMessage: error.message }));
    };

    render(){

        if(this.state.loggedIn){
            return <Redirect to='/LoadScreen' />
        }

        return(
            <div style={rootStyle} className="login-screen" id="login">
                <Container style={mainContainer}>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        
                    <Form style={{marginTop: 60}}>

                    <Form.Group controlId="formErrorMessage">
                        <Form.Label style={{color: '#e8e6e3'}}>{this.state.errorMessage}</Form.Label>
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address: </Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={e => this.setState({ email: e.target.value })} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label style={{color: '#e8e6e3'}}>Password: </Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={e => this.setState({ password: e.target.value })} />
                    </Form.Group>
                    <Button onClick={this.handleLogin} style={button} variant="primary" type="submit">
                        <h4 style={textStyle}>Login</h4>
                    </Button>
                    </Form>
                    
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

export default withRouter(LoginScreen);