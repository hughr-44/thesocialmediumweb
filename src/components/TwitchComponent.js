import React from 'react';

import firebase from "firebase";
import 'firebase/database';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import { TwitchEmbed, TwitchChat, TwitchClip, TwitchPlayer } from 'react-twitch-embed';

import DefaultPFP from '../pictureIcons/defaultpfp.jpg'

import TwitchLogo from '../pictureIcons/twitch-image.png'
import IgLogo from '../pictureIcons/ig-image.png'
import TwitterLogo from '../pictureIcons/twitter-image.png'
import YTLogo from '../pictureIcons/youtube-image.png'
import AllLogo from '../pictureIcons/allpic.jpg'

import { List, Button } from 'semantic-ui-react'
import Avatar from '@material-ui/core/Avatar';

import Modal from '@material-ui/core/Modal';
import FollowOverlay from "../components/FollowOverlay";

class TwitchComponent extends React.Component {

    constructor(props){
        super(props);

        const authToken = this.props.twitchAuth

        const uName = this.props.userName
        const mName = this.props.myName

        var thumbUrl = ""

        var startRow = <Image onClick={this.watchChannel.bind(this)} src={thumbUrl} rounded />

        if(this.props.streamTitle == "Offline"){
            console.log("was offline")
            thumbUrl = 'https://ps.w.org/stream-status-for-twitch/assets/screenshot-2.jpg?rev=1565951'

            startRow = <Image src={thumbUrl} rounded />
        }
        else{
            thumbUrl = this.props.thumbnail.substr(0, this.props.thumbnail.length - 20) + '800x480.jpg'

            startRow = <Image onClick={this.watchChannel.bind(this)} src={thumbUrl} rounded />
        }

        this.state = {
            uid: this.props.myUID,
            userName: uName,
            myName: mName,
            twitchAuth: authToken,
            modalVisible: false,
            trimmedTitle: '',
            twitchRow: startRow,
            followClicked: false,

            userCheck: ''
        }
    };

    componentDidMount(){
        this.trimNames()
        this.checkingUser()
    }

    checkingUser(){
        console.log("checking if user is on platform")
        const collPath = '/twitchConnections'
        const userName = this.props.userName
        firebase.database().ref(collPath).once('value').then((snapshot) => {
            console.log("checking user")
            const exists = snapshot.child(userName).val()
            if(exists){
                console.log(exists.uid)
                this.setState({userCheck: exists.uid})
            } 
            else{
                this.setState({userCheck: 'NA'})
            }
        })
    }

    trimNames(){
        console.log("trimming titles")
        console.log(this.state.userName)
        console.log(this.props.userName)
        console.log(this.props.streamTitle)
        console.log(this.props.profilePic)

        var forTitle = 35 - 3 - this.props.userName.length

        var title = ''
        if(this.props.userName.length + this.props.streamTitle.length <= 35){
            title = this.props.userName + ' - ' + this.props.streamTitle
        }
        else{
            title = this.props.userName + ' - ' + this.props.streamTitle.substr(0,forTitle) + '...'
        }
        
        this.setState({trimmedTitle: title})
    }

    watchChannel() {
        const newRow = <TwitchEmbed
            channel={this.state.userName}
            id={this.state.userName}
            theme="dark"
            width={800}
            muted
            allowFullscreen={true}
            onVideoPause={() => console.log(':(')}
        />      

        this.setState({twitchRow: newRow})
    }

    clickFollow(){
        this.setState({followClicked: !this.state.followClicked})
    }

    render(){
        return(

                <Container style={twitchComponent}>
                    <Row style={{display: 'flex', justifyContent: 'center', height: 85}}>
                        <Col style={{display: 'flex', flex: 1}}>
                            <Avatar style={{width: 50, height: 50, marginLeft: 10}} src={this.props.profilePic} />
                        </Col>
                        <Col style={{display: 'flex', flex: 5, flexDirection: "column", justifyContent: "flex-start", alignSelf: "start"}}>
                            <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start", alignSelf: "start"}}>
                                <Button onClick={this.clickFollow.bind(this)} style={button}>Follow</Button>
                                <Modal
                                    open={this.state.followClicked}
                                    onClose={this.clickFollow.bind(this)}
                                    aria-labelledby="simple-modal-title"
                                    aria-describedby="simple-modal-description"
                                >
                                    
                                    <FollowOverlay platform="twitch" userName={this.state.userName}  myUID={this.state.uid} userCheck={this.state.userCheck}/>
                                    
                                </Modal>
                            </Row>
                            <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start",  alignSelf: "start"}}>
                                <h2 className="display-1 font-weight-bolder">{this.state.trimmedTitle}</h2> 
                            </Row>
                        </Col>
                        <Col style={{display: 'flex', flex: 1, justifyContent: 'flex-end', marginRight: 10}}>
                            <Avatar style={{width: 50, height: 50}} src={TwitchLogo} />
                        </Col>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        {this.state.twitchRow}
                    </Row>
                </Container>

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

export default TwitchComponent;