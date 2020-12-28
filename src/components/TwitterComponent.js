import React from 'react';

import firebase from "firebase";
import 'firebase/database';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form'

import RepeatIcon from '@material-ui/icons/Repeat';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import FavoriteIcon from '@material-ui/icons/Favorite';

import TwitterLogo from '../pictureIcons/twitter-image.png'

import DefaultPFP from '../pictureIcons/defaultpfp.jpg'

import { TwitterTimelineEmbed, TwitterShareButton, TwitterTweetEmbed } from 'react-twitter-embed';

import { List, Button } from 'semantic-ui-react'
import Avatar from '@material-ui/core/Avatar';

import Modal from '@material-ui/core/Modal';
import FollowOverlay from "../components/FollowOverlay";

class TwitterComponent extends React.Component {

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

            twitterRe: false,

            followClicked: false,

            userCheck: ''
        }
    }

    componentDidMount(){
        this.checkingUser()
    }

    checkingUser(){
        console.log("checking if user is on platform")
        const collPath = '/twitterConnections'
        const userName = this.props.twitterName
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

    clickFollow(){
        this.setState({followClicked: !this.state.followClicked})
    }

    redirectTwitter(){
        this.setState({twitterRe: !this.state.twitterRe}) 
        window.open('https://twitter.com/' + this.props.twitterName + '/status/' + this.props.postNum, "_blank")
    }

    redirectTwitterOpen(){
        this.setState({twitterRe: !this.state.twitterRe})
    }

    render(){
        return(

            <Container style={tweetComponent}>

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
                                <h2 style={{ color: '#e8e6e3' }} style={{justifyContent: "center", marginTop: 30}}>Must redirect to twitter to perform action...</h2>
                                <Button onClick={this.redirectTwitter.bind(this)} style={button2}>Redirect</Button>
                                </Row> 
                            </Container>
                            </div>  
                            </Modal>
                        </Row>

                <Row style={{display: 'flex', justifyContent: 'center', height: 75}}>
                    <Col style={{display: 'flex', flex: 1}}>
                        <Avatar style={{width: 50, height: 50, marginLeft: 10}} src={DefaultPFP} />
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
                                    
                                    <FollowOverlay platform="twitter" userName={this.props.twitterName}  myUID={this.state.uid} userCheck={this.state.userCheck}/>
                                    
                            </Modal>
                        </Row>
                        <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start",  alignSelf: "start"}}>
                            <h2 style={{ color: '#e8e6e3' }} className="display-1 font-weight-bolder">{this.props.twitterName}</h2> 
                        </Row>
                    </Col>
                    <Col style={{display: 'flex', flex: 1, justifyContent: 'flex-end', marginRight: 10}}>
                        <Avatar style={{width: 50, height: 50}} src={TwitterLogo} />
                    </Col>
                </Row>
                <Row style={{marginLeft: 125}}>
                        <TwitterTweetEmbed
                            tweetId={this.props.postNum}
                            options={{height: 800, width: '100vh'}}
                        />
                </Row>
                <Row style={{display: 'flex', justifyContent: 'flex-start'}}>
                    <IconButton onClick={this.redirectTwitterOpen.bind(this)}aria-label="like" color="primary">
                        <FavoriteIcon style={{color: 'black', maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}} />
                    </IconButton>
                    <IconButton onClick={this.redirectTwitterOpen.bind(this)} aria-label="like" color="primary">
                        <RepeatIcon style={{color: 'black', maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}} />
                    </IconButton>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control style={{marginTop: 10, maxWidth: '535px', maxHeight: '40px', minWidth: '535px', minHeight: '40px'}} type="comment" placeholder="Comment..." onChange={e => this.setState({ twitterComment: e.target.value })} />
                    </Form.Group>
                    <IconButton onClick={this.redirectTwitterOpen.bind(this)} aria-label="like" color="primary">
                        <SendIcon style={{color: 'black', maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}} />
                    </IconButton>
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

const tweetComponent = {
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

export default TwitterComponent;