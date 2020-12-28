import React from 'react';

import {withRouter} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'

class OpenScreen extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            email: "",
            //uid: auth.currentUser.uid,
            password: "",
            errorMessage: null,
            twitterName: "",
            igName: ""
        };
    }

    loginClicked = ({ title, history }) => {
        console.log("clicked login")
        this.props.history.push("/LoginScreen");
    }
    
    registerClicked = () => {
        console.log("clicked register")
    }

    render(){
        return(
            <div style={rootStyle} className="open-screen" id="open">
                <Container style={mainContainer}>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <h4 style={title}>Welcome to The Social Medium.</h4>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.loginClicked} style={button}><h4 style={textStyle}>Login</h4></Button>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.registerClicked} style={button}><h4 style={textStyle}>Register</h4></Button>
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
const title = {
    color: "black",
    marginTop: "20%"
}

export default withRouter(OpenScreen);