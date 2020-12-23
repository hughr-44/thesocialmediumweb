import React from 'react';

import firebase from "firebase";
import 'firebase/database';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import Modal from '@material-ui/core/Modal';

import DialogContent from '@material-ui/core/DialogContent';

import { TwitchEmbed, TwitchChat, TwitchClip, TwitchPlayer } from 'react-twitch-embed';

import DefaultPFP from '../pictureIcons/defaultpfp.jpg'

import TwitchLogo from '../pictureIcons/twitch-image.png'
import IgLogo from '../pictureIcons/ig-image.png'
import TwitterLogo from '../pictureIcons/twitter-image.png'
import YTLogo from '../pictureIcons/youtube-image.png'
import AllLogo from '../pictureIcons/allpic.jpg'

import { List, Button } from 'semantic-ui-react'
import Avatar from '@material-ui/core/Avatar';

class FollowOverlay extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            uid: this.props.myUID,
            userName: '',
            modalVisible: false,
            loadingModalVisible: false,
            trimmedTitle: '',
            platformLogo: TwitchLogo,
            twitchName: 'NA',
            twitchFollowed: false,
            twitchFollowText: "Follow",
            youtubeName: 'NA',
            youtubeID: 'NA',
            youtubeFollowed: false,
            youtubeFollowText: "Follow",
            twitterName: 'NA',
            igName: 'NA',
            twitterRedirectModalVisible: false,
            igRedirectModalVisible: false,

            twitchFollows: [],
            twitchLoading: false,
            twitchColor: "#401058",
            twitchFollowText: "Follow",

            ytFollows: [],
            youtubeColor: "#401058",
            youtubeFollowText: "Follow",

            userCheck: this.props.userCheck,

            displayName: 'This user is not on the platform...',

            onApp: false,
            isFollowed: false,
            isFollowed: false,
            followText: "Follow",
            followColor: "#401058",

            igRe: false,
            twitterRe: false
        }
    };

    async componentDidMount(){

        console.log("UID CHECKS")
        console.log(this.props.myUID)
        console.log(this.props.loggedUID)
        console.log(this.props.location.state.pastState.myUID)

        if(this.props.platform == 'exists'){
            this.startFollowOnApp()
        }
        else{
            const retrunVal = await this.setPlatform()
            console.log(retrunVal)
            this.startFollowChannel()
        }
    }

    startFollowOnApp(){
        const collPath2 = '/usersConnections/' + this.state.uid
        console.log("getting connected user")

        var accTwitchName = ""
        var accYoutubeName = ""
        var accTwitterName = ""
        var accIgName = ""
        var accDisplayName = ""
        firebase.database().ref(collPath2).once('value').then((snapshot) => {
            accTwitchName = snapshot.child("twitchName").val()
            accYoutubeName = snapshot.child("youtubeName").val()
            accTwitterName = snapshot.child("twitterName").val()
            accIgName = snapshot.child("igName").val()
            accDisplayName = snapshot.child("displayName").val()

            this.setState({twitchName: accTwitchName})
            this.setState({youtubeName: accYoutubeName})
            this.setState({twitterName: accTwitterName})
            this.setState({igName: accIgName})
            this.setState({displayName: accDisplayName})
        })
        this.checkFollowsInApp()
        this.checkFollows()
    }

    setPlatform(){
        //console.log("checking other platforms and follows")
        console.log("query tests")
        //console.log(this.props.platform)
        //console.log(this.props.userName)
        const collPath = '/'+ this.props.platform + 'Connections'
        //const userName = 'hdwheezy'
        //const userName = 'UCL5A4nt36nUieS5uFGR8xJQ'
        const userName = this.props.userName
        /*
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            console.log("checking user")
            const exists = snapshot.child(userName).val()
            const doesntExist = snapshot.child('notname').val()
            console.log(exists)
            console.log(doesntExist)
            console.log(exists.uid)
            if(exists){
                console.log(exists.uid)
                this.setState({userCheck: exists.uid})
            }  
        })*/

        console.log("user name")
        console.log(this.props.userName)
        var returnPlat = ""
        if(this.props.platform == "twitch"){
            console.log("platform was twitch")
            this.setState({twitchName: this.props.userName})
            //this.setState({youtubeName: 'was twitch'})
            returnPlat = "twitch - " + this.props.userName

            this.setState({twitchLoading: true})
        }
        else if(this.props.platform == "youtube"){
            this.setState({youtubeName: this.props.channelName})
            //this.setState({twitchName: 'was youtube'})
            returnPlat = "youtube - " + this.props.channelName
        }
        return returnPlat
        
    }

    async startFollowChannel() {

        const collPath = '/'+ this.props.platform + 'Connections/' + this.props.userName 
        console.log("checking for user")
        console.log(this.props.userName)
        console.log(this.props.channelName)
        console.log(collPath)
        var userCheck = this.state.userCheck
        console.log(userCheck)
        /*
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            userCheck = snapshot.child("uid").val()
            console.log("user check")
            console.log(userCheck)
        })*/

        var accConnected = false
        if(userCheck == "NA"){
            console.log("was null")
        }
        else{
            console.log("was NOT null")
            accConnected = true
        }

        if(this.props.platform == "youtube" && !accConnected){
            //console.log(this.props.bio)
            //console.log(this.props.description)
            const results1 = await this.ytScan(this.props.description)
            const results2 = await this.ytScan(this.props.bio)
            //console.log(results1)
            //console.log(results2)

            if(results1[0] !== "twitch"){
                this.setState({ twitchName: results1[0] })
            }
            else if(results2[0] !== "twitch"){
                this.setState({ twitchName: results2[0] })
            }

            if(results1[1] !== "twitter"){
                this.setState({ twitterName: results1[1] })
            }
            else if(results2[1] !== "twitter"){
                this.setState({ twitterName: results2[1] })
            }

            if(results1[2] !== "ig"){
                this.setState({ igName: results1[2] })
            }
            else if(results2[2] !== "ig"){
                this.setState({ igName: results2[2] })
            }
        }

        this.setState({ loadingModalVisible: true});

        if(this.props.platform == "twitch" && !accConnected){
            const twitchBio = await this.getTwitchBio()
            //console.log("twitch bio")
            //console.log(twitchBio)

            this.ytTwitch(twitchBio)
            this.twitterTwitch(twitchBio)
            this.igTwitch(twitchBio)
        }

        var accTwitchName = ""
        var accYoutubeName = ""
        var accTwitterName = ""
        var accIgName = ""
        var accDisplayName = ""
        if(accConnected){

            this.setState({onApp: true})

            const collPath2 = '/usersConnections/' + userCheck
            console.log("getting connected user")

            firebase.database().ref(collPath2).once('value').then((snapshot) => {
                accTwitchName = snapshot.child("twitchName").val()
                accYoutubeName = snapshot.child("youtubeName").val()
                accTwitterName = snapshot.child("twitterName").val()
                accIgName = snapshot.child("igName").val()
                accDisplayName = snapshot.child("displayName").val()

                this.setState({twitchName: accTwitchName})
                this.setState({youtubeName: accYoutubeName})
                this.setState({twitterName: accTwitterName})
                this.setState({igName: accIgName})
                this.setState({displayName: accDisplayName})
            })

            this.checkFollowsInApp()
        }

        this.setState({ twitchLoading: false});
        
        // check if already following accounts
        this.checkFollows()

    }

    async getTwitchBio(){
        //console.log("getting twitch bio")
        //console.log(this.state.twitchName)
        const twitchBio = await fetch("https://api.dataflowkit.com/v1/fetch?api_key=2c08cd7a4822ad457dafc08546c3b18d2a5ff1cca592664cc4ea79b6ad7e3188", {
            body: "{\n    \"url\": \"https://www.twitch.tv/" + this.state.twitchName + "/about\",\n    \"type\": \"chrome\",\n    \"waitDelay\": 1.0\n}",
            headers: {
            "Content-Type": "application/json"
            },
            method: "POST"
        })
        .then(response => response.text())
        return twitchBio
    }

    async ytScan(str){
        var socials = ['twitch', 'twitter', 'ig']

        for(var i=0; i<str.length; i++){
            var tempstr = ''
            var wasCom = false
            if(str.substr(i, 9).toLowerCase() == "twitch.tv" && socials[0] == "twitch"){
                console.log('twitch')
                console.log(str.substr(i+10, 50))
                tempstr = str.substr(i+10, 50)
                tempstr = tempstr.replace(/[\n\r]/g, ' ');
                wasCom = true
            }
            else if(str.substr(i, 11).toLowerCase() == "twitter.com" && socials[1] == "twitter"){
                console.log('twitter')
                console.log(str.substr(i+12, 50))
                tempstr = str.substr(i+12, 50)
                tempstr = tempstr.replace(/[\n\r]/g, ' ');
                wasCom = true
            }
            else if(str.substr(i, 13).toLowerCase() == "instagram.com" && socials[2] == "ig"){
                console.log('instagram')
                console.log(str.substr(i+14, 50))
                tempstr = str.substr(i+14, 50)
                tempstr = tempstr.replace(/[\n\r]/g, ' ');
                wasCom = true
            }

            var end = tempstr.length
            if(wasCom == true){
                for(var j=0; j<tempstr.length; j++){
                    if(tempstr[j] == ' ' || tempstr[j] == '/'){
                        console.log('end found')
                        end = j
                        console.log(end)
                        j = tempstr.length
                    }
                }
            }

            if(str.substr(i, 9).toLowerCase() == "twitch.tv" && socials[0] == "twitch"){
                console.log('twitch 2')
                console.log(tempstr.substr(0, end))
                socials[0] = tempstr.substr(0, end).replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
            }
            else if(str.substr(i, 11).toLowerCase() == "twitter.com" && socials[1] == "twitter"){
                console.log('twitter 2')
                console.log(tempstr.substr(0, end))
                socials[1] = tempstr.substr(0, end).replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
            }
            else if(str.substr(i, 13).toLowerCase() == "instagram.com" && socials[2] == "ig"){
                console.log('instagram 2')
                console.log(tempstr.substr(0, end))
                socials[2] = tempstr.substr(0, end).replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
            }


            // for bios only using twitch twitter etc. not twitch.tv twitter.com
            var notCom = false
            if(str.substr(i, 6).toLowerCase() == "twitch" && socials[0] == "twitch" && !wasCom){
                console.log('twitch 3')
                console.log(str.substr(i+7, 50))
                tempstr = str.substr(i+7, 50)
                tempstr = tempstr.replace(/[\n\r]/g, ' ');
                notCom = true
            }
            else if(str.substr(i, 7).toLowerCase() == "twitter" && socials[1] == "twitter" && !wasCom){
                console.log('twitter 3')
                console.log(str.substr(i+8, 50))
                tempstr = str.substr(i+8, 50)
                tempstr = tempstr.replace(/[\n\r]/g, ' ');
                notCom = true
            }
            else if(str.substr(i, 9).toLowerCase() == "instagram" && socials[2] == "ig" && !wasCom){
                console.log('instagram 3')
                console.log(str.substr(i+10, 50))
                tempstr = str.substr(i+10, 50)
                tempstr = tempstr.replace(/[\n\r]/g, ' ');
                notCom = true
            }

            for(var j=0; j<tempstr.length; j++){
                if(tempstr.substr(j, 4) == ".com" || tempstr.substr(j, 3) == ".tv"){
                    console.log(".com or .tv found")
                    notCom = false
                }
            }

            var count = 0
            var end = tempstr.length
            var start = 0
            if(notCom == true){
                for(var j=0; j<tempstr.length; j++){
                    if(tempstr[j] !== ' '){
                        if(count == 0){
                            start = j
                        }
                        count = count + 1
                    }
                    else{
                        if(count > 4){
                            end = j
                            j = tempstr.length
                        }
                        count = 0
                    }
                }
                console.log(tempstr.substr(start, end - start))
            }
            
            if(str.substr(i, 6).toLowerCase() == "twitch" && socials[0] == "twitch" && !wasCom && notCom){
                console.log('twitch 3')
                socials[0] = tempstr.substr(start, end - start).replace(/[&\/\\#,+()$~%'":*?<>{}@]/g, '')
            }
            else if(str.substr(i, 7).toLowerCase() == "twitter" && socials[1] == "twitter" && !wasCom && notCom){
                console.log('twitter 3')
                socials[1] = tempstr.substr(start, end - start).replace(/[&\/\\#,+()$~%'":*?<>{}@]/g, '')
            }
            else if(str.substr(i, 9).toLowerCase() == "instagram" && socials[2] == "ig" && !wasCom && notCom){
                console.log('instagram 3')
                socials[2] = tempstr.substr(start, end - start).replace(/[&\/\\#,+()$~%'":*?<>{}@]/g, '')
            }

        }

        return socials
    }

    ytTwitch(responseJson){
        //console.log("yt tests")

        /* fetch("https://api.dataflowkit.com/v1/fetch?api_key=2c08cd7a4822ad457dafc08546c3b18d2a5ff1cca592664cc4ea79b6ad7e3188", {
            body: "{\n    \"url\": \"https://www.twitch.tv/" + this.state.twitchName + "/about\",\n    \"type\": \"chrome\",\n    \"waitDelay\": 1.0\n}",
            headers: {
            "Content-Type": "application/json"
            },
            method: "POST"
        })
        .then(response => response.text())
        .then((responseJson)=> { */
        //console.log(responseJson)

        for(var i=0; i<responseJson.length; i++){
            //if(responseJson.substr(i, 15) == "www.youtube.com")
            if(responseJson.substr(i, 15) == "www.youtube.com"){
                console.log("youtube found")
                //console.log(responseJson.substr(i-50, 200))

                var tempstr = responseJson.substr(i, 200).replace(/\s/g,'')

                console.log(tempstr)
                for(var j=0; j<tempstr.length; j++){
                    //console.log(tempstr[j])
                    if(tempstr[j] == "\"" || tempstr[j] == "\'"){
                        //console.log("end found")
                        //console.log(j)
                        //console.log(tempstr.substr(0, j))
                        tempstr = tempstr.substr(0, j)
                        j = 300
                    }
                }
                for(var j=0; j<tempstr.length; j++){
                    //console.log(tempstr[j])
                    if(tempstr[j] == "?"){
                        //console.log("end found")
                        //console.log(j)
                        //console.log(tempstr.substr(0, j))
                        tempstr = tempstr.substr(0, j)
                        j = 300
                    }
                }
                //console.log(tempstr.substr(tempstr.length-24, 24))
                //tempstr = tempstr.substr(tempstr.length-24, 24)
                var first = 0
                var start = 0
                var end = tempstr.length
                var count = 0
                for(var j=0; j<tempstr.length; j++){
                    //console.log(tempstr[j])
                    if(tempstr[j] == "/"){
                        if(count == 0){
                            first = j
                        }
                        else if(count == 1){
                            start = j
                        }
                        else if(count == 2){
                            end = j
                        }
                        count++
                    }
                }
                if(count == 1){
                    //console.log(count)
                    tempstr = tempstr.substr(first+1, end-first-1)
                }
                else if(count > 1){
                    //console.log(count)
                    tempstr = tempstr.substr(start+1, end-start-1)
                }
                //console.log(tempstr)
                i = responseJson.length
                console.log("youtube name")
                console.log(tempstr)
                this.setState({youtubeName: tempstr})
            }
        }

        /* })
        .catch(error=>console.log(error)) */ //to catch the errors if any

        var ytidURL = 'https://www.googleapis.com/youtube/v3/channels?part=snippet&id=' + this.state.youtubeName + '&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY'

        const collPath = '/mainCollection/' + this.state.uid + '/ytInfo'

        console.log(ytidURL)
        console.log(collPath)

        firebase.database().ref(collPath).once('value').then((snapshot) => {
            const ytAuthToken = snapshot.child('youtubeAuthToken').val()

            //console.log(ytAuthToken)
            var ytAuthFormat = 'Bearer ' + ytAuthToken

            fetch(ytidURL, {
                headers: {
                    'Authorization': ytAuthFormat,
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then((responseJson)=> {
                console.log("getting yt account")
                console.log(responseJson)
                //console.log(responseJson.items[0].snippet)
                //console.log(responseJson.items[0].snippet.title)
                if(responseJson.pageInfo.totalResults !== 0){
                    //console.log("was not 0")
                    this.setState({youtubeID: this.state.youtubeName})
                    this.setState({youtubeName: responseJson.items[0].snippet.title})
                }
                else{
                    //console.log("was 0")
                }
            })
        })    

    }

    twitterTwitch(responseJson){
        //console.log("twitter tests")
        /* fetch("https://api.dataflowkit.com/v1/fetch?api_key=2c08cd7a4822ad457dafc08546c3b18d2a5ff1cca592664cc4ea79b6ad7e3188", {
            body: "{\n    \"url\": \"https://www.twitch.tv/" + this.state.twitchName + "/about\",\n    \"type\": \"chrome\",\n    \"waitDelay\": 1.0\n}",
            headers: {
            "Content-Type": "application/json"
            },
            method: "POST"
        })
        .then(response => response.text())
        .then((responseJson)=> { */
        //console.log(responseJson)

        for(var i=0; i<responseJson.length; i++){
            if(responseJson.substr(i, 11) == "twitter.com"){
                    //console.log("twitter found")
                    //console.log(responseJson.substr(i-50, 200))

                    var tempstr = responseJson.substr(i, 200).replace(/\s/g,'')

                    //console.log(tempstr)
                    for(var j=0; j<tempstr.length; j++){
                        //console.log(tempstr[j])
                        if(tempstr[j] == "\"" || tempstr[j] == "\'"){
                            //console.log("end found")
                            //console.log(j)
                            //console.log(tempstr.substr(0, j))
                            tempstr = tempstr.substr(0, j)
                            j = 300
                        }
                    }
                    for(var j=0; j<tempstr.length; j++){
                        //console.log(tempstr[j])
                        if(tempstr[j] == "?"){
                            //console.log("end found")
                            //console.log(j)
                            //console.log(tempstr.substr(0, j))
                            tempstr = tempstr.substr(0, j)
                            j = 300
                        }
                    }
                    //console.log(tempstr.substr(tempstr.length-24, 24))
                    //tempstr = tempstr.substr(tempstr.length-24, 24)
                    var first = 0
                    var start = 0
                    var end = tempstr.length
                    var count = 0
                    for(var j=0; j<tempstr.length; j++){
                        //console.log(tempstr[j])
                        if(tempstr[j] == "/"){
                            if(count == 0){
                                first = j
                            }
                            else if(count == 1){
                                start = j
                            }
                            else if(count == 2){
                                end = j
                            }
                            count++
                        }
                    }
                   
                    if(count == 1){
                        //console.log(count)
                        tempstr = tempstr.substr(first+1, end-first-1)
                    }
                    else{
                        //console.log(count)
                        tempstr = tempstr.substr(first+1, start-first-1)
                    } 
                    tempstr = tempstr.replace(/[^a-zA-Z0-9]/g, '')
                    /*
                    else if(count > 2){
                        console.log(count)
                        tempstr = tempstr.substr(start+1, end-start-1)
                    }
                    */
                    //console.log(tempstr)
                    //i = responseJson.length
                    this.setState({twitterName: tempstr})
                }
        }

        /* })
        .catch(error=>console.log(error)) */ //to catch the errors if any
    }

    igTwitch(responseJson){
        //console.log("instagram tests")
        /* fetch("https://api.dataflowkit.com/v1/fetch?api_key=2c08cd7a4822ad457dafc08546c3b18d2a5ff1cca592664cc4ea79b6ad7e3188", {
            body: "{\n    \"url\": \"https://www.twitch.tv/" + this.state.twitchName + "/about\",\n    \"type\": \"chrome\",\n    \"waitDelay\": 1.0\n}",
            headers: {
            "Content-Type": "application/json"
            },
            method: "POST"
        })
        .then(response => response.text())
        .then((responseJson)=> {
        console.log(responseJson) */

        for(var i=0; i<responseJson.length; i++){
            if(responseJson.substr(i, 9) == "instagram"){
                    //console.log("instagram found")
                    //console.log(responseJson.substr(i-50, 2000))

                    var tempstr = responseJson.substr(i, 200).replace(/\s/g,'')

                    console.log(tempstr)
                    for(var j=0; j<tempstr.length; j++){
                        //console.log(tempstr[j])
                        if(tempstr[j] == "\"" || tempstr[j] == "\'"){
                            //console.log("end found")
                            //console.log(j)
                            //console.log(tempstr.substr(0, j))
                            tempstr = tempstr.substr(0, j)
                            j = 300
                        }
                    }
                    for(var j=0; j<tempstr.length; j++){
                        //console.log(tempstr[j])
                        if(tempstr[j] == "?"){
                            //console.log("end found")
                            //console.log(j)
                            //console.log(tempstr.substr(0, j))
                            tempstr = tempstr.substr(0, j)
                            j = 300
                        }
                    }
                    //console.log(tempstr.substr(tempstr.length-24, 24))
                    //tempstr = tempstr.substr(tempstr.length-24, 24)
                    var first = 0
                    var start = 0
                    var end = tempstr.length
                    var count = 0
                    for(var j=0; j<tempstr.length; j++){
                        //console.log(tempstr[j])
                        if(tempstr[j] == "/"){
                            if(count == 0){
                                first = j
                            }
                            else if(count == 1){
                                start = j
                            }
                            else if(count == 2){
                                end = j
                            }
                            count++
                        }
                    }
                    if(count == 1){
                        //console.log(count)
                        tempstr = tempstr.substr(first+1, end-first-1)
                    }
                    else if(count == 2){
                        //console.log(count)
                        tempstr = tempstr.substr(first+1, start-first-1)
                    }
                    else if(count > 2){
                        //console.log(count)
                        tempstr = tempstr.substr(first+1, start-first-1)
                    }
                    //console.log(tempstr)
                    if(tempstr == tempstr.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')){
                        i = responseJson.length
                    }
                    
                    this.setState({igName: tempstr})
                }
        }

        /* })
        .catch(error=>console.log(error)) */ //to catch the errors if any
    }

    checkFollowsInApp(){

        console.log("getting follows")
        const collPath = '/mainCollection/'+ this.props.loggedUID
        var follows = []
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            follows = snapshot.child('inAppFollows').val()
            this.setState({inAppFollows: follows})
            console.log(follows)
            console.log(follows.length)
            //this.leaveLoading()
            for(var i=0; i<follows.length; i++){
                if(follows[i] == this.state.uid){
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

    checkFollows(){
        const collPath = '/usersFollows/' + this.props.loggedUID
        console.log("checking follows")
        console.log(collPath)

        //var twitchFollows = ''
        //var ytFollows = []
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            const twitchFollows = snapshot.child("twitch").val()
            const ytFollows = snapshot.child("youtube").val()
            //console.log(twitchFollows)
            //console.log(ytFollows)

            this.setState({twitchFollows: twitchFollows})
            this.setState({ytFollows: ytFollows})

            for(var i=0; i<twitchFollows.length; i++){
                if(twitchFollows[i][0] == this.state.twitchName.toLowerCase() || twitchFollows[i][1] == this.state.twitchName.toLowerCase()){
                    console.log("ALREADY FOLLOWED twitch")
                    this.setState({twitchFollowed: true})
                    this.setState({twitchFollowText: "Unfollow"})
                    this.setState({twitchColor: "#FD0101"})
                    //this.setState({twitchFollows: twitchFollows})
                }
            }
            for(var i=0; i<ytFollows.length; i++){
                if(ytFollows[i][0] == this.state.youtubeID || ytFollows[i][0] == this.state.youtubeName || ytFollows[i][1].toLowerCase() == this.state.youtubeName.toLowerCase()){
                    console.log("ALREADY FOLLOWED youtube")
                    this.setState({youtubeFollowed: true})
                    this.setState({youtubeFollowText: "Unfollow"})
                    this.setState({youtubeColor: "#FD0101"})
                    //this.setState({ytFollows: ytFollows})
                }
            }
        })
        //console.log(twitchFollows)
        //console.log(ytFollows)
    }

    closeTwitchLoading(){
        this.setState({twitchLoading: !this.state.twitchLoading})
    }

    followUser(){

        if(this.state.onApp && !this.state.isFollowed){
            var followsList = []
            //var followsList = this.state.inAppFollows
            followsList.push(this.props.location.state.usersUid)
            //followsList.push("testUID")
    
            const collPath = '/mainCollection/' + this.state.uid
            firebase.database().ref(collPath).update({
                inAppFollows: followsList
            })
    
            this.setState({isFollowed: true})
            this.setState({followText: "Unfollow"})
            this.setState({followColor: "#FD0101"})
        }
        else{
            console.log("not on app or already followed")
        }
        
    }

    followTwitch(){
        console.log("follow twitch")

        const collPath = '/mainCollection/' + this.state.uid + "/twitchInfo"
        var myName = ""
        var authToken = ""
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            myName = snapshot.child("userName").val()
            authToken = snapshot.child("twitchAuthToken").val()
        
            var getMyURL = 'https://api.twitch.tv/helix/users?login=' + this.state.twitchName + '&login=' + myName

            console.log(getMyURL)

            var authFormat = 'Bearer ' + authToken

            fetch(getMyURL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Client-ID': '2fnwtwy41t2avoiqdc1py6oybitz4r',
                    'Authorization': authFormat
                }
            })
            .then(response => response.json())
            .then((responseJson)=> {
                console.log('getting ids')
                console.log(responseJson)
                console.log(responseJson.data)
                console.log(responseJson.data[0])
                console.log(responseJson.data[1])

                var followID = responseJson.data[0].id
                //following

                var twitchURL = 'https://api.twitch.tv/helix/users/follows?from_id=' + responseJson.data[1].id + '&to_id=' + responseJson.data[0].id
                //var authFormat = 'OAuth ' + authToken

                fetch(twitchURL, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/vnd.twitchtv.v5+json',
                        'Client-ID': '2fnwtwy41t2avoiqdc1py6oybitz4r',
                        'Authorization': authFormat
                    }
                })
                .then(response => response.text())
                .then((responseJson)=> {
                    console.log('getting subscriptions')
                    console.log(responseJson)

                })
                .catch(error=>console.log(error)) //to catch the errors if any

                if(!this.state.twitchFollowed){
                    //var followsList = []
                    var followsList = this.state.twitchFollows
                    followsList.push([this.state.twitchName, followID])
                    //followsList.push("testUID")
            
                    const collPath2 = '/usersFollows/' + this.state.uid
                    firebase.database().ref(collPath2).update({
                        twitch: followsList
                    })
    
                }

                this.setState({twitchFollowed: true})
                this.setState({twitchFollowText: "Unfollow"})
                this.setState({twitchColor: "#FD0101"})

            })
            .catch(error=>console.log(error)) //to catch the errors if any

        })

    }

    followYoutube(){
        console.log("follow youtube")

        console.log(this.state.youtubeID)
        console.log(this.state.youtubeName)

        const collPath = '/mainCollection/' + this.state.uid + "/ytInfo"
        var myID = ""
        var authToken = ""
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            myID = snapshot.child("youtubeID").val()
            authToken = snapshot.child("youtubeAuthToken").val()

            var followBody = ""
            if(this.state.youtubeID == "NA"){
                followBody = this.state.youtubeName
            }
            else{
                followBody = this.state.youtubeID
            }

            fetch("https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet,id&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY", {
                body: "{\"snippet\":{\"resourceId\":{\"channelId\":\"" + followBody + "\",\"kind\":\"youtube#channel\"}}}",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + authToken,
                    "Content-Type": "application/json"
                },
                method: "POST"
            })
            .then(response => response.json())
            .then((responseJson)=> {
                console.log('getting subscriptions')
                console.log(responseJson)

            })
            .catch(error=>console.log(error))

            if(!this.state.youtubeFollowed){
                //var followsList = []
                var followsList = this.state.ytFollows
                followsList.push([this.state.youtubeID, this.state.youtubeName])
                //followsList.push("testUID")
        
                const collPath2 = '/usersFollows/' + this.state.uid
                firebase.database().ref(collPath2).update({
                    youtube: followsList
                })

            }

            this.setState({youtubeFollowed: true})
            this.setState({youtubeColor: "#FD0101"})
            this.setState({youtubeFollowText: "Unfollow"})

        })
        
    }

    testButton(){
        console.log("TEST TEST TEST")
    }

    redirectIg(){
        this.setState({igRe: !this.state.igRe})
        window.open('https://www.instagram.com/' + this.state.igName, "_blank")
    }

    redirectIgOpen(){
        this.setState({igRe: !this.state.igRe})
    }

    redirectTwitter(){
        this.setState({twitterRe: !this.state.twitterRe})
        window.open('https://twitter.com/' + this.state.twitterName, "_blank")
    }

    redirectTwitterOpen(){
        this.setState({twitterRe: !this.state.twitterRe})
    }

    render(){
        return(

                <div style={rootStyle} className="follow-modal" id="FollowModal">

                    <Container style={twitchComponent}>

                        <Row style={{display: 'flex', flexDirection: 'row', flex: 1, justifyContent: "center", alignSelf: "center"}}>
                            <Modal
                                open={this.state.igRe}
                                onClose={this.redirectIgOpen.bind(this)}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                            <div style={rootStyle} className="redirect-modal" id="RedirectModal">  
                            <Container style={redirectStyle}>          
                                <Row style={{display: 'flex', flex: 1, justifyContent: "center", alignSelf: "center", height: '100%'}}> 
                                <h2 style={{justifyContent: "center", marginTop: 30}}>Must redirect to instagram to perform action...</h2>
                                <Button onClick={this.redirectIg.bind(this)} style={button2}>Redirect</Button>
                                </Row> 
                            </Container>   
                            </div> 
                            </Modal>
                        </Row>

                        <Row style={{display: 'flex', flexDirection: 'row', flex: 1, justifyContent: "center", alignSelf: "center"}}>
                            <Modal
                                open={this.state.twitterRe}
                                onClose={this.redirectTwitterOpen.bind(this)}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >         
                            <div style={rootStyle} className="redirect-modal" id="RedirectModal">  
                            <Container style={redirectStyle}>          
                                <Row style={{display: 'flex', flex: 1, justifyContent: "center", alignSelf: "center", height: '100%'}}> 
                                <h2 style={{justifyContent: "center", marginTop: 30}}>Must redirect to twitter to perform action...</h2>
                                <Button onClick={this.redirectTwitter.bind(this)} style={button2}>Redirect</Button>
                                </Row> 
                            </Container>  
                            </div>  
                            </Modal>
                        </Row>

                        <Row style={{display: 'flex', flex: 1, justifyContent: "center", alignSelf: "center"}}>
                            <Modal
                                open={this.state.twitchLoading}
                                onClose={this.closeTwitchLoading.bind(this)}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >                         
                                <Row style={{display: 'flex', flex: 1, justifyContent: "center", alignSelf: "center", height: '100%'}}> 
                                <h1 style={{justifyContent: "center", marginTop: 330}}>Loading...</h1>
                                </Row>   
                            </Modal>
                        </Row>

                        <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <h2>{this.state.displayName}</h2> 
                        </Row>
                        <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Button onClick={this.followUser.bind(this)} style={{ 
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
                        </Row>
                        <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Avatar style={{width: 30, height: 30}} src={TwitchLogo} />
                            <h3 style={{marginLeft: 5}}>{this.state.twitchName}</h3> 
                            <Button onClick={this.followTwitch.bind(this)} style={{ 
                                shadowOpacity: 0.3,
                                shadowRadius: 3,
                                shadowOffset: {
                                height: 0,
                                width: 0
                                },
                                elevation: 1,
                                marginTop: '5%',
                                backgroundColor: this.state.twitchColor,
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
                            }}>{this.state.twitchFollowText}</Button>
                        </Row>
                        <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Avatar style={{width: 30, height: 30}} src={YTLogo} />
                            <h3 style={{marginLeft: 5}}>{this.state.youtubeName}</h3>
                            <Button onClick={this.followYoutube.bind(this)} style={{ 
                                shadowOpacity: 0.3,
                                shadowRadius: 3,
                                shadowOffset: {
                                height: 0,
                                width: 0
                                },
                                elevation: 1,
                                marginTop: '5%',
                                backgroundColor: this.state.youtubeColor,
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
                            }}>{this.state.youtubeFollowText}</Button>
                        </Row>
                        <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Avatar style={{width: 30, height: 30}} src={IgLogo} />
                            <h3 style={{marginLeft: 5}}>{this.state.igName}</h3>
                            <Button onClick={this.redirectIgOpen.bind(this)} style={button2}>Follow</Button>
                        </Row>
                        <Row style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Avatar style={{width: 30, height: 30}} src={TwitterLogo} />
                            <h3 style={{marginLeft: 5}}>{this.state.twitterName}</h3>
                            <Button onClick={this.redirectTwitterOpen.bind(this)} style={button2}>Follow</Button>
                        </Row>
                    </Container>
                
                </div>

        );
    }
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

const redirectStyle = {
    backgroundColor: "#ACACAC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    fluid: true,
    flex: 1,
    display: 'flex',
    flexDirection: "column",
    //marginLeft: 95,
    //marginRight: 50,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
    alightSelf: "center",
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
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 35
}

const button = {
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    elevation: 1,
    //marginTop: '5%',
    backgroundColor: "#401058",
    borderRadius: 5,
    borderColor: "#393939",
    borderWidth: 1,
    width: 70,
    height: 30,
    color: "white",
    justifyContent: "left"
}

export default FollowOverlay;