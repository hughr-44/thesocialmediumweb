import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from "axios";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { List, Image, Button } from 'semantic-ui-react'
import Avatar from '@material-ui/core/Avatar';

import firebase from "firebase";
import 'firebase/database';

import Cookies from 'universal-cookie';

import DefaultPFP from '../pictureIcons/defaultpfp.jpg'

import TwitchLogo from '../pictureIcons/twitch-image.png'
import IgLogo from '../pictureIcons/ig-image.png'
import TwitterLogo from '../pictureIcons/twitter-image.png'
import YTLogo from '../pictureIcons/youtube-image.png'

import HomeIcon from '@material-ui/icons/Home';
import StarIcon from '@material-ui/icons/Star';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import StickyFooter from 'react-sticky-footer';

class SearchScreen extends React.Component{

    constructor(props){
        super(props);

        const startRow = <Row style={{marginTop: 100, marginBottom: 900}}> </Row>
        var startRows = []
        startRows.push(startRow)

        this.state = {
            email: "",
            uid: firebase.auth().currentUser.uid,
            password: "",
            errorMessage: null,

            searchValue: "",

            startRows: startRows,
            searchFeed: startRows,

            usersUid: ""
        };
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("YES logged in")

            } else {
              console.log("NO logged in")
              this.props.history.push("/OpenScreen");
            }
        }.bind(this));
    }

    searchChange(e){
        this.setState({ searchValue: e.target.value })
        console.log(e.target.value)

        var allLower = e.target.value.toLowerCase()
        console.log(allLower)

        var searchResults = []

        firebase.database().ref('mainCollection').orderByChild("displayAllLow").startAt(e.target.value).on("child_added", function(snapshot){
            //then can search for using through the UID
            console.log("search event")
            console.log(snapshot.key)
            console.log(snapshot)
            searchResults.push([snapshot, snapshot.key])
        })

        if(searchResults.length > 0){
            console.log("not undefined")
            console.log(searchResults[0][1])
        }
        else{
            console.log("undefined")
        }

        const newRows = []

        if(searchResults.length > 0){

        for(var i=0; i<searchResults.length; i++){
            console.log(searchResults[i][1])
            const tempUid = searchResults[i][1]
            //console.log(searchResults[i][0].child('ytInfo').child('userName').val())
            const newResult = [
                <Container key={"results" + i} style={twitchComponent}>
                <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                    <h3 style={{ color: '#e8e6e3' }}>{searchResults[i][0].child('displayName').val()}</h3>
                </Row>
                <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start", alignSelf: "start", marginLeft: 20}}>
                    <Button onClick={() => this.goToProfile(tempUid)} style={button}>Visit</Button>
                </Row>
                <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                    <Avatar style={{width: 30, height: 30}} src={YTLogo} />
                    <h4 style={{ color: '#e8e6e3' }} style={{marginLeft: 5}}>{searchResults[i][0].child('ytInfo').child('userName').val()}</h4>
                </Row>
                <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                    <Avatar style={{width: 30, height: 30}} src={TwitchLogo} />
                    <h4 style={{ color: '#e8e6e3' }} style={{marginLeft: 5}}>{searchResults[i][0].child('twitchInfo').child('userName').val()}</h4>
                </Row>
                <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                    <Avatar style={{width: 30, height: 30}} src={TwitterLogo}/>  
                    <h4 style={{ color: '#e8e6e3' }} style={{marginLeft: 5}}>{searchResults[i][0].child('twitterInfo').child('userName').val()}</h4>
                </Row>
                <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                    <Avatar style={{width: 30, height: 30}} src={IgLogo}/>  
                    <h4 style={{ color: '#e8e6e3' }} style={{marginLeft: 5}}>{searchResults[i][0].child('igInfo').child('userName').val()}</h4>
                </Row>
                </Container>
            ]
            newRows.push(newResult)
            //newRows.push(newResult)
        }

        if(searchResults.length < 3)
            newRows.push(this.state.startRows)
        }
        if(searchResults.length > 0){
            console.log("not undefined")
            //console.log(searchResults[0][1])
        }
        else{
            console.log("undefined")
            newRows.push(this.state.startRows)
        }

        this.setState({searchFeed: newRows})

    }

    goToProfile(tempUid){
        console.log("navigate to user profile")
        console.log(tempUid)

        this.setState({usersUid: tempUid})

        this.props.history.push({ pathname: "/OthersProfile", state: {
                pastState: this.props.location.state, 
                usersUid: tempUid
            } 
        });
    }

    render(){
        return(
            <div style={rootStyle} className="profile-screen" id="ProfileScreen">


                <Container style={headerComponent} >
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control style={{marginTop: 10, maxWidth: '535px', maxHeight: '40px', minWidth: '535px', minHeight: '40px'}} type="search" placeholder="Search for user..." onChange={this.searchChange.bind(this)} />
                        </Form.Group>
                    </Row>
                </Container>

                <Container style={{zIndex: 0}}>

                    {this.state.searchFeed}

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
                            <HomeIcon style={{marginLeft: 120, marginRight: 40, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
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
                            <InfoIcon style={{marginLeft: 40, marginRight: 120, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                    </Nav>
                </Navbar>

                </StickyFooter>

            </div>
        );
    }
}

const myscrollstyle = {
    height: '100vh',
    width: '400px',
    marginReft: 'auto',
    marginRight: 'auto',
    overflowY: 'scroll'
}

const footer = {
    clear: 'both',
    position: 'relative',
    marginTop: '-200px',
}

const tweetComponent = {
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

const twitchComponent = {
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
    alightSelf: "center",
    width: 800
}

const rootStyle = {
    height: "100hv",
    //backgroundColor: "#313131",
    backgroundColor: "#25282a",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
    display: 'flex',
    flexDirection: "column"
}

const button = {
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    elevation: 1,
    marginTop: '0',
    backgroundColor: "#401058",
    borderRadius: 5,
    borderColor: "#393939",
    borderWidth: 1,
    width: 70,
    height: 30,
    color: "white",
    justifyContent: "left"
}

export default withRouter(SearchScreen);