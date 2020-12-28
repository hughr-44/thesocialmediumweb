import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from "axios";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'

import Modal from 'react-bootstrap/Modal'

import { List, Image, Button } from 'semantic-ui-react'
import Avatar from '@material-ui/core/Avatar';

import firebase from "firebase";
import 'firebase/database';

import Cookies from 'universal-cookie';

import HomeIcon from '@material-ui/icons/Home';
import StarIcon from '@material-ui/icons/Star';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import StickyFooter from 'react-sticky-footer';

class InfoScreen extends React.Component{

    constructor(props){
        super(props);
        console.log(props.location.state)

        this.state = {
            email: "",
            uid: props.location.state.myUID,
            password: "",
            errorMessage: null
        };
        console.log("in feed screen")

    }

    render(){
        return(
            <div style={rootStyle} className="info-screen" id="infoscreen">


                <Container style={{zIndex: 0}}>
                    <Container  style={tweetComponent}>
                        <Row style={{display: 'flex', justifyContent: 'center'}}>
                            <h2 style={{color: '#e8e6e3'}} className="display-1 font-weight-bolder">Information here</h2> 
                        </Row>
                    </Container>
                </Container>
                
                
                <StickyFooter
                    bottomThreshold={50}
                    normalStyles={{
                    backgroundColor: "#999999",
                    padding: "2rem"
                    }}
                    stickyStyles={{
                    backgroundColor: "rgba(255,255,255,.8)",
                    padding: "2rem"
                    }}
                >

                <Navbar style={{footer}} sticky='bottom' bg="dark" variant="dark">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} 
                            to={{pathname: "/FeedScreen",
                                state:
                                    this.props.location.state
                            }}
                        >
                            <HomeIcon style={{marginLeft: 110, marginRight: 40, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                        <Nav.Link as={Link} 
                            to={{pathname: "/FeedScreen",
                                state:
                                    this.props.location.state
                            }}
                        >
                            <StarIcon style={{marginLeft: 40, marginRight: 40, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                        <Nav.Link as={Link} 
                            to={{pathname: "/ProfileScreen",
                                state:
                                    this.props.location.state
                            }}
                        >
                            <PersonIcon style={{marginLeft: 40, marginRight: 40, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                        <Nav.Link as={Link} 
                            to={{pathname: "/SearchScreen",
                                state:
                                    this.props.location.state
                            }}
                        >
                            <SearchIcon style={{marginLeft: 40, marginRight: 40, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                        <Nav.Link as={Link} 
                            to={{pathname: "/InfoScreen",
                                state:
                                    this.props.location.state
                            }}
                        >
                            <InfoIcon style={{marginLeft: 40, marginRight: 110, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                    </Nav>
                </Navbar>

                </StickyFooter>
  
            </div>
        );
    }
}

const headerComponent = {
    //backgroundColor: "#ACACAC",
    backgroundColor: "#474d50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    fluid: true,
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
    alignSelf: "center",
    width: 800,
    position: '-webkit-sticky',
    position: 'sticky',
    top: 0,
    zIndex: 1000
}

const footer = {
    clear: 'both',
    position: 'relative',
    height: '200px',
    marginTop: '-200px'
}

const tweetComponent = {
    //backgroundColor: "#ACACAC",
    backgroundColor: "#474d50",
    justifyContent: "center",
    alignItems: "stretch",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    //fluid: true,
    //flex: 1,
    marginLeft: 50,
    marginRight: 50,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
    alignSelf: "center",
    width: 800
}

const tweetComponent2 = {
    backgroundColor: "#ACACAC",
    justifyContent: "center",
    alignItems: "stretch",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    //fluid: true,
    //flex: 1,
    marginLeft: 50,
    marginRight: 50,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
    alignSelf: "center",
    width: 800
}

const twitchComponent = {
    backgroundColor: "#ACACAC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    fluid: true,
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
    alightSelf: "center",
    width: 800
}

const container = {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: "#ACACAC",
    width: "90%",
    flex: 1,
    display: 'flex',
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
}

const rootStyle = {
    height: "100%",
    //backgroundColor: "#313131",
    backgroundColor: "#25282a",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
    display: 'flex',
    flexDirection: "column"
}
const rootStyle2 = {
    height: "100%",
    backgroundColor: "#313131",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
    display: 'flex',
    flexDirection: "column"
}

const mainContainer = {
    backgroundColor: "#313131",
    height: "100%",
    //fluid: true
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
    width: 70,
    height: 30,
    color: "white",
    justifyContent: "left"
}
const textStyle = {
    color: "black"
}

const textStyle2 = {
    color: "white",
    alightItems: "center"
}

export default withRouter(InfoScreen);