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


import { TwitchEmbed, TwitchChat, TwitchClip, TwitchPlayer } from 'react-twitch-embed';

import YouTube from 'react-youtube-embed'

import { Timeline, Tweet } from 'react-twitter-widgets'
import { TwitterTimelineEmbed, TwitterShareButton, TwitterTweetEmbed } from 'react-twitter-embed';

import { InstagramMedia } from 'react-instagram-media'
//import InstagramEmbed from 'react-social-embed'


import TwitchComponent from "../components/TwitchComponent";
import YoutubeComponent from "../components/YoutubeComponent";
import TwitterComponent from "../components/TwitterComponent";
import InstagramComponent from "../components/InstagramComponent";


import DefaultPFP from '../pictureIcons/defaultpfp.jpg'

import TwitchLogo from '../pictureIcons/twitch-image.png'
import IgLogo from '../pictureIcons/ig-image.png'
import TwitterLogo from '../pictureIcons/twitter-image.png'
import YTLogo from '../pictureIcons/youtube-image.png'
import AllLogo from '../pictureIcons/allpic.jpg'

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RepeatIcon from '@material-ui/icons/Repeat';

import HomeIcon from '@material-ui/icons/Home';
import StarIcon from '@material-ui/icons/Star';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import CustomScroll from 'react-custom-scroll';
import { ScrollView } from "@cantonjs/react-scroll-view";
import ScrollPagedView from 'react-scroll-paged-view'

import StickyFooter from 'react-sticky-footer';

class FeedScreen extends React.Component{

    constructor(props){
        super(props);
        console.log(props.location.state)

        this.state = {
            email: "",
            uid: props.location.state.myUID,
            password: "",
            errorMessage: null,
            twitterName: "",
            igName: "",
            refreshing: false,
            testRow: [],
            postNum: 0,
            combinedRows: [],
            feedList: [],
            ytSubVidsData: props.location.state.subsVids,
            //ytSubVids: [],
            currentYtSubVids: [],
            ytSubVids: props.location.state.createdYtSubVids,
            twitchStreamsData: props.location.state.followsTwitchStreams,
            //twitchStreams: [],
            currentTwitchStreams: [],
            twitchStreams: props.location.state.createdTwitchStreams,
            tweetsData: props.location.state.followsTweets,
            //tweetRows: [],
            currentTweetRows: [],
            tweetRows: props.location.state.createdTweetRows,
            igData: props.location.state.followsIgPosts,
            //igRows: [],
            currentIgRows: [],
            igRows: props.location.state.createdIgRows,
            currNumPosts: 20,
            feedFilter: "all",

            combinedList: props.location.state.combinedPosts,

            currentFeed: props.location.state.combinedPosts.slice(0, 20)
        };
        console.log("in feed screen")
        //console.log(this.props.location.state.subsVids)

        //this.setState({ytSubVidsData: this.props.location.state.subsVids})
        //this.setState({twitchStreamsData: this.props.location.state.followsTwitchStreams})
        //this.setState({tweetsData: this.props.location.state.followsTweets})
        //this.setState({igData: this.props.location.state.followsIgPosts})

        //const sortedVids = this.sortVideos()
        //const sortedTweets = await this.sortTweets()
        //const sortedIg = await this.sortIg()
        //this.createFeed()

        //this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount(){

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("YES logged in")

                //firebase.analytics().logEvent("open_feed", {"uid": user.uid});
            } else {
              console.log("NO logged in")
              this.props.history.push("/OpenScreen");
            }
        }.bind(this));

        console.log("mounted")

        console.log("testing the props")
        console.log(this.state.uid)
        //console.log(this.state.ytSubVidsData)
        //console.log(this.state.twitchStreamsData)
        //console.log(this.state.followsIgPosts)
        //console.log(this.state.followsTweets)

        console.log(this.state.tweetRows)
        console.log(this.state.igRows)
        console.log(this.state.twitchStreams)
        console.log(this.state.ytSubVids)

        console.log(this.state.combinedList)

        window.addEventListener("scroll", this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll.bind(this));
    }

    async createFeed(){
        const twitchRows = await this.createTwitchRows()
        //this.setState({twitchStreams: twitchRows})

        const sortedVids = await this.sortVideos()
        const ytVidsRows = await this.createYtRows(sortedVids)
        //this.setState({ytSubVids: ytVidsRows})

        const sortedTweets = await this.sortTweets()
        const tweetRows = await this.createTweetRows(sortedTweets)
        //this.setState({tweetRows: tweetRows})

        //const sortedIg = await this.sortIg()
        //const igRows = await this.createIgRows(sortedIg)
        //this.setState({igRows: igRows})
    }

    getIgPost(){
        console.log(this.state.uid)
        const collPath = '/mainCollection/'+ this.state.uid + '/igInfo'
        var follows = []
        console.log(collPath)
        firebase.database().ref(collPath).once('value').then(async (snapshot) => {
            follows = snapshot.child('followsIgPosts').val()
            console.log(follows)
            this.setState({igData: follows})
            this.sortIg()
        })
    }

    sortIg(){
        console.log("ig sorting")
        console.log(this.state.igData)
        var totalIgList = this.state.igData

        //sort tweets list by date
        
        for(var x=totalIgList.length - 1; x>=0; x--){
            for(var y=1; y<=x; y++){

            var swap = false
            var date1 = totalIgList[y-1][3]
            var date2 = totalIgList[y][3]

            if( parseInt(date1.substring(0,4)) > parseInt(date2.substring(0,4)) ){
                swap = true
            }
            else if( parseInt(date1.substring(0,4)) < parseInt(date2.substring(0,4)) ){
                swap = false
            }
            else if( parseInt(date1.substring(5,7)) > parseInt(date2.substring(5,7)) ){
                swap = true
            }
            else if( parseInt(date1.substring(5,7)) < parseInt(date2.substring(5,7)) ){
                swap = false
            }
            else if( parseInt(date1.substring(8,10)) > parseInt(date2.substring(8,10)) ){
                swap = true
            }
            else if( parseInt(date1.substring(8,10)) < parseInt(date2.substring(8,10)) ){
                swap = false
            }
            else if( parseInt(date1.substring(11,13)) > parseInt(date2.substring(11,13)) ){
                swap = true
            }
            else if( parseInt(date1.substring(11,13)) < parseInt(date2.substring(11,13)) ){
                swap = false
            }
            else if( parseInt(date1.substring(14,16)) > parseInt(date2.substring(14,16)) ){
                swap = true
            }
            else if( parseInt(date1.substring(14,16)) < parseInt(date2.substring(14,16)) ){
                swap = false
            }
            else if( parseInt(date1.substring(14,16)) > parseInt(date2.substring(14,16)) ){
                swap = true
            }
            else if( parseInt(date1.substring(17,19)) < parseInt(date2.substring(17,19)) ){
                swap = false
            }

            if(!swap){
                var temp = totalIgList[y-1]
                totalIgList[y-1] = totalIgList[y]
                totalIgList[y] = temp
            }
            }
        }
        //console.log(totalYtList)
        return totalIgList
    }

    sortTweets(){
        console.log(this.state.tweetsData)
        var totalTweetList = this.state.tweetsData

        //sort tweets list by date
        console.log("tweet sorting")
        for(var x=totalTweetList.length - 1; x>=0; x--){
            for(var y=1; y<=x; y++){

            var swap = false
            var date1 = totalTweetList[y-1][2]
            var date2 = totalTweetList[y][2]

            if( parseInt(date1.substring(0,4)) > parseInt(date2.substring(0,4)) ){
                swap = true
            }
            else if( parseInt(date1.substring(0,4)) < parseInt(date2.substring(0,4)) ){
                swap = false
            }
            else if( parseInt(date1.substring(5,7)) > parseInt(date2.substring(5,7)) ){
                swap = true
            }
            else if( parseInt(date1.substring(5,7)) < parseInt(date2.substring(5,7)) ){
                swap = false
            }
            else if( parseInt(date1.substring(8,10)) > parseInt(date2.substring(8,10)) ){
                swap = true
            }
            else if( parseInt(date1.substring(8,10)) < parseInt(date2.substring(8,10)) ){
                swap = false
            }
            else if( parseInt(date1.substring(11,13)) > parseInt(date2.substring(11,13)) ){
                swap = true
            }
            else if( parseInt(date1.substring(11,13)) < parseInt(date2.substring(11,13)) ){
                swap = false
            }
            else if( parseInt(date1.substring(14,16)) > parseInt(date2.substring(14,16)) ){
                swap = true
            }
            else if( parseInt(date1.substring(14,16)) < parseInt(date2.substring(14,16)) ){
                swap = false
            }
            else if( parseInt(date1.substring(14,16)) > parseInt(date2.substring(14,16)) ){
                swap = true
            }
            else if( parseInt(date1.substring(17,19)) < parseInt(date2.substring(17,19)) ){
                swap = false
            }

            if(!swap){
                var temp = totalTweetList[y-1]
                totalTweetList[y-1] = totalTweetList[y]
                totalTweetList[y] = temp
            }
            }
        }
        //console.log(totalYtList)
        return totalTweetList
    }

    createTweetRows(sortedTweets){
        console.log("creating tweet rows")
        console.log(sortedTweets)
        const tweetRows = []
        for(var i=0; i<sortedTweets.length; i++){
            //console.log(sortedVids[i][1])
            const newTweet = <TwitterComponent twitterName={sortedTweets[i][0]} postNum={sortedTweets[i][1]}/>
            tweetRows.push(newTweet)
        }
        this.setState({tweetRows: tweetRows})
        return tweetRows
    }

    sortVideos(){
        console.log(this.state.ytSubVidsData)
        var totalYtList = this.state.ytSubVidsData

        //sort ytVideos list by date
        console.log("youtube sorting")
        //console.log(totalYtList)
        for(var x=totalYtList.length - 1; x>=0; x--){
            for(var y=1; y<=x; y++){

            var swap = false
            var date1 = totalYtList[y-1][1]
            var date2 = totalYtList[y][1]

            if( parseInt(date1.substring(0,4)) > parseInt(date2.substring(0,4)) ){
                swap = true
            }
            else if( parseInt(date1.substring(0,4)) < parseInt(date2.substring(0,4)) ){
                swap = false
            }
            else if( parseInt(date1.substring(5,7)) > parseInt(date2.substring(5,7)) ){
                swap = true
            }
            else if( parseInt(date1.substring(5,7)) < parseInt(date2.substring(5,7)) ){
                swap = false
            }
            else if( parseInt(date1.substring(8,10)) > parseInt(date2.substring(8,10)) ){
                swap = true
            }
            else if( parseInt(date1.substring(8,10)) < parseInt(date2.substring(8,10)) ){
                swap = false
            }
            else if( parseInt(date1.substring(11,13)) > parseInt(date2.substring(11,13)) ){
                swap = true
            }
            else if( parseInt(date1.substring(11,13)) < parseInt(date2.substring(11,13)) ){
                swap = false
            }
            else if( parseInt(date1.substring(14,16)) > parseInt(date2.substring(14,16)) ){
                swap = true
            }
            else if( parseInt(date1.substring(14,16)) < parseInt(date2.substring(14,16)) ){
                swap = false
            }
            else if( parseInt(date1.substring(14,16)) > parseInt(date2.substring(14,16)) ){
                swap = true
            }
            else if( parseInt(date1.substring(17,19)) < parseInt(date2.substring(17,19)) ){
                swap = false
            }

            if(!swap){
                var temp = totalYtList[y-1]
                totalYtList[y-1] = totalYtList[y]
                totalYtList[y] = temp
            }
            }
        }
        console.log(totalYtList)
        return totalYtList
    }

    createYtRows(sortedVids){
        const ytVidRows = []
        //for(var i=0; i<sortedVids.length; i++)
        for(var i=0; i<sortedVids.length; i++){
            //console.log(sortedVids[i][1])
            const newVid = <YoutubeComponent key={sortedVids[i][0][0]} videoId={sortedVids[i][0][1]} thumbnailUrl={sortedVids[i][0][2]} vidTitle={sortedVids[i][0][3]} channelName={sortedVids[i][0][4]} profilePic={sortedVids[i][0][5]} userName={sortedVids[i][0][6]} bio={sortedVids[i][0][7]} description={sortedVids[i][0][8]} authToken={sortedVids[i][0][9]}/>
            ytVidRows.push(newVid)
        }
        this.setState({ytSubVids: ytVidRows})
        return ytVidRows
    }

    createTwitchRows(){
        var twitchRows = []
        var liveStreams = this.state.twitchStreamsData
        for(var i=0; i<liveStreams.length; i++){ //liveStreams.length
            //console.log(liveStreams[i].user_name)
            const twitchRow = <TwitchComponent key={liveStreams[i][0]} userName={liveStreams[i][1]} streamTitle={liveStreams[i][2]} twitchAuth={liveStreams[i][3]} myName={liveStreams[i][4]} thumbnail={liveStreams[i][5]} profilePic={liveStreams[i][6]}/>
            //const twitchRow = [liveStreams[i].user_name, liveStreams[i].user_name, liveStreams[i].title, this.state.twitchAuthToken, this.state.twitchName]
            twitchRows.push(twitchRow)
        }
        this.setState({twitchStreams: twitchRows})
        return twitchRows
    }

    fillAll(){
        this.setState({currentFeed: this.state.combinedList.slice(0, 20)})
        this.setState({feedFilter: "all"})
        this.setState({currNumPosts: 20})
    }

    fillTwitch(){
        this.setState({currentFeed: this.state.twitchStreams.slice(0, 10)})
        this.setState({feedFilter: "twitch"})
        this.setState({currNumPosts: 10})
    }

    fillYT(){
        this.setState({currentFeed: this.state.ytSubVids.slice(0, 10)})
        this.setState({feedFilter: "yt"})
        this.setState({currNumPosts: 10})
    }

    fillIG(){
        this.setState({currentFeed: this.state.igRows.slice(0, 10)})
        this.setState({feedFilter: "ig"})
        this.setState({currNumPosts: 10})
    }

    fillTwitter(){
        this.setState({currentFeed: this.state.tweetRows.slice(0, 10)})
        this.setState({feedFilter: "twitter"})
        this.setState({currNumPosts: 10})
    }

    handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 5) {
            console.log("bottom reached")

            var newNumPosts = this.state.currNumPosts + 10

            if(this.state.feedFilter == "all"){
                this.setState({currentFeed: this.state.combinedList.slice(0, newNumPosts)})
            }
            else if(this.state.feedFilter == "twitch"){
                this.setState({currentFeed: this.state.twitchStreams.slice(0, newNumPosts)})
            }
            else if(this.state.feedFilter == "yt"){
                this.setState({currentFeed: this.state.ytSubVids.slice(0, newNumPosts)})
            }
            else if(this.state.feedFilter == "ig"){
                this.setState({currentFeed: this.state.igRows.slice(0, newNumPosts)})
            }
            else{
                this.setState({currentFeed: this.state.tweetRows.slice(0, newNumPosts)})
            }

            this.setState({currNumPosts: newNumPosts})

        }
        else {
            console.log("scrolling")
            console.log(docHeight)
            console.log(windowBottom)
        }
    }

    render(){
        return(
            <div style={rootStyle} className="authyoutube-screen" id="AuthYouTube">

   
                <Container style={headerComponent} >
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Col style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Avatar onClick={this.fillAll.bind(this)} style={{width: 50, height: 50}} src={AllLogo} />
                        </Col>
                        <Col style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Avatar onClick={this.fillTwitch.bind(this)} style={{width: 50, height: 50}} src={TwitchLogo} />
                        </Col>
                        <Col style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Avatar onClick={this.fillYT.bind(this)} style={{width: 50, height: 50}} src={YTLogo} />
                        </Col>
                        <Col style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Avatar onClick={this.fillIG.bind(this)} style={{width: 50, height: 50}} src={IgLogo} />
                        </Col>
                        <Col style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Avatar onClick={this.fillTwitter.bind(this)} style={{width: 50, height: 50}} src={TwitterLogo} />
                        </Col>
                    </Row>
                </Container>

                <Container style={{zIndex: 0}}>

                {this.state.currentFeed}

                {/* {this.state.tweetRows.slice(0, 5)} */}

                {/* {this.state.igRows.slice(0, 5)} */}

                {/* {this.state.ytSubVids.slice(0, 5)} */}

                {/* {this.state.twitchStreams.slice(0, 5)} */}

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
                            <HomeIcon style={{marginLeft: 100, marginRight: 40, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
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
                            <InfoIcon style={{marginLeft: 40, marginRight: 100, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                    </Nav>
                </Navbar>

                </StickyFooter>
  
            </div>
        );
    }
}

const headerComponent = {
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
    backgroundColor: "#474d50",
    clear: 'both',
    position: 'relative',
    height: '200px',
    marginTop: '-200px'
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

export default withRouter(FeedScreen);