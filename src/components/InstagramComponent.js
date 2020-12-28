import React from 'react';

import firebase from "firebase";
import 'firebase/database';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form'

import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

import IgLogo from '../pictureIcons/ig-image.png'

import DefaultPFP from '../pictureIcons/defaultpfp.jpg'

import { InstagramMedia, instagramMediaParser } from 'react-instagram-media'
import InstagramEmbed from 'react-instagram-embed';
//import InstagramEmbed from 'react-social-embed'

import { List, Button } from 'semantic-ui-react'
import Avatar from '@material-ui/core/Avatar';

import Modal from '@material-ui/core/Modal';
import FollowOverlay from "../components/FollowOverlay";

import ReactPlayer from 'react-player'

class InstagramComponent extends React.Component {

    constructor(props){
        super(props);
        //console.log("constructor")


        const igHtml = '<iframe src="http://instagram.com/p/' + this.props.postID + '/embed" width="500" height="600" frameborder="0" scrolling="no" allowtransparency="true"></iframe>'

        const starter = <span style={{justifyContent: 'center'}} dangerouslySetInnerHTML={{__html: igHtml}} />

        this.state = {
            //thumbnailUrl: thumbURL,
            //ytRow: newRow,
            uid:  this.props.myUID,
            trimmedTitle: '',
            liked: false,
            commentValue: '',
            hasStopped: false,

            followClicked: false,

            igRe: false,

            userCheck: '',

            startRow: starter,

            row: null
        }
    }

    componentDidMount(){
        this.checkingUser()
        this.checkType()
    }

    checkType(){
        const mediaUrl = this.props.mediaUrl

        var wasVideo = false
        for(var i=0; i<mediaUrl.length; i++){
            if(mediaUrl.substr(i, 4) == '.mp4'){
                wasVideo = true
            }
        }

        var mediaRow;
        if(wasVideo){
            mediaRow = <ReactPlayer controls={true} url={this.props.mediaUrl} />
        }
        else{
            mediaRow = <Image src={this.props.mediaUrl} />
        }

        this.setState({row: mediaRow})
    }

    checkingUser(){
        console.log("checking if user is on platform")
        const collPath = '/igConnections'
        const userName = this.props.igID
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

    redirectIg(){
        this.setState({igRe: !this.state.igRe})
        window.open('https://www.instagram.com/p/' + this.props.postID + '/', "_blank")
    }

    redirectIgOpen(){
        this.setState({igRe: !this.state.igRe})
    }

    render(){
        //width="600" height="600"
        //const igHtml = '<div style="width: 1000px; height: 1000px; overflow: hidden; justifyContent: center; marginLeft: 500"><iframe width="600" height="600" style="border:none" scrolling="no" src="https://instagram.com/p/' + this.props.postID + '/embed" frameborder="0"></iframe></div>'
        //const igHtml = '<iframe src="http://instagram.com/p/' + this.props.postID + '/embed" width="500" height="580" frameborder="0" scrolling="no" allowtransparency="true"></iframe>'
        return(

            <Container style={igComponent}>

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
                                <h2 style={{ color: '#e8e6e3' }} style={{justifyContent: "center", marginTop: 30}}>Must redirect to instagram to perform action...</h2>
                                <Button onClick={this.redirectIg.bind(this)} style={button2}>Redirect</Button>
                                </Row> 
                            </Container>  
                            </div>  
                            </Modal>
                        </Row>

                    <Row style={{display: 'flex', justifyContent: 'center', height: 85}}>
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
                                    
                                    <FollowOverlay platform="ig" userName={this.state.userName}  myUID={this.state.uid} userCheck={this.state.userCheck}/>
                                    
                                </Modal>
                            </Row>
                            <Row style={{display: 'flex', flex: 1, justifyContent: "flex-start",  alignSelf: "start"}}>
                                <h2 className="display-1 font-weight-bolder">{this.props.name}</h2> 
                            </Row>
                        </Col>
                        <Col style={{display: 'flex', flex: 1, justifyContent: 'flex-end', marginRight: 10}}>
                            <Avatar style={{width: 50, height: 50}} src={IgLogo} />
                        </Col>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>

                        {this.state.row}

                        {/*<Image src={'https://scontent-dfw5-1.cdninstagram.com/v/t51.2885-15/e35/78787841_2493860204212163_1691682267844488816_n.jpg?_nc_ht=scontent-dfw5-1.cdninstagram.com&_nc_cat=111&_nc_ohc=hwH54Avq8dYAX-NHytn&tp=1&oh=a7371825187f81ab62a622e31cbb51db&oe=6003EA53'} />*/}
                        
                        {/*<ReactPlayer controls={true} url={this.props.mediaUrl} />*/}

                        {/*<InstagramMedia
                            uri={"https://www.instagram.com/p/" + this.props.postID + "/"}      
                            renderItem={
                                ({ display_url, video_url, type, caption }) => {
                                if (type === 'video') {
                                    return (
                                    <video poster={display_url} controls>
                                        <source src={video_url} type="video/mp4" />
                                    </video>
                                    )
                                }
                                return (
                                    <img
                                    src={display_url}
                                    alt={caption}
                                    />
                                )
                                }
                            }
                            renderMediaList={children => (
                                <div className="swiper">
                                {children}
                                </div>
                            )}
                            renderError={() => (
                                <div>Refresh page to view post...</div>
                            )}
                            renderLoading={() => (
                                <div>Loading</div>
                            )}
                            />*/}
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <IconButton onClick={this.redirectIgOpen.bind(this)}aria-label="like" color="primary">
                            <ThumbUpAltIcon style={{color: 'white', maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}} />
                        </IconButton>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control style={{marginTop: 10, maxWidth: '535px', maxHeight: '40px', minWidth: '535px', minHeight: '40px'}} type="comment" placeholder="Comment..." onChange={e => this.setState({ twitterComment: e.target.value })} />
                        </Form.Group>
                        <IconButton onClick={this.redirectIgOpen.bind(this)} aria-label="like" color="primary">
                            <SendIcon style={{color: 'white', maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}} />
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

const igComponent = {
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
    //marginLeft: 565,
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

export default InstagramComponent;