import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from "axios";

import firebase from "firebase";
import 'firebase/database';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { List, Image, Button } from 'semantic-ui-react'
import Avatar from '@material-ui/core/Avatar';

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

import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import StickyFooter from 'react-sticky-footer';

import TwitchComponent from "../components/TwitchComponent";
import YoutubeComponent from "../components/YoutubeComponent";
import TwitterComponent from "../components/TwitterComponent";
import InstagramComponent from "../components/InstagramComponent";

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

import Modal from '@material-ui/core/Modal';
import FollowOverlay from "../components/FollowOverlay";

class OthersProfile extends React.Component{

    constructor(props){
        super(props);

        const startRow = <Row style={{marginTop: 100, marginBottom: 900}}>Click above to view socials...</Row>
        var startRows = []
        startRows.push(startRow)

        this.state = {
            email: "",

            userCheck: props.location.state.usersUid,
            uid: this.props.location.state.pastState.myUID,

            password: "",
            errorMessage: null,

            displayName: "",
            twitterName: "",
            igName: "",
            igUserID: "",
            twitchName: "",
            youtubeName: "",

            twitchAuth: "",
            youtubeAuth: "",
            twitterAuth: "",
            igAuth: "",

            isFollowed: "",
            followText: "Follow",

            rows: startRows,

            favColor: "black",
            notFavColor: "gold",

            isFollowed: false,
            followText: "Follow",
            followColor: "#401058",

            inAppFollows: [],

            twitchPFP: DefaultPFP,
            ytPFP: DefaultPFP,
            currPFP: DefaultPFP,
            pfpCount: 0,
            currPFPplatform: DefaultPFP,

            followClicked: false
        };
        console.log(props.location)
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

        console.log("mount others profile")
        //console.log(this.props.route.params.myTwitchStream)
        //console.log(this.props.route.params.testProps)
        this.updateProfileInfo()
        this.checkFollow()
    }

    checkFollow(){

        console.log("getting follows")
        const collPath = '/mainCollection/'+ this.props.location.state.pastState.myUID
        var follows = []
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            follows = snapshot.child('inAppFollows').val()
            this.setState({inAppFollows: follows})
            console.log(follows)
            console.log(follows.length)
            //this.leaveLoading()
            for(var i=0; i<follows.length; i++){
                if(follows[i] == this.props.location.state.usersUid){
                console.log("already followed")
                this.setState({isFollowed: true})
                this.setState({followText: "Unfollow"})
                this.setState({followColor: "#FD0101"})
                i = follows.length
                }
                else{
                console.log("not followed")
                }
            }
        })
    }

    updateProfileInfo(){

        console.log("PROPS TEST")
        console.log(this.props.location.state.usersUid)


        const collPath = '/mainCollection/' + this.props.location.state.usersUid
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            const myDisplayName = snapshot.child('displayName').val()
            this.setState({displayName: myDisplayName})

            const newTwitter = snapshot.child('twitterInfo').val()
            const newIG = snapshot.child('igInfo').val()
            const newTwitch = snapshot.child('twitchInfo').val()
            const newYoutube = snapshot.child('ytInfo').val()
 
            console.log("mainCollection info")
            console.log(newTwitter.userName)

            this.setState({twitchName: newTwitch.userName})
            this.setState({twitchAuth: newTwitch.twitchAuthToken})

            this.setState({youtubeName: newYoutube.userName})
            this.setState({youtubeAuth: newYoutube.youtubeAuthToken})

            this.setState({twitterName: newTwitter.userName})
            this.setState({twitterAuth: newTwitter.twitterAuthToken})

            this.setState({igName: newIG.userName})
            this.setState({igAuth: newIG.igAuthToken})
            this.setState({igUserID: newIG.igUserID})

            this.updateTwitch()
            this.updateYT()

        })
    }

    updateIg(){
        console.log("in get ig posts")

        var newRows = []

        var igMediaURL = 'https://graph.instagram.com/' + this.state.igUserID + '/media?fields=permalink,username,media_url&access_token=' + this.state.igAuth
        console.log(igMediaURL)

        fetch(igMediaURL)
        .then(response => response.json())
        .then((responseJson)=> {
          console.log('response')
          console.log(responseJson)
          console.log(responseJson.data[0].username)
          console.log(responseJson.data[0].permalink)

          const permLink = responseJson.data[0].permalink
          const permID = permLink.substr(permLink.length - 12, 11)

          console.log(permID)

          const posts = responseJson.data
          console.log(posts.length)
          console.log(posts)
          var postsRows = []
          for(var i=0; i<10; i++){
              console.log(posts[i].permalink)
              const postsID = posts[i].permalink
              const trimID = postsID.substr(postsID.length - 12, 11)
              //const igRow = <InstagramComponent key={trimID} postID={trimID}/> 
              const igRow = <InstagramComponent postID={trimID} name={posts[i].username} mediaUrl={posts[i].media_url}/> 
              newRows.push(igRow)
          }
          //this.setState({igPosts: newRows})
          //console.log(newRows)

          this.setState({rows: newRows})
        })
        .catch(error=>console.log(error)) //to catch the errors if any
    }

    updateTwitter(){

        console.log("getting tweets")

        //const twitterName = this.state.twitterName
        const twitterName = this.state.twitterName

        var newRows = []

        const exchangeEndpoint = 'https://smbackendnodejs.herokuapp.com/getTweets'
        //local
        //const exchangeEndpoint = '/getTweets'
        axios.get(exchangeEndpoint + "/?twitterName=" + twitterName + "&token=" + this.state.twitterAuth).then(responseJson => {
    
            console.log("next getting FOLLOWS tweets")
            console.log(responseJson)

            //loop through here
            
            for(var i=0; i<responseJson.data.data.length; i++){
                console.log(responseJson.data.data[i])
                //const twitRow = <TwitterComponent twitterName="wheezyoutcast" postNum={responseJson.data[i].id}/>
                const twitRow = <TwitterComponent twitterName={twitterName} postNum={responseJson.data.data[i].id}/>
                newRows.push(twitRow)
            }

            console.log(newRows)
            this.setState({rows: newRows})

        })
      
    }

    updateYT(){
        var ytidURL = 'https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2CbrandingSettings%2CtopicDetails&mine=true&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY'

        var ytAuthFormat = 'Bearer ' + this.state.youtubeAuth
        console.log(ytidURL)
        console.log(ytAuthFormat)
        fetch(ytidURL, {
            headers: {
                'Authorization': ytAuthFormat,
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then((responseJson)=> {          
            var playlistURL = 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId=' + responseJson.items[0].contentDetails.relatedPlaylists.uploads + '&part=snippet&maxResults=50&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY'

            const profilePic = responseJson.items[0].snippet.thumbnails.medium.url

            this.setState({ytProfPic: profilePic})

            const chanID = responseJson.items[0].id

            this.setState({youtubeID: chanID})

            const channelDescription = responseJson.items[0].snippet.description

            console.log(playlistURL)
            fetch(playlistURL, {
                headers: {
                    'Authorization': ytAuthFormat,
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then((responseJson)=> {
                const vidsList = responseJson.items

                //const newVid = <YoutubeComponent key={vidsList[i].snippet.resourceId.videoId} videoId={vidsList[i].snippet.resourceId.videoId} thumbnailUrl={vidsList[i].snippet.thumbnails.high.url} vidTitle={vidsList[i].snippet.title} channelName={vidsList[i].snippet.channelTitle}/>
                var newRows = []
                for(var i=0; i<vidsList.length-1; i++){
                    //console.log(vidsList[i].id.videoId)
                    const newVid = <YoutubeComponent key={vidsList[i].snippet.resourceId.videoId} date={responseJson.items[i].snippet.publishedAt} videoId={vidsList[i].snippet.resourceId.videoId} thumbnailUrl={vidsList[i].snippet.thumbnails.high.url} vidTitle={vidsList[i].snippet.title} channelName={vidsList[i].snippet.channelTitle} profilePic={profilePic} userName={chanID} bio={channelDescription} description={responseJson.items[i].snippet.description} authToken={this.state.youtubeAuth} myUID={this.props.location.state.pastState.myUID}/>
                    //const newVid = [vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.thumbnails.high.url, vidsList[i].snippet.title, vidsList[i].snippet.channelTitle, profilePic, subsList[currNum][0], channelDescription, responseJson.items[0].snippet.description]
                    //const newVid = [vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.thumbnails.high.url, vidsList[i].snippet.title, vidsList[i].snippet.channelTitle, profilePic, chanID, channelDescription, responseJson.items[i].snippet.description, this.state.youtubeAuthToken]
                    newRows.push(newVid)
                }
                this.setState({myYTRow: newRows})
                this.setState({ytPFP: profilePic})
                //console.log(this.state.myYTvids)
            })
            .catch(error=>console.log(error)) //to catch the errors if any
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      
    }

    setRowYT(){
        this.setState({rows: this.state.myYTRow})
    }

    updateTwitch(){

        var authFormat = 'Bearer ' + this.state.twitchAuth
            
        var followURL = "https://api.twitch.tv/helix/users"
        fetch(followURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': '2fnwtwy41t2avoiqdc1py6oybitz4r',
                'Authorization': authFormat
            }
        })
        .then(response => response.json())
        .then((responseJson)=> {
            //console.log(responseJson)
            console.log(responseJson)

            var followsStreamsURL = "https://api.twitch.tv/helix/streams?user_id=" + responseJson._id

            this.setState({twitchID: responseJson._id})

            var myTwitchName = responseJson.name

            const pfpLink = responseJson.data[0].profile_image_url

            this.setState({ twitchProfPic: pfpLink })
            
            //this.selectFile()

            this.setState({displayProfPic: this.state.twitchProfPic})
            this.setState({profPicCount: 1})
            this.setState({isStart: false})
            this.setState({currLogo: TwitchLogo})

            //console.log(followsStreamsURL)
            var authFormat = 'Bearer ' + this.state.twitchAuth
            fetch(followsStreamsURL, {
                method: 'GET',
                headers: {
                    'Client-ID': '2fnwtwy41t2avoiqdc1py6oybitz4r',
                    'Authorization': authFormat
                }
            })
            .then(response => response.json())
            .then(async (responseJson)=> {
                //console.log(myTwitchName)
                console.log(responseJson)
                console.log("USER DATA CHECK")
                console.log(responseJson.data)

                let liveCheck = responseJson.data

                //let liveCheck = responseJson.data
                //console.log(liveCheck.length)
                if(liveCheck.length !== 0){
                    //console.log("live")
                    //const myTwitchRow = <TwitchComponent key={liveCheck[0].user_name} userName={liveCheck[0].user_name} streamTitle={liveCheck[0].title} twitchAuth={this.state.twitchToken} myName={this.state.twitchName}/>
                    //const twitchRow = [liveStreams[i].user_name, liveStreams[i].user_name, liveStreams[i].title, this.state.twitchAuthToken, this.state.twitchName, liveStreams[i].thumbnail_url, profJson.data[0].profile_image_url, liveStreams[i].user_id]
                    
                    const urlForProfPic = 'https://api.twitch.tv/helix/users?id=' + liveCheck[0].user_id

                    const profJson = await fetch(urlForProfPic, {
                    method: 'GET',
                    headers: {
                        'Client-ID': '2fnwtwy41t2avoiqdc1py6oybitz4r',
                        'Authorization': authFormat
                    }
                    }).then(response => response.json())
                    
                    //const myTwitchRow = [liveCheck[0].user_name, liveCheck[0].user_name, liveCheck[0].title, this.state.twitchToken, this.state.twitchName, liveCheck[0].thumbnail_url, profJson.data[0].profile_image_url, liveCheck[0].user_id]
                    const myTwitchRow = <TwitchComponent key={liveCheck[0].user_name} userName={liveCheck[0].user_name} streamTitle={liveCheck[0].title} twitchAuth={this.state.twitchAuth} myName={this.state.twitchName} thumbnail={liveCheck[0].thumbnail_url} profilePic={profJson.data[0].profile_image_url} myUID={this.props.location.state.pastState.myUID} />
                    this.setState({rows: myTwitchRow})
                    this.setState({twitchPFP: profJson.data[0].profile_image_url})
                }
                else{
                    //console.log("not live")
                    const myTwitchRow = <TwitchComponent key={this.state.twitchName} userName={this.state.twitchName} streamTitle={"Offline"} twitchAuth={this.state.twitchAuth} myName={this.state.twitchName} profilePic={pfpLink} myUID={this.props.location.state.pastState.myUID} />
                    //const myTwitchRow = <TwitchComponent key={this.state.twitchName} userName={this.state.twitchName} streamTitle={"Offline"} twitchAuth={this.state.twitchAuthToken} myName={this.state.twitchName}/>
                    //const myTwitchRow = [this.state.twitchName, this.state.twitchName, "Offline", this.state.twitchAuthToken, this.state.twitchName]
                    this.setState({myTwitchRow: myTwitchRow})
                    this.setState({twitchPFP: pfpLink})
                }
                
            })
            .catch(error=>console.log(error))
        })
        .catch(error=>console.log(error)) //to catch the errors if any
      
    }

    setRowTwitch(){
        var fillRows = []
        const startRow = <Row style={{marginTop: 100, marginBottom: 320}}></Row>
        fillRows.push(this.state.myTwitchRow)
        fillRows.push(startRow)
        this.setState({rows: fillRows})
    }

    goBack(){
        this.props.history.push({ pathname: "/SearchScreen", state: this.props.location.state.pastState});
    }

    clickedFav(){
        console.log("fav clicked")
        const tempColor = this.state.notFavColor
        this.setState({notFavColor: this.state.favColor})
        this.setState({favColor: this.state.notFavColor})
    }

    clickFollow(){

        if(!this.state.isFollowed){
            //var followsList = []
            var followsList = this.state.inAppFollows
            followsList.push(this.props.location.state.usersUid)
            //followsList.push("testUID")
    
            const collPath = '/mainCollection/' + this.props.location.state.pastState.myUID
            firebase.database().ref(collPath).update({
                inAppFollows: followsList
            })
    
            this.setState({isFollowed: true})
            this.setState({followText: "Unfollow"})
            this.setState({followColor: "#FD0101"})
        }

        this.setState({followClicked: !this.state.followClicked})
        
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
                                <Button onClick={this.clickFollow.bind(this)} style={{ 
                                    shadowOpacity: 0.3,
                                    shadowRadius: 3,
                                    shadowOffset: {
                                    height: 0,
                                    width: 0
                                    },
                                    elevation: 1,
                                    marginTop: '5%',
                                    backgroundColor: this.state.followColor,
                                    borderRadius: 5,
                                    borderColor: "#393939",
                                    borderWidth: 1,
                                    width: 70,
                                    height: 30,
                                    color: "white",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginLeft: 10,
                                    marginBottom: 35
                                }}>{this.state.followText}</Button>

                                <Modal
                                    open={this.state.followClicked}
                                    onClose={this.clickFollow.bind(this)}
                                    aria-labelledby="simple-modal-title"
                                    aria-describedby="simple-modal-description"
                                >
                                    
                                    <FollowOverlay platform="exists" userName={this.state.displayName}  myUID={this.state.uid} userCheck={this.state.userCheck} />
                                    
                                </Modal>
                                           
                                <Button onClick={this.goBack.bind(this)} style={button2}>Go Back</Button>
                            </Row>
                            <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start",  alignSelf: "start", marginLeft: 22}}>
                            <StarIcon onClick={this.clickedFav.bind(this)} style={{marginTop: 10, marginLeft: 10, marginRight: 10, color: this.state.favColor, maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                                <h2>{this.state.displayName}</h2> 
                            </Row>
                        </Col>
                        <Col style={{display: 'flex', flex: 1, justifyContent: 'flex-end', marginRight: 10}}>
                            {/* <Avatar style={{width: 50, height: 50}} src={TwitchLogo} /> */}
                        </Col>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center', marginTop: 10, height: 90}}>
                        <Col style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 50}}>
                            <Row  style={{display: 'flex', flex: 1, flexDirection: 'row', height: 30}}>
                                <h3>Social</h3> 
                            </Row>
                            <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Avatar onClick={this.setRowTwitch.bind(this)} style={{width: 30, height: 30}} src={TwitchLogo} />
                                <h3 style={{marginLeft: 5}}>{this.state.twitchName}</h3> 
                            </Row>
                            <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', height: 20}}>
                                <Avatar onClick={this.setRowYT.bind(this)} style={{width: 30, height: 30}} src={YTLogo} />
                                <h3 style={{marginLeft: 5}}>{this.state.youtubeName}</h3> 
                            </Row>
                        </Col>
                        <Col style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 50}}>
                            <Row  style={{display: 'flex', flex: 1, flexDirection: 'row', height: 30}}>
                                <h3>Social</h3> 
                            </Row>
                            <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Avatar onClick={this.updateIg.bind(this)} style={{width: 30, height: 30}} src={IgLogo} />
                                <h3 style={{marginLeft: 5}}>{this.state.igName}</h3> 
                            </Row>
                            <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', height: 20}}>
                                <Avatar onClick={this.updateTwitter.bind(this)} style={{width: 30, height: 30}} src={TwitterLogo} />
                                <h3 style={{marginLeft: 5}}>{this.state.twitterName}</h3> 
                            </Row>
                        </Col>
                    </Row>
                </Container>

                <Container style={{zIndex: 0}}>

                    {this.state.rows}

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
                                    this.props.location.state.pastState
                            }}
                        >
                            <HomeIcon style={{marginLeft: 150, marginRight: 40, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                        <Nav.Link as={Link} 
                            to={{pathname: "/FeedScreen",
                                state:
                                    this.props.location.state.pastState
                            }}
                        >
                            <StarIcon style={{marginLeft: 40, marginRight: 40, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                        <Nav.Link as={Link} 
                            to={{pathname: "/ProfileScreen",
                                state:
                                    this.props.location.state.pastState
                            }}
                        >
                            <PersonIcon style={{marginLeft: 40, marginRight: 40, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                        </Nav.Link>
                        <Nav.Link as={Link} 
                            to={{pathname: "/SearchScreen",
                                state:
                                    this.props.location.state.pastState
                            }}
                        >
                            <SearchIcon style={{marginLeft: 40, marginRight: 150, color: 'black', maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
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
    backgroundColor: "#313131",
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

const button2 = {
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
    marginLeft: 10,
    justifyContent: "flex-end"
}

export default withRouter(OthersProfile);