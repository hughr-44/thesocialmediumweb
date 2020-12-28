import React from 'react';

import firebase from "firebase";
import 'firebase/database';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form'

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import FavoriteIcon from '@material-ui/icons/Favorite';

import YTLogo from '../pictureIcons/youtube-image.png'

import DefaultPFP from '../pictureIcons/defaultpfp.jpg'

import YouTube from 'react-youtube-embed'

import { List, Button } from 'semantic-ui-react'
import Avatar from '@material-ui/core/Avatar';

import Modal from '@material-ui/core/Modal';
import FollowOverlay from "../components/FollowOverlay";

class YoutubeComponent extends React.Component {

    constructor(props){
        super(props);
        //console.log("constructor")

        this.state = {
            //thumbnailUrl: thumbURL,
            //ytRow: newRow,
            uid: this.props.myUID,
            trimmedTitle: '',
            liked: false,
            commentValue: '',
            hasStopped: false,
            liked: false,
            likeColor: "black",

            followClicked: false,
            userCheck: ''
        }
    }

    componentDidMount(){
        this.trimNames()
        this.checkingUser()
    }

    checkingUser(){
        console.log("checking if user is on platform")
        const collPath = '/youtubeConnections'
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
        var forTitle = 35 - 3 - this.props.channelName.length

        var title = ''
        if(this.props.channelName.length + this.props.vidTitle.length <= 35){
            title = this.props.channelName + ' - ' + this.props.vidTitle
        }
        else{
            title = this.props.channelName + ' - ' + this.props.vidTitle.substr(0,forTitle) + '...'
        }
        
        this.setState({trimmedTitle: title})
    }

    sendComment(){
        console.log("sending comment")

        const commentText = this.state.commentValue + "\n\n" + "via The Social Medium"

        fetch("https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,id&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY", {
                body: "{\"snippet\":{\"channelId\":\"" + this.props.userName + "\",\"videoId\":\"" + this.props.videoId + "\",\"topLevelComment\":{\"snippet\":{\"textOriginal\":\"" + commentText + "\"}}}}",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + this.props.authToken,
                    "Content-Type": "application/json"
                },
                method: "POST"
            })
            .then(response => response.json())
            .then((responseJson)=> {
                console.log('sending comment')
                console.log(responseJson)

            })
            .catch(error=>console.log(error))

        this.setState({commentValue: ""})
    }

    clickLike(){
        console.log("like clicked")
        console.log(this.props.authToken)

        fetch("https://youtube.googleapis.com/youtube/v3/videos/rate?id=" + this.props.videoId + "&rating=like&key=AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY", {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.authToken,
                "Content-Type": "application/json"
            },
            method: "POST"
        })
        .then(response => response.text())
        .then((responseJson)=> {
            console.log('liking the video')
            console.log(responseJson)

        })
        .catch(error=>console.log(error))

        this.setState({likeColor: "#401058"})
    }

    clickFollow(){
        this.setState({followClicked: !this.state.followClicked})
    }

    render(){
        return(

            <Container style={youtubeComponent}>
            <Row style={{display: 'flex', justifyContent: 'center'}}>
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
                                    
                            <FollowOverlay platform="youtube" userName={this.props.userName} channelName={this.props.channelName}  myUID={this.state.uid}  bio={this.props.bio} description={this.props.description} userCheck={this.state.userCheck}/>
                                    
                        </Modal>
                    </Row>
                    <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start",  alignSelf: "start", height: 0}}>
                        <h2 className="display-1 font-weight-bolder">{this.state.trimmedTitle}</h2>
                    </Row>
                    <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start",  alignSelf: "start", height: 0, marginTop: 0}}>
                        <h4 className="display-1 font-weight-bolder">{this.props.date.substr(0,10)}</h4> 
                    </Row>
                </Col>
                <Col style={{display: 'flex', flex: 1, justifyContent: 'flex-end', marginRight: 10}}>
                    <Avatar style={{width: 50, height: 50}} src={YTLogo} />
                </Col>
            </Row>
            <Row style={{display: 'flex', justifyContent: 'center'}}>
                <YouTube id={this.props.videoId} />
            </Row>
            <Row style={{display: 'flex', justifyContent: 'center'}}>
                <IconButton onClick={this.clickLike.bind(this)}aria-label="like" color="primary">
                    <ThumbUpAltIcon style={{color: this.state.likeColor, maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}} />
                </IconButton>
                <Form.Group controlId="formBasicPassword">
                    <Form.Control style={{marginTop: 10, maxWidth: '535px', maxHeight: '40px', minWidth: '535px', minHeight: '40px'}} type="comment" placeholder="Comment..." onChange={e => this.setState({ commentValue: e.target.value })} />
                </Form.Group>
                <IconButton onClick={this.sendComment.bind(this)} aria-label="like" color="primary">
                    <SendIcon style={{color: 'black', maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}} />
                </IconButton>
            </Row>
        </Container>

        );
    }
}

const youtubeComponent = {
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

export default YoutubeComponent;