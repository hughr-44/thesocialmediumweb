import React from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import axios from "axios";

import firebase from "firebase";
import 'firebase/database';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'

//import { db, auth } from '../services/firebase'

import Cookies from 'universal-cookie';

import { OAuth2PopupFlow } from 'oauth2-popup-flow';

import TwitchComponent from "../components/TwitchComponent";
import YoutubeComponent from "../components/YoutubeComponent";
import TwitterComponent from "../components/TwitterComponent";
import InstagramComponent from "../components/InstagramComponent";

class LoadSocials extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            email: "",
            uid: firebase.auth().currentUser.uid,
            password: "",
            errorMessage: null,

            doneLoading: false,

            twitchToken: "",
            twitchID: "",
            twitchName: "",
            myTwitchStream: [],
            followsTwitchStreams: [],

            youtubeToken: "",
            youtubeID: "",
            youtubeName: "",
            myYTvids: [],
            nextPageToken: "",
            ytSubsList: [],
            subsVids: [],
            totalSubsFetched: 0,

            igToken: "",
            igUserID: "",
            myIgPosts: [],
            myIgName: "",
            followsIgPosts: [],

            twitterToken: "",
            twitterName: "",
            myTweets: [],
            twitterId: "",
            followsTweets: [],

            createdTweetRows: [],
            createdIgRows: [],
            createdYtSubVids: [],
            createdTwitchStreams: [],

            combinedPosts: [],

            createdMyTweetRows: [],
            createdMyIgRows: [],
            createdMyYtSubVids: [],
            createdMyTwitchStreams: [],

            displayName: '',

            doneLoading: false,
            leaveButtonText: "Loading..."
        };
        console.log(this.state.uid)
        console.log(window.location.href)
    }

    componentDidMount(){

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("YES logged in")

                this.setState({uid: user.uid})
            } else {
              console.log("NO logged in")
              this.props.history.push("/OpenScreen");
            }
        }.bind(this));

        const cookies = new Cookies();
        const ytToken = cookies.get('ytToken')

        console.log('yt token')
        console.log(ytToken)

        const twitchToken = cookies.get('twitchToken')

        console.log('twitch token')
        console.log(twitchToken)

        const igToken = cookies.get('igToken')

        console.log('ig token')
        console.log(igToken)

        this.loadTwitch()
        this.loadYt()
        this.loadIg()
        //this.loadTwitter()
    }
    
    loadTwitch(){
        console.log("load test twitch")
        const collPath = '/mainCollection/' + this.state.uid
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            const newTwitch = snapshot.child('twitchInfo').val()
            const displayName = snapshot.child('displayName').val()
            this.setState({displayName: displayName})

            this.setState({twitchToken: newTwitch.twitchAuthToken})

            this.getStreams()
        })
    }

    async getStreams(){

        //let twitchLoadRow = <Text style={styles.greeting}>Loading Twitch Streams...</Text>
        //this.setState({rows: twitchLoadRow})

        //get all followed accounts
        var authFormat = 'Bearer ' + this.state.twitchToken
          
        var followURL = "https://api.twitch.tv/helix/users"

        console.log(authFormat)
        console.log(followURL)

        fetch(followURL, {
            method: 'GET',
            headers: {
                'Client-ID': '2fnwtwy41t2avoiqdc1py6oybitz4r',
                'Authorization': authFormat
            }
        })
        .then(response => response.json())
        .then((responseJson)=> {
            console.log(responseJson)
            console.log(responseJson.data[0].id)

            const pfpLink = responseJson.data[0].profile_image_url

            var followsStreamsURL = "https://api.twitch.tv/helix/streams?user_id=" + responseJson.data[0].id

            this.setState({twitchID: responseJson.data[0].id})

            var myTwitchName = responseJson.data[0].login
            this.setState({twitchName: responseJson.data[0].login})

            //console.log(followsStreamsURL)
            var authFormat = 'Bearer ' + this.state.twitchToken
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
                    
                    const myTwitchRow = [liveCheck[0].user_name, liveCheck[0].user_name, liveCheck[0].title, this.state.twitchToken, this.state.twitchName, liveCheck[0].thumbnail_url, profJson.data[0].profile_image_url, liveCheck[0].user_id]
                    this.setState({myTwitchStream: myTwitchRow})
                }
                else{
                    //console.log("not live")
                    //const myTwitchRow = <TwitchComponent key={this.state.twitchName} userName={this.state.twitchName} streamTitle={"Offline"} twitchAuth={this.state.twitchAuthToken} myName={this.state.twitchName}/>
                    const myTwitchRow = [this.state.twitchName, this.state.twitchName, "Offline", this.state.twitchToken, this.state.twitchName, 'no thumbnail', pfpLink]
                    this.setState({myTwitchStream: myTwitchRow})
                }

                console.log(this.state.myTwitchStream)


                //now get follows live streams
                
                var currFollow = 100
                var totalFollows = await this.getTwitchFollows(0, 100)
                var followsList = totalFollows.follows

                var remainNum = parseInt(totalFollows._total) % 100

                //console.log(followNums)
                //console.log(followList)
                //console.log(remainNum)
                //console.log(parseInt(totalFollows._total)/100)
                
                for(var i=1; i<(parseInt(totalFollows._total)/100)-1; i++){
                    var newFollowsCall = await this.getTwitchFollows(currFollow, 100)
                    var tempList = followsList.concat(newFollowsCall.follows)
                    followsList = tempList
                    currFollow = currFollow + 100
                }

                var remainFollowsCall = await this.getTwitchFollows(currFollow, remainNum)
                var tempList = followsList.concat(remainFollowsCall.follows)
                followsList = tempList

                var followsListForDB = []
                for(var i=0; i<followsList.length; i++){
                    //console.log(followsList[i].channel._id)
                    //console.log(followsList[i].channel.name)
                    followsListForDB[i] = [followsList[i].channel.name, followsList[i].channel._id]
                }

                const collPath = '/usersFollows/' + this.state.uid
                firebase.database().ref(collPath).update({
                    twitch: followsListForDB
                })

                for(var i=0; i<(parseInt(totalFollows._total)/100); i++){
                    var followsStreamsURL = "https://api.twitch.tv/helix/streams?"

                    var numToGet = remainNum
                    if(i+1<(parseInt(totalFollows._total)/100)){
                        numToGet = 100
                    }
                    for(var j=0; j<numToGet; j++){
                        followsStreamsURL = followsStreamsURL + "user_id=" + followsList[j].channel._id + "&"
                    }


                    fetch(followsStreamsURL, {
                        method: 'GET',
                        headers: {
                            'Client-ID': '2fnwtwy41t2avoiqdc1py6oybitz4r',
                            'Authorization': authFormat
                        }
                    })
                    .then(response => response.json())
                    .then(async (responseJson)=> {
                        //console.log(responseJson)
                        //console.log("CHECK TWITCH DATA")
                        //console.log(responseJson.data)
                        //console.log(responseJson.data[0].thumbnail_url)
                        const streamThumb = responseJson.data[0].thumbnail_url
                        const liveStreams = responseJson.data
                        var twitchRows = []
                        for(var i=0; i<liveStreams.length; i++){
                            //console.log(liveStreams[i].user_name)
                            //const twitchRow = <TwitchComponent key={liveStreams[i].user_name} userName={liveStreams[i].user_name} streamTitle={liveStreams[i].title} twitchAuth={this.state.twitchAuthToken} myName={this.state.twitchName}/>
                            const urlForProfPic = 'https://api.twitch.tv/helix/users?id=' + liveStreams[i].user_id

                            const profJson = await fetch(urlForProfPic, {
                                method: 'GET',
                                headers: {
                                    'Client-ID': '2fnwtwy41t2avoiqdc1py6oybitz4r',
                                    'Authorization': authFormat
                                }
                            }).then(response => response.json())

                            const twitchRow = [liveStreams[i].user_name, liveStreams[i].user_name, liveStreams[i].title, this.state.twitchToken, this.state.twitchName, liveStreams[i].thumbnail_url, profJson.data[0].profile_image_url, liveStreams[i].user_id]

                            //console.log("profile pic 2")
                            //console.log(profPic)
                            //const twitchRow = [liveStreams[i].user_name, liveStreams[i].user_name, liveStreams[i].title, this.state.twitchAuthToken, this.state.twitchName, streamThumb, profPic]
                            twitchRows.push(twitchRow)
                        }
                        this.setState({followsTwitchStreams: twitchRows})

                        //console.log(this.state.followsTwitchStreams)


                        const createdTwitchRows = this.createTwitchRows()
                        const creatMyTwitchRows = this.createMyTwitchRows()


                        //move onto youtube auth
                        this.checkTwitch()
                    })
                    .catch(error=>console.log(error))
                }

            })
            .catch(error=>console.log(error))

        })
        .catch(error=>console.log(error)) //to catch the errors if any
        
    }

    async getTwitchFollows(cursor, getNum){
        var followsURL = "https://api.twitch.tv/kraken/users/" + this.state.twitchID + "/follows/channels?limit=" + getNum + "&sortby=last_broadcast&offset=" + cursor

        const followsCall = await fetch(followsURL, {
            method: 'GET',
            headers: { 
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': '2fnwtwy41t2avoiqdc1py6oybitz4r',
            }
        })
        .then(response => response.json())
        .catch(error=>console.log(error))

        return followsCall   
    }

    checkTwitch(){
        console.log("checking the twitch load")
        console.log(this.state.myTwitchStream)
        console.log(this.state.followsTwitchStreams)
    }

    loadYt(){
        console.log("load test yt")
        const collPath = '/mainCollection/' + this.state.uid
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            const newYt = snapshot.child('ytInfo').val()

            this.setState({youtubeToken: newYt.youtubeAuthToken})

            this.getYTvids()
        })
    }

    getYTvids(){
        console.log("getting yt vids")

        //let twitchLoadRow = <Text style={styles.greeting}>Loading YouTube Videos...</Text>
        //this.setState({rows: twitchLoadRow})

        var ytidURL = 'https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2CbrandingSettings%2CtopicDetails&mine=true&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY'

        var ytAuthFormat = 'Bearer ' + this.state.youtubeToken
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
            //console.log(responseJson)
            //console.log(responseJson.items)
            //console.log(responseJson.items[0])
            //console.log(responseJson.items[0].contentDetails)
            //console.log(responseJson.items[0].contentDetails.relatedPlaylists)
            //console.log(responseJson.items[0].contentDetails.relatedPlaylists.uploads)
            
            var playlistURL = 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId=' + responseJson.items[0].contentDetails.relatedPlaylists.uploads + '&part=snippet&maxResults=50&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY'

            const profilePic = responseJson.items[0].snippet.thumbnails.medium.url

            const chanID = responseJson.items[0].id
            const chanName = responseJson.items[0].snippet.title

            this.setState({youtubeID: chanID})
            this.setState({youtubeName: chanName})

            console.log("YOUTUBE NAME")
            console.log(chanName)
            //console.log(responseJson.items[0].snippet.channelTitle)
            console.log(responseJson.items[0].snippet)

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
                //console.log(responseJson)
                //console.log(responseJson.items[0])
                //console.log(responseJson.items[0].snippet.resourceId.videoId)
                //console.log(responseJson.items[0].snippet.title)
                //console.log(responseJson.items.length)

                const vidsList = responseJson.items

                //const newVid = <YoutubeComponent key={vidsList[i].snippet.resourceId.videoId} videoId={vidsList[i].snippet.resourceId.videoId} thumbnailUrl={vidsList[i].snippet.thumbnails.high.url} vidTitle={vidsList[i].snippet.title} channelName={vidsList[i].snippet.channelTitle}/>
                var newRows = []
                for(var i=0; i<vidsList.length-1; i++){
                    //console.log(vidsList[i].id.videoId)
                    //const newVid = <YoutubeComponent key={vidsList[i].snippet.resourceId.videoId} videoId={vidsList[i].snippet.resourceId.videoId} thumbnailUrl={vidsList[i].snippet.thumbnails.high.url} vidTitle={vidsList[i].snippet.title} channelName={vidsList[i].snippet.channelTitle}/>
                    //const newVid = [vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.thumbnails.high.url, vidsList[i].snippet.title, vidsList[i].snippet.channelTitle, profilePic, subsList[currNum][0], channelDescription, responseJson.items[0].snippet.description]
                    const newVid = [vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.thumbnails.high.url, vidsList[i].snippet.title, vidsList[i].snippet.channelTitle, profilePic, chanID, channelDescription, responseJson.items[i].snippet.description, this.state.youtubeToken, responseJson.items[i].snippet.publishedAt]
                    newRows.push(newVid)
                }
                this.setState({myYTvids: newRows})
                //console.log(this.state.myYTvids)

                this.getYTsubs()

            })
            .catch(error=>console.log(error)) //to catch the errors if any




        })
        .catch(error=>console.log(error)) //to catch the errors if any

    }

    getYTsubs(){

        var ytidURL = 'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true&order=alphabetical&maxResults=10&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY'
  
        var ytAuthFormat = 'Bearer ' + this.state.youtubeToken
        console.log(ytidURL)
        console.log(ytAuthFormat)
        var subItems = []
        var subList = []
        fetch(ytidURL, {
            headers: {
                'Authorization': ytAuthFormat,
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then((responseJson)=> {
            console.log('getting subscriptions')
            //console.log(responseJson)
            //console.log(responseJson.items)
            subItems = []
            subItems = responseJson.items
            //console.log(subItems.length)
            //console.log(subItems[0])
            //console.log(subItems[0].snippet.resourceId)
            //console.log(responseJson.nextPageToken)
            this.setState({nextPageToken: responseJson.nextPageToken})
            //console.log(responseJson.pageInfo.totalResults)
           
            subList = []
            for(var i=0; i<subItems.length; i++){
                const newSub = [subItems[i].snippet.resourceId.channelId, subItems[i].snippet.title]
                subList.push(newSub)
            }

            //console.log(subList.length)

            this.setState({totalSubsFetched: subList.length})
            this.setState({ytSubsList: subList})

            this.nextSubPage(responseJson.nextPageToken, subList.length, responseJson.pageInfo.totalResults)

        })
        .catch(error=>console.log(error)) //to catch the errors if any

    }

    nextSubPage(pageCode, numSubs, totalSubs){
        console.log("next page function")
        //console.log(pageCode)
        //console.log(numSubs)
        //console.log(totalSubs)

        var newNumSubs = 0

        var subList = []

        var subItems = []

        var ytNext = 'https://www.googleapis.com/youtube/v3/subscriptions?pageToken=' + pageCode + '&part=snippet%2CcontentDetails&mine=true&order=alphabetical&maxResults=50&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY'
        //console.log(ytNext)
        var newToken = ''
        var ytAuthFormat = 'Bearer ' + this.state.youtubeToken
        fetch(ytNext, {
            headers: {
                'Authorization': ytAuthFormat,
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then((responseJson)=> {
            console.log("getting next page")
            //console.log(responseJson)
            //console.log(responseJson.items)
            //console.log(responseJson.items.length)
            //console.log(responseJson.nextPageToken)
            newToken = responseJson.nextPageToken
            this.setState({nextPageToken: responseJson.nextPageToken})
            subItems = []
            subItems = responseJson.items
            subList = []
            for(var i=0; i<subItems.length; i++){
                const newSub = [subItems[i].snippet.resourceId.channelId, subItems[i].snippet.title]
                subList.push(newSub)
            }

            var tempList = []
            tempList = this.state.ytSubsList
            var combinedList = tempList.concat(subList)
            this.setState({ytSubsList: combinedList})

            console.log("before combined")
            //console.log(subList)

            console.log("NEW LIST!")
            //console.log(combinedList)

            console.log("new sub list")
            //console.log(subList)
            //console.log(subList.length)
            //console.log(numSubs)
            //console.log(totalSubs)

            newNumSubs = this.state.totalSubsFetched + subList.length
            //console.log("new num")
            //console.log(newNumSubs)
            this.setState({totalSubsFetched: newNumSubs})

        })
        .then(() => {
            console.log("next next next")
            //console.log(newToken)
            //console.log(this.state.nextPageToken)
            if(newToken != undefined){
                this.nextSubPage(this.state.nextPageToken, this.state.totalSubsFetched, totalSubs)
            }
            else{
                //console.log("DONE")
                //console.log(this.state.ytSubsList)
                //console.log(this.state.ytSubsList.length)

                const collPath = '/usersFollows/' + this.state.uid
                firebase.database().ref(collPath).update({
                    youtube: this.state.ytSubsList
                })

                this.getSubVids(0, this.state.ytSubsList.length)
            }
        })
        .catch(error=>console.log(error))

    }

    getSubVids(currNum, totalNum){
        console.log("getting sub videos")

        const subsList = this.state.ytSubsList
        //console.log(subsList)
        
        // CHANGE TO DO MULTIPLE IDs IN ONE CALL TO SAVE QUOTA SPACE-
        var ytidURL = 'https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2CbrandingSettings%2CtopicDetails&id=' + subsList[currNum][0] + '&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY'

        var ytAuthFormat = 'Bearer ' + this.state.youtubeToken

        var channelDescription = ''
        var videoDescription = ''

        fetch(ytidURL, {
            headers: {
                'Authorization': ytAuthFormat,
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then((responseJson)=> {
            //console.log(currNum)            
            //console.log(responseJson)
            //console.log("CONTENT DETAILS AND BRANDING SETTINGS")
            //console.log(responseJson.items[0].snippet)
            //console.log(responseJson.items[0].snippet.title)
            //console.log(responseJson.items[0].snippet.customUrl)
            //console.log(responseJson.items[0].snippet.description)
            //console.log(responseJson.items[0].contentDetails)
            //console.log(responseJson.items[0].brandingSettings.channel.description)

            const channelDescription = responseJson.items[0].snippet.description

            //console.log(responseJson.items[0].contentDetails.relatedPlaylists.uploads)

            //console.log("channel profile pic")
            //console.log(responseJson.items[0].snippet.thumbnails.medium.url)

            const profilePic = responseJson.items[0].snippet.thumbnails.medium.url

            var playlistURL = 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId=' + responseJson.items[0].contentDetails.relatedPlaylists.uploads + '&part=snippet&maxResults=5&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY'

            //console.log(playlistURL)
            fetch(playlistURL, {
                headers: {
                    'Authorization': ytAuthFormat,
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then((responseJson)=> {
                //console.log(responseJson)
                //console.log(responseJson.items[0])
                //console.log(responseJson.items[0].snippet.resourceId.videoId)
                //console.log(responseJson.items[0].snippet.title)
                //console.log(responseJson.items[0].snippet.description)
                //console.log(responseJson.items.length)

                const vidsList = responseJson.items

                //const newVid = <YoutubeComponent key={vidsList[i].snippet.resourceId.videoId} videoId={vidsList[i].snippet.resourceId.videoId} thumbnailUrl={vidsList[i].snippet.thumbnails.high.url} vidTitle={vidsList[i].snippet.title} channelName={vidsList[i].snippet.channelTitle}/>
                var newRows = []
                for(var i=0; i<vidsList.length-1; i++){
                    //console.log(responseJson.items[i].snippet.description)
                    //const newVid = <YoutubeComponent key={vidsList[i].snippet.resourceId.videoId} videoId={vidsList[i].snippet.resourceId.videoId} thumbnailUrl={vidsList[i].snippet.thumbnails.high.url} vidTitle={vidsList[i].snippet.title} channelName={vidsList[i].snippet.channelTitle}/>
                    const newVid = [vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.resourceId.videoId, vidsList[i].snippet.thumbnails.high.url, vidsList[i].snippet.title, vidsList[i].snippet.channelTitle, profilePic, subsList[currNum][0], channelDescription, responseJson.items[i].snippet.description, this.state.youtubeToken]
                    newRows.push([newVid, vidsList[i].snippet.publishedAt, vidsList[i].snippet.resourceId.videoId])
                }

                var tempVidList = this.state.subsVids
                var combinedList = tempVidList.concat(newRows)

                this.setState({subsVids: combinedList})
                //console.log(this.state.subsVids)

            })
            .catch(error=>console.log(error)) //to catch the errors if any

        })
        .then(() => {
            if(currNum + 1 == this.state.ytSubsList.length){
                console.log("done with subs")
                console.log(this.state.subsVids)
                console.log(this.state.myYTvids)
               
                //this.dupCheck()
                //this.authInstagram()


                const sortedVids = this.sortVideos()

            }
            else{
                this.getSubVids(currNum + 1, this.state.ytSubsList.length)
            }
        })
        .catch(error=>console.log(error))

        //console.log("FINISHED")
        
    }

    loadIg(){
        console.log("load test ig")
        const collPath = '/mainCollection/' + this.state.uid
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            const newYt = snapshot.child('igInfo').val()

            this.setState({igToken: newYt.igAuthToken})
            this.setState({igUserID: newYt.igUserID})

            if(newYt.igAuthToken == "NA"){
                console.log("no ig account")
                this.setState({myIgName: "NoIG"})
                this.getFollowsIgPosts()
            }
            else{
                this.getIgPost(this.state.igUserID, this.state.igToken)
            }

        })
    }

    getIgPost(userID, authToken){
        //console.log("getting ig posts")
        //this.setState({rows: this.state.defaultRow})

        console.log("in get ig posts")

        var newRows = []

        var igMediaURL = 'https://graph.instagram.com/' + userID + '/media?fields=permalink,username,media_url&access_token=' + authToken
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
                  const igRow = [trimID, trimID, posts[i].username, userID, posts[i].media_url]     
                  newRows.push(igRow)
              }
              //this.setState({igPosts: newRows})
              console.log(newRows)

              this.setState({myIgPosts: newRows})
              this.setState({myIgName: newRows[0][2]})

              
              //this.authTwitter()
              //this.setTwitterName()
              this.getFollowsIgPosts()

            })
            .catch(error=>console.log(error)) //to catch the errors if any

    }

    getFollowsIgPosts(){
        console.log("getting follows")
        const collPath = '/mainCollection/'+ this.state.uid
        var follows = []
        firebase.database().ref(collPath).once('value').then(async (snapshot) => {
            follows = snapshot.child('inAppFollows').val()
            console.log(follows)
            console.log(follows.length)

            this.retrieveIgPosts(follows)
        })
    }

    async retrieveIgPosts(follows){
        var newRows = []
        for(var i=0; i<follows.length; i++){
            const collPath1 = '/mainCollection/'+ follows[i] + '/igInfo'
            firebase.database().ref(collPath1).once('value').then(async (snapshot) => {
                console.log(snapshot.child('userName').val())
                const igName = snapshot.child('userName').val()
                const igAuth = snapshot.child('igAuthToken').val()
                const igID = snapshot.child('igUserID').val()

                /*
                const responseJson = await fetch("https://api.twitter.com/labs/2/tweets/search?tweet.fields=created_at,author_id,text&query=from%3A" + twitterName, {
                    headers: {
                    Authorization: "Bearer " + twitterAuth
                    }
                })
                .then(response => response.json())
                .then((responseJson)=>{
                    for(var i=0; i<responseJson.data.length; i++){
                        console.log('getting tweet info')
                        console.log(responseJson.data[i])
                        const twitRow = [twitterName, responseJson.data[i].id, responseJson.data[i].created_at]
                        newRows.push(twitRow)
                    }
                })
                .then(()=>{
                    console.log('TWITTER ROWS')
                    console.log(newRows)
                    this.setState({followsTweets: newRows})
                })
                .then(()=>{
                    this.leaveLoading()
                })
                */

                if(igAuth == "NA"){
                    console.log("no ig connected")
                }
                else{


               var igMediaURL = 'https://graph.instagram.com/' + igID + '/media?fields=permalink,timestamp,username,profile_picture_url,media_url&access_token=' + igAuth
               console.log(igMediaURL)
       
               fetch(igMediaURL)
                   .then(response => response.json())
                   .then(async (responseJson)=> {
                     console.log('response INSTAGRAM')
                     console.log(responseJson)
                     console.log(responseJson.data[0].username)
                     console.log(responseJson.data[0].permalink)
       
                     const permLink = responseJson.data[0].permalink
                     const permID = permLink.substr(permLink.length - 12, 11)
       
                     console.log(permID)

                     var igProfPic = 'https://graph.instagram.com/' + igID + '/user?fields=profile_picture_url&access_token=' + igAuth
                     const profPicCall = await fetch(igProfPic)
                     .then(response => response.json())
                     .catch(error=>console.log(error))
                     console.log("TRYING TO GET PROFILE PIC")
                     console.log(profPicCall)
       
                     const posts = responseJson.data
                     console.log(posts.length)
                     console.log(posts)
                     var postsRows = []
                     for(var i=0; i<10; i++){
                         console.log(posts[i].permalink)
                         const postsID = posts[i].permalink
                         const trimID = postsID.substr(postsID.length - 12, 11)
                         //const igRow = <InstagramComponent key={trimID} postID={trimID}/> 
                         const igRow = [trimID, trimID, posts[i].username, posts[i].timestamp, igID, posts[i].media_url]     
                         newRows.push(igRow)
                     }
                     //this.setState({igPosts: newRows})
                     console.log(newRows)
       
                   })
                   .then(()=>{
                    console.log('IG ROWS')
                    console.log(newRows)
                    this.setState({followsIgPosts: newRows})

                    //var tempVidList = this.state.followsIgPosts
                    //var combinedList = tempVidList.concat(newRows)

                    //this.setState({followsIgPosts: combinedList})
                   })
                   .then(()=>{
                    //this.setTwitterName()
                    const sortedIg = this.sortIg()
                    //const igRows = await this.createIgRows(sortedIg)

                    /*
                    if(i + 1 == follows.length){
                        console.log("done ig follows")
            
                        this.setTwitterName()
                        const sortedIg = this.sortIg()
                        const igRows = await this.createIgRows(sortedIg)
                    }
                    else{
                        console.log("continuing follows ig posts")
                    }
                    */

                   })
                   .catch(error=>console.log(error)) //to catch the errors if any

                }

            })
        }
    }

    loadTwitter(){
        console.log("load test twitter")
        const collPath = '/mainCollection/' + this.state.uid
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            const newTwitter = snapshot.child('twitterInfo').val()

            this.setState({twitterToken: newTwitter.twitterAuthToken})
            this.setState({twitterName: newTwitter.userName})

            this.getTweets(this.state.twitterToken, this.state.twitterName)
        })
    }

    getTweets(token, twitterName){
        // TEMPORARY UNTIL TWITTER APIv2 COMES OUT

        //let twitterLoadRow = <Text style={styles.greeting}>Loading the bird app...</Text>
        //this.setState({rows: twitterLoadRow})

        console.log("getting tweets")

        const newRows = []

        const exchangeEndpoint = 'https://smbackendnodejs.herokuapp.com/getTwitterUser'
        //local
        //const exchangeEndpoint = '/getTwitterUser'
        axios.get(exchangeEndpoint + "?twitterName=" + twitterName + "&token=" + token).then(response => {
            console.log(response)
            console.log(response.data)

            const exchangeEndpoint2 = 'https://smbackendnodejs.herokuapp.com/getTweets'
            //local
            //const exchangeEndpoint2 = '/getTweets'
            axios.get(exchangeEndpoint2 + "?twitterName=" + response.data.data.id + "&token=" + token).then(responseJson => {
    
                    console.log("next getting tweets")
                    console.log(responseJson)

                    //loop through here
                    
                    for(var i=0; i<responseJson.data.data.length; i++){
                        console.log(responseJson.data[i])
                        //const twitRow = <TwitterComponent twitterName="wheezyoutcast" postNum={responseJson.data[i].id}/>
                        const twitRow = [twitterName, responseJson.data.data[i].id, responseJson.data.data[i].created_at]
                        newRows.push(twitRow)
                    }
    
                    console.log(newRows)
                    this.setState({myTweets: newRows})
                    this.getFollowsTweets()
                    
                    //this.leaveLoading()
    
            })
            /*
            fetch("https://api.twitter.com/2/users/" + response.data.id + "?expansions=pinned_tweet_id&tweet.fields=attachments,author_id,entities", {
            headers: {
                Authorization: "Bearer " + token
            }
            })
            .then(response => response.json())
            .then((responseJson)=> {
                console.log("next getting tweets")
                console.log(responseJson)
                console.log(responseJson.data.id)
                console.log(responseJson.includes)
                console.log(responseJson.includes.tweets)
                console.log(responseJson.includes.tweets.attachments)

                //loop through here

                
                for(var i=0; i<responseJson.data.length; i++){
                    console.log(responseJson.data[i])
                    //const twitRow = <TwitterComponent twitterName="wheezyoutcast" postNum={responseJson.data[i].id}/>
                    const twitRow = [twitterName, responseJson.data[i].id]
                    newRows.push(twitRow)
                }

                this.setState({myTweets: newRows})
                this.getFollowsTweets()
                
                //this.leaveLoading()
            })
            .catch(error=>console.log(error))*///to catch the errors if any

        })

        /*
        const newRows = []
        fetch("https://api.twitter.com/2/users/by/username/" + twitterName, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => response.json())
        .then((responseJson)=> {
            console.log(responseJson)
            console.log(responseJson.data.id)
            this.setState({twitterId: responseJson.data.id})


            fetch("https://api.twitter.com/2/users/" + responseJson.data.id + "?expansions=pinned_tweet_id&tweet.fields=attachments,author_id,entities", {
            headers: {
                Authorization: "Bearer " + token
            }
            })
            .then(response => response.json())
            .then((responseJson)=> {
                console.log("next getting tweets")
                console.log(responseJson)
                console.log(responseJson.data.id)
                console.log(responseJson.includes)
                console.log(responseJson.includes.tweets)
                console.log(responseJson.includes.tweets.attachments)

                //loop through here

                
                for(var i=0; i<responseJson.data.length; i++){
                    console.log(responseJson.data[i])
                    //const twitRow = <TwitterComponent twitterName="wheezyoutcast" postNum={responseJson.data[i].id}/>
                    const twitRow = [twitterName, responseJson.data[i].id]
                    newRows.push(twitRow)
                }

                this.setState({myTweets: newRows})
                this.getFollowsTweets()
                
                //this.leaveLoading()
            })
            .catch(error=>console.log(error)) //to catch the errors if any

        })
        .catch(error=>console.log(error)) //to catch the errors if any
        */
        //this.leaveLoading.bind(this.state)
    }

    async getFollowsTweets(){
        console.log("getting follows")
        const collPath = '/mainCollection/'+ this.state.uid
        var follows = []
        firebase.database().ref(collPath).once('value').then(async (snapshot) => {
            follows = snapshot.child('inAppFollows').val()
            console.log(follows)
            console.log(follows.length)

            this.retrieveTweets(follows)
        })
    }

    async retrieveTweets(follows){
        var newRows = []
        for(var i=0; i<follows.length; i++){
            const collPath1 = '/mainCollection/'+ follows[i] + '/twitterInfo'
            firebase.database().ref(collPath1).once('value').then(async (snapshot) => {
                console.log(snapshot.child('userName').val())
                const twitterName = snapshot.child('userName').val()
                const twitterAuth = snapshot.child('twitterAuthToken').val()

                if(twitterName){
                const exchangeEndpoint = 'https://smbackendnodejs.herokuapp.com/getTweets'
                //local
                //const exchangeEndpoint = '/getTweets'
                axios.get(exchangeEndpoint + "?twitterName=" + twitterName + "&token=" + twitterAuth).then(responseJson => {
    
                    console.log("next getting FOLLOWS tweets")
                    console.log(responseJson)

                    //loop through here
                    
                    for(var i=0; i<responseJson.data.data.length; i++){
                        console.log(responseJson.data.data[i])
                        //const twitRow = <TwitterComponent twitterName="wheezyoutcast" postNum={responseJson.data[i].id}/>
                        const twitRow = [twitterName, responseJson.data.data[i].id, responseJson.data.data[i].created_at]
                        newRows.push(twitRow)
                    }
    
                    console.log(newRows)
                    this.setState({followsTweets: newRows})

                    //var tempVidList = this.state.followsTweets
                    //var combinedList = tempVidList.concat(newRows)

                    //this.setState({followsTweets: combinedList})



                    const sortedTweets = this.sortTweets()
    
                })
                }
                else{
                    console.log("was null")
                }

            })

            /*
            if(i + 1 == follows.length){
                console.log("SORTING TWEETS")
                const sortedTweets = this.sortTweets()
            }
            */
        }
        //const sortedTweets = this.sortTweets()
        this.leaveLoading()
    }

    async leaveLoading(){
        console.log("LEAVING LOADING SCREEN")
        console.log('follows ig posts')
        console.log(this.state.followsIgPosts)

        //twitch
        const collPath = '/mainCollection/' + this.state.uid +'/twitchInfo'
        firebase.database().ref(collPath).update({
            userName: this.state.twitchName
        })

        const collPath2 = '/twitchConnections/' + this.state.twitchName
        firebase.database().ref(collPath2).update({
            uid: this.state.uid
        })

        //youtube
        const collPath3 = '/mainCollection/' + this.state.uid +'/ytInfo'
        firebase.database().ref(collPath3).update({
            youtubeID: this.state.youtubeID,
            userName: this.state.youtubeName
        })

        const collPath4 = '/youtubeConnections/' + this.state.youtubeID
        firebase.database().ref(collPath4).update({
            uid: this.state.uid
        })

        //instagram
        const collPath5 = '/mainCollection/' + this.state.uid +'/igInfo'
        firebase.database().ref(collPath5).update({
            userName: this.state.myIgName,
            followsIgPosts: this.state.followsIgPosts
        })

        
        const collPath6 = '/igConnections/' + this.state.igUserID
        firebase.database().ref(collPath6).update({
            uid: this.state.uid
        })
        

        //twitter

        // NEED TO CHANGE THIS TO USER TWITTER ID AFTER AUTHORIZATION
        // CANT USE . $ _ etc. IN THE COLLPATH
        
        const collPath7 = '/mainCollection/' + this.state.uid +'/twitterInfo'
        firebase.database().ref(collPath7).update({
            userName: this.state.twitterName
        })

        const collPath8 = '/twitterConnections/' + this.state.twitterId
        firebase.database().ref(collPath8).update({
            uid: this.state.uid
        })
        
        //user connections list
        const collPath9 = '/usersConnections/' + this.state.uid
        firebase.database().ref(collPath9).update({
            displayName: this.state.displayName,
            twitchName: this.state.twitchName,
            youtubeName: this.state.youtubeName,
            youtubeID: this.state.youtubeID,
            igName: this.state.myIgName,
            igUserID: this.state.igUserID,
            twitterName: this.state.twitterName
        })


        console.log("leaving loading")
        console.log(this.state.myIgPosts)
        //console.log(this.state.subsVids)

        const twitchProp = this.state.followsTwitchStreams
        console.log(twitchProp)

        //this.props.navigation.setParams({ testProp2: "testing 1234" });


        
        //const twitchRows = this.createTwitchRows()
        //this.setState({createdTwitchStreams: twitchRows})

        //const sortedVids = this.sortVideos()
        //const ytVidsRows = this.createYtRows(sortedVids)
        //this.setState({createdYtSubVids: ytVidsRows})

        //const sortedTweets = this.sortTweets()
        //const tweetRows = this.createTweetRows(sortedTweets)
        //this.setState({createdTweetRows: tweetRows})

        //const sortedIg = await this.sortIg()
        //const igRows = await this.createIgRows(sortedIg)
        //this.setState({igRows: igRows})

        this.setState({leaveButtonText: "Enter"})
        this.setState({leaveLoading: true})
    }



    sortTweets(){
        var totalTweetList = this.state.followsTweets

        //sort tweets list by date
        console.log("tweet sorting")
        console.log(totalTweetList)
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
        const tweetRows = this.createTweetRows(totalTweetList)
        const tweetMyRows = this.createMyTweetRows()
        //this.setState({createdTweetRows: tweetRows})
        return totalTweetList
    }

    createTweetRows(sortedTweets){
        console.log("creating tweet rows")
        console.log(sortedTweets)
        const tweetRows = []
        for(var i=0; i<sortedTweets.length; i++){
            //console.log(sortedVids[i][1])
            const newTweet = <TwitterComponent twitterName={sortedTweets[i][0]} postNum={sortedTweets[i][1]} myUID={this.state.uid}/>
            tweetRows.push(newTweet)
        }
        this.setState({createdTweetRows: tweetRows})
        this.combineRows()
        return tweetRows
    }

    createMyTweetRows(){
        console.log("creating tweet rows")
        var sortedTweets = this.state.myTweets
        const tweetRows = []
        for(var i=0; i<sortedTweets.length; i++){
            //console.log(sortedVids[i][1])
            const newTweet = <TwitterComponent twitterName={sortedTweets[i][0]} postNum={sortedTweets[i][1]} myUID={this.state.uid}/>
            tweetRows.push(newTweet)
        }
        this.setState({createdMyTweetRows: tweetRows})
        return tweetRows
    }

    sortIg(){
        console.log(this.state.followsIgPosts)
        var totalIgList = this.state.followsIgPosts

        //sort tweets list by date
        console.log("ig sorting")
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
        const igRows = this.createIgRows(totalIgList)
        const igMyRows = this.createMyIgRows()
        return totalIgList
    }

    createIgRows(sortedIg2){
        console.log("creating ig rows")
        var sortedIg = sortedIg2
        var igRows = []
        for(var i=0; i<sortedIg.length; i++){
            //console.log(sortedVids[i][1])
            const newIg = <InstagramComponent postID={sortedIg[i][0]} name={sortedIg[i][2]} token={this.state.igToken} myUID={this.state.uid} igID={sortedIg[i][4]} mediaUrl={sortedIg[i][5]}/>   
            igRows.push(newIg)
        }
        this.setState({createdIgRows: igRows})
        return igRows
    }

    createMyIgRows(){
        console.log("creating my ig rows")
        var sortedIg = this.state.myIgPosts
        var igRows = []
        for(var i=0; i<sortedIg.length; i++){
            //console.log(sortedVids[i][1])
            const newIg = <InstagramComponent postID={sortedIg[i][0]} name={sortedIg[i][2]} token={this.state.igToken} myUID={this.state.uid} igID={sortedIg[i][3]} mediaUrl={sortedIg[i][4]}/>   
            igRows.push(newIg)
        }
        this.setState({createdMyIgRows: igRows})
        return igRows
    }

    sortVideos(){
        var totalYtList = this.state.subsVids

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
        const ytVidsRows = this.createYtRows(totalYtList)
        const ytMyVidsRows = this.createMyYtRows()
        //this.setState({createdYtSubVids: ytVidsRows})
        return totalYtList
    }

    createYtRows(sortedVids2){
        var ytVidRows = []
        var sortedVids = sortedVids2
        //for(var i=0; i<sortedVids.length; i++)
        for(var i=0; i<sortedVids.length; i++){
            //console.log(sortedVids[i][1])
            const newVid = <YoutubeComponent key={sortedVids[i][0][0]} date={sortedVids[i][1]} videoId={sortedVids[i][0][1]} thumbnailUrl={sortedVids[i][0][2]} vidTitle={sortedVids[i][0][3]} channelName={sortedVids[i][0][4]} profilePic={sortedVids[i][0][5]} userName={sortedVids[i][0][6]} bio={sortedVids[i][0][7]} description={sortedVids[i][0][8]} authToken={sortedVids[i][0][9]} myUID={this.state.uid}/>
            ytVidRows.push(newVid)
        }
        //this.setState({ytSubVids: ytVidRows})
        this.setState({createdYtSubVids: ytVidRows})
        this.loadTwitter()
        return ytVidRows
    }

    createMyYtRows(){
        var ytVidRows = []
        var myVids = this.state.myYTvids
        //for(var i=0; i<sortedVids.length; i++)
        for(var i=0; i<myVids.length; i++){
            //console.log(sortedVids[i][1])
            const newVid = <YoutubeComponent key={myVids[i][0]} date={myVids[i][10]} videoId={myVids[i][1]} thumbnailUrl={myVids[i][2]} vidTitle={myVids[i][3]} channelName={myVids[i][4]} profilePic={myVids[i][5]} userName={myVids[i][6]} bio={myVids[i][7]} description={myVids[i][8]} authToken={myVids[i][9]}  myUID={this.state.uid}/>
            ytVidRows.push(newVid)
        }
        //this.setState({ytSubVids: ytVidRows})
        this.setState({createdMyYtSubVids: ytVidRows})
        return ytVidRows
    }

    createMyTwitchRows(){
        var twitchRows = []
        var liveStreams = this.state.myTwitchStream
        
        const twitchRow = <TwitchComponent key={liveStreams[0]} userName={liveStreams[1]} streamTitle={liveStreams[2]} twitchAuth={liveStreams[3]} myName={liveStreams[4]} thumbnail={liveStreams[5]} profilePic={liveStreams[6]}  myUID={this.state.uid}/>
        twitchRows.push(twitchRow)
        //this.setState({twitchStreams: twitchRows})
        this.setState({createdMyTwitchStreams: twitchRows})
        return twitchRows
    }

    createTwitchRows(){
        var twitchRows = []
        var liveStreams = this.state.followsTwitchStreams
        for(var i=0; i<liveStreams.length; i++){ //liveStreams.length
            //console.log(liveStreams[i].user_name)
            const twitchRow = <TwitchComponent key={liveStreams[i][0]} userName={liveStreams[i][1]} streamTitle={liveStreams[i][2]} twitchAuth={liveStreams[i][3]} myName={liveStreams[i][4]} thumbnail={liveStreams[i][5]} profilePic={liveStreams[i][6]} myUID={this.state.uid}/>
            //const twitchRow = [liveStreams[i].user_name, liveStreams[i].user_name, liveStreams[i].title, this.state.twitchAuthToken, this.state.twitchName]
            twitchRows.push(twitchRow)
        }
        //this.setState({twitchStreams: twitchRows})
        this.setState({createdTwitchStreams: twitchRows})
        return twitchRows
    }

    combineRows(){
        var twitchStreams = this.state.createdTwitchStreams
        var ytVids = this.state.createdYtSubVids
        var tweets = this.state.createdTweetRows
        var igposts = this.state.createdIgRows
        var num = 0
        var combinedPosts = []
        while(num < twitchStreams.length || num < ytVids.length || num < tweets.length || num < igposts.length){
            if(num < twitchStreams.length){
                combinedPosts.push(twitchStreams[num])
            }
            if(num < ytVids.length){
                combinedPosts.push(ytVids[num])
            }
            if(num < tweets.length){
                combinedPosts.push(tweets[num])
            }
            if(num < igposts.length){
                combinedPosts.push(igposts[num])
            }
            num = num + 1
        }
        this.setState({combinedPosts: combinedPosts})
    }

    goToFeed(){
        /*
        this.props.history.push("/FeedScreen", {
            testProp2: "testing 1234",
            followsTwitchStreams: this.state.followsTwitchStreams,
            subsVids: this.state.subsVids,
            myTwitchStream: this.state.myTwitchStream,
            myYTvids: this.state.myYTvids,
            myIgPosts: this.state.myIgPosts,
            myTweets: this.state.myTweets,
            followsTweets: this.state.followsTweets,
            followsIgPosts: this.state.followsIgPosts
        });
        */
       
        this.props.history.push({ pathname: "/FeedScreen", state: {
            myUID: this.state.uid,
            testProp2: "testing 1234",
            followsTwitchStreams: this.state.followsTwitchStreams,
            subsVids: this.state.subsVids,
            myTwitchStream: this.state.myTwitchStream,
            myYTvids: this.state.myYTvids,
            myIgPosts: this.state.myIgPosts,
            myTweets: this.state.myTweets,
            followsTweets: this.state.followsTweets,
            followsIgPosts: this.state.followsIgPosts,

            createdTweetRows: this.state.createdTweetRows,
            createdIgRows: this.state.createdIgRows,
            createdTwitchStreams: this.state.createdTwitchStreams,
            createdYtSubVids: this.state.createdYtSubVids,

            combinedPosts: this.state.combinedPosts,

            createdMyTweetRows: this.state.createdMyTweetRows,
            createdMyIgRows: this.state.createdMyIgRows,
            createdMyTwitchStreams: this.state.createdMyTwitchStreams,
            createdMyYtSubVids: this.state.createdMyYtSubVids
        }});
        
    }

    render(){

        return(
            <div style={rootStyle} className="authyoutube-screen" id="AuthYouTube">

                <Container style={mainContainer}>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        auth
                    </Row>
                    {/*
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.loadTwitch.bind(this)} style={button}><h4 style={textStyle}>Load Twitch</h4></Button>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.loadYt.bind(this)} style={button}><h4 style={textStyle}>Load YouTube</h4></Button>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.loadIg.bind(this)} style={button}><h4 style={textStyle}>Load Ig</h4></Button>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.loadTwitter.bind(this)} style={button}><h4 style={textStyle}>Load Twitter</h4></Button>
                    </Row>
                    */}
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={!this.state.doneLoading ? this.goToFeed.bind(this) : null} style={button}><h4 style={textStyle}>{this.state.leaveButtonText}</h4></Button>
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

export default withRouter(LoadSocials);