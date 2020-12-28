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

import AutoScrollContainer from 'auto-scroll-container'

import { StickyContainer, Sticky } from 'react-sticky';


import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RepeatIcon from '@material-ui/icons/Repeat';

import { TwitchEmbed, TwitchChat, TwitchClip, TwitchPlayer } from 'react-twitch-embed';

import YouTube from 'react-youtube-embed'

import { Timeline, Tweet } from 'react-twitter-widgets'
import { TwitterTimelineEmbed, TwitterShareButton, TwitterTweetEmbed } from 'react-twitter-embed';

import { InstagramMedia } from 'react-instagram-media'

class ProfileScreen extends React.Component{

    constructor(props){
        super(props);

        console.log(props.location.state)

        const startRow = <Row style={{marginTop: 100, marginBottom: 900}}>Click above to view socials...</Row>
        var startRows = []
        startRows.push(startRow)

        this.state = {
            email: "",
            uid: props.location.state.myUID,
            password: "",
            errorMessage: null,

            displayName: "",
            twitterName: "",
            igName: "",
            twitchName: "",
            youtubeName: "",

            twitchRow: props.location.state.createdMyTwitchStreams,
            ytRows: props.location.state.createdMyYtSubVids,
            twitterRows: props.location.state.createdMyTweetRows,
            igRows: props.location.state.createdMyIgRows,
            currentFeed: startRows,

            twitchPFP: this.props.location.state.myTwitchStream[6],
            ytPFP: this.props.location.state.myYTvids[0][5],
            currPFP: DefaultPFP,
            pfpCount: 0,
            currPFPplatform: DefaultPFP
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

        console.log(this.props.location.state.myTwitchStream[6])
        console.log(this.props.location.state.myYTvids[0][5])

        const collPath = '/mainCollection/' + this.state.uid
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            const myDisplayName = snapshot.child('displayName').val()
            this.setState({displayName: myDisplayName})

            const newTwitter = snapshot.child('twitterInfo').val()
            const newIG = snapshot.child('igInfo').val()
            const newTwitch = snapshot.child('twitchInfo').val()
            const newYoutube = snapshot.child('ytInfo').val()

            this.setState({twitchName: newTwitch.userName})
            this.setState({youtubeName: newYoutube.userName})
            this.setState({twitterName: newTwitter.userName})
            this.setState({igName: newIG.userName})
        })
    }

    fillTwitch(){
        var fillRows = []
        const startRow = <Row style={{marginTop: 100, marginBottom: 300}}></Row>
        fillRows.push(this.state.twitchRow)
        fillRows.push(startRow)
        this.setState({currentFeed: fillRows})
    }

    fillYT(){
        this.setState({currentFeed: this.state.ytRows})
    }

    fillIG(){
        this.setState({currentFeed: this.state.igRows})
    }

    fillTwitter(){
        this.setState({currentFeed: this.state.twitterRows})
    }

    switchPFP(){
        if(this.state.pfpCount == 0){
            this.setState({currPFPplatform: TwitchLogo})
            this.setState({currPFP: this.state.twitchPFP})
            this.setState({pfpCount: 1})
        }
        else if(this.state.pfpCount == 1){
            this.setState({currPFPplatform: YTLogo})
            this.setState({currPFP: this.state.ytPFP})
            this.setState({pfpCount: 2})
        }
        else{
            this.setState({currPFPplatform: DefaultPFP})
            this.setState({currPFP: DefaultPFP})
            this.setState({pfpCount: 0})
        }
    }

    render(){
        return(
            <div style={rootStyle} className="profile-screen" id="ProfileScreen">


                <Container style={headerComponent} >
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Col style={{display: 'flex', flex: 1}}>
                            <Avatar onClick={this.switchPFP.bind(this)} style={{width: 100, height: 100, marginLeft: 10}} src={this.state.currPFP} />
                            <Avatar style={{width: 20, height: 20, marginLeft: 0}} src={this.state.currPFPplatform} />
                        </Col>
                        <Col style={{display: 'flex', flex: 5, flexDirection: "column", justifyContent: "flex-start", alignSelf: "start"}}>
                            <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start", alignSelf: "start", marginLeft: 20, marginTop: 10}}>
                                <Button style={button}>Follow</Button>
                            </Row>
                            <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start",  alignSelf: "start", marginLeft: 22}}>
                                <h2 style={{ color: '#e8e6e3' }}>{this.state.displayName}</h2> 
                            </Row>
                        </Col>
                        <Col style={{display: 'flex', flex: 1, justifyContent: 'flex-end', marginRight: 10}}>
                            {/* <Avatar style={{width: 50, height: 50}} src={TwitchLogo} /> */}
                        </Col>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center', marginTop: 10, height: 90}}>
                        <Col style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 50}}>
                            <Row  style={{display: 'flex', flex: 1, flexDirection: 'row', height: 30}}>
                                <h3 style={{ color: '#e8e6e3' }}>Social</h3> 
                            </Row>
                            <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Avatar onClick={this.fillTwitch.bind(this)} style={{width: 30, height: 30}} src={TwitchLogo} />
                                <h3 style={{marginLeft: 5, color: '#e8e6e3'}}>{this.state.twitchName}</h3> 
                            </Row>
                            <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', height: 20}}>
                                <Avatar onClick={this.fillYT.bind(this)} style={{width: 30, height: 30}} src={YTLogo} />
                                <h3 style={{marginLeft: 5, color: '#e8e6e3'}}>{this.state.youtubeName}</h3> 
                            </Row>
                        </Col>
                        <Col style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 50}}>
                            <Row  style={{display: 'flex', flex: 1, flexDirection: 'row', height: 30}}>
                                <h3 style={{ color: '#e8e6e3' }}>Social</h3> 
                            </Row>
                            <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Avatar onClick={this.fillIG.bind(this)} style={{width: 30, height: 30}} src={IgLogo} />
                                <h3 style={{marginLeft: 5, color: '#e8e6e3'}}>{this.state.igName}</h3> 
                            </Row>
                            <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', height: 20}}>
                                <Avatar onClick={this.fillTwitter.bind(this)} style={{width: 30, height: 30}} src={TwitterLogo} />
                                <h3 style={{marginLeft: 5, color: '#e8e6e3'}}>{this.state.twitterName}</h3> 
                            </Row>
                        </Col>
                    </Row>
                </Container>

                <Container style={{zIndex: 0}}>

                    {this.state.currentFeed}

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

export default withRouter(ProfileScreen);