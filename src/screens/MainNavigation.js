import React from 'react';

import {withRouter} from 'react-router-dom';
import { Route, Switch, Redirect } from "react-router-dom";
import { RoutedTabs, NavTab } from "react-router-tabs";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import FeedScreen from '../screens/FeedScreen';

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

class MainNavigation extends React.Component{

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

    render(){
        return(
            <div style={rootStyle} className="open-screen" id="open">
                <Row>
                    test test teset
                </Row>
                <Navbar style={{justifyContent: 'center'}}fixed='bottom' sticky='bottom' bg="dark" variant="dark">
                    <Nav className="mr-auto">
                        <Nav.Link href="/FeedScreen">
                            <ThumbUpAltIcon style={{color: 'black', maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}} />
                        </Nav.Link>
                        <Nav.Link href="/FeedScreen">
                            <ThumbUpAltIcon style={{color: 'black', maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}} />
                        </Nav.Link>
                    </Nav>
                </Navbar>
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
const title = {
    color: "black",
    marginTop: "20%"
}

export default withRouter(MainNavigation);