/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  SafeAreaView,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions,
} from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color';
import styles from './styles';
import HeaderTitle from '../../components/Header/HeaderTitle';
import HeaderRight from '../../components/Header/HeaderRight';
import { fontNormal20 } from '../../utils/theme';
import { GiftedChat, Message, Bubble } from 'react-native-gifted-chat';
import ChatMessage from '../../components/Chat/ChatMessage';
import CustomIcon from '../../components/CustomIcon';
import { createChatEnvironment, uploadImageToServer } from '../../utils/chat';
import { constant, messageType, imageTypes, contains, MilestoneStatus, JobStatus } from '../../utils/Globals';
import ProgressHud from '../../components/ProgressHud';
import PubNub from 'pubnub';
import pubnubService from '../../utils/pubnubService';
import { getStoredData } from '../../utils/store';
import API from "../../API";
import {
  showDocumentPicker,
  showImagePickerView,
} from '../../utils/DocumentPicker';
import { downloadFile, requestStoragePermission } from '../../utils/Files';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Lightbox from 'react-native-lightbox';
import TitleSeparator from '../../components/TitleSeparator';

const pubnub = new PubNub({
  publishKey: 'pub-c-9c81ecb3-c6f3-4e6b-9925-4027d7b9bbdc',
  subscribeKey: 'sub-c-25fd98f8-5929-11ea-b226-5aef0d0da10f',
});

const options = {
  title: 'Select Image',
  customButtons: [
    { name: 'Choose from files', title: 'Choose from files', mediaType: 'image' },
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
export default class ChatView extends Component {
  static navigationOptions = ({ navigation }) => {
    let enableDownload = navigation.getParam('enableDownload')
    return {
      headerTitle: () => <HeaderTitle title={'Message Board'} />,
      headerRight: (
        <HeaderRight
          disable={!enableDownload}
          iconName="download-chat"
          iconStyle={{ color: enableDownload ? Color.LightBlue : Color.DarkGrey, marginRight: 5 }}
          onPress={navigation.getParam("onChatDownload")}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    const { params = {} } = props.navigation.state;
    this.state = {
      messages: [],
      jobDetails: params.jobDetails || {},
      spaceId: params.spaceId,
      isLoading: true,
      currentUser: {},
      milestoneNumber: params.milestoneNumber || 1
    };
  }

  async componentDidMount() {

    this.props.navigation.setParams({
      onChatDownload: this.createPDF
    });
    let userData = JSON.parse(await getStoredData(Globals.kUserData));
    this.setState(
      {
        currentUser: {
          _id: userData._id,
          name: `${userData.sFirstName} ${userData.sLastName}`,
          userRole: Globals.isBuilder ? 'Builder' : 'Client'
        },
      }, this.state.spaceId === undefined ? this.createChannelSpace : this.getPreviousMessages,
    );
  }

  createChannelSpace() {
    let job = this.state.jobDetails;
    if (job.hasOwnProperty('chatDetail')) {
      if (job.chatDetail.hasOwnProperty('spaceId')) {
        this.setState(
          {
            spaceId: job.chatDetail.spaceId,
            isLoading: false,
          },
          () => this.getPreviousMessages(),
        );
        return;
      }
    }

    let usersArr = [
      { id: job.Builder._id },
      { id: job.Client._id },
    ];
    if (job.hasOwnProperty('PropertyManager')) {
      usersArr.push({ id: job.PropertyManager._id });
    }
    let self = this;
    createChatEnvironment(job, usersArr, res => {
      self.setState({
        isLoading: false,
      });
      if (!res.status) {
        const { navigation, screenProps } = self.props;
        screenProps.callback({
          status: false,
          msg: 'Something is wrong with your chat environment!!',
        });
      } else {
        self.setState({
          spaceId: res.spaceId,
        }, () => self.getPreviousMessages(),
        );
      }
    });
  }

  getPreviousMessages = () => {
    this.setState({ isLoading: false })
    let { spaceId } = this.state;
    let self = this;
    pubnubService.getMessages(spaceId, messagesRes => {
      if (messagesRes) {
        self.setGiftedMessage(self, messagesRes);
      }
      pubnub.addListener({
        message: messageEvent => {
          self.setGiftedMessage(self, [messageEvent]);
        },
      });
      let channels = [spaceId];
      pubnub.subscribe({ channels });
    });
  };

  setGiftedMessage(self, messageArr) {
    this.props.navigation.setParams({ enableDownload: messageArr.length > 0 })
    messageArr.map((msg, index) => {
      let message = {};
      if (msg.message.messageType == messageType.IMAGE) {
        message._id = 1;
        message.text = '';
        message.createdAt = msg.message.date
          ? new Date(msg.message.date)
          : new Date();
        message.user = msg.message.sender;
        message.image = msg.message.image;
        message.messageType = messageType.IMAGE;
        message.milestoneNumber = msg.message.milestoneNumber
      } else if (msg.message.messageType == messageType.FILE) {
        message._id = 1;
        message.text = '';
        message.createdAt = msg.message.date
          ? new Date(msg.message.date)
          : new Date();
        message.user = msg.message.sender;
        message.image = msg.message.image;
        message.messageType = messageType.FILE;
        message.milestoneNumber = msg.message.milestoneNumber
      } else {
        message._id = 1;
        message.text = msg.message.text;
        message.createdAt = msg.message.date
          ? new Date(msg.message.date)
          : new Date();
        message.user = msg.message.sender;
        message.messageType = messageType.TEXT;
        message.milestoneNumber = msg.message.milestoneNumber
      }

      self.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
        isLoading: false,
        msgText: '',
      }));
    });
  }


  onSelectImage = () => {
    showImagePickerView(options, response => {
      if (response.customButton == 'Choose from files') {
        showDocumentPicker(false, (error, response) => {
          if (error) {
            return;
          }
          this.handleChooseFile(response);
        });
      } else {
        if (!response.didCancel && !response.error && !response.customButton) {
          this.handleChooseFile(response);
        }
      }
    });
  };


  renderInputToolbar(props) {
    let { jobDetails } = this.state
    let disabled = this.state.msgText === ''
    return (
      contains([JobStatus.CANCELLED, JobStatus.IN_ARBITRATION], jobDetails.nStatus)
        ?
        null
        :
        <View style={styles.footerBottom}>
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => this.onSelectImage()}>
            <CustomIcon
              name={'add-image'}
              style={{ fontSize: fontNormal20, color: Color.LightBlue }}
            />
          </TouchableOpacity>
          <TextInput
            autoCorrect={false}
            multiline
            style={styles.inputBox}
            placeholder="Type a message..."
            value={this.state.msgText}
            onChangeText={text => this.setState({ msgText: text })}
          />
          <TouchableOpacity disabled={disabled}
            style={{ marginRight: 16 }}
            onPress={() => this.onSend(messageType.TEXT)}>
            <Label fontSize_14 Montserrat_Bold color={disabled ? Color.DarkGrey : Color.LightBlue}>
              Send
          </Label>
          </TouchableOpacity>
        </View>
    );
  }

  renderMessage(props, index) {
    let { currentMessage, previousMessage } = props;

    let hasSeparator = previousMessage?.milestoneNumber !== currentMessage?.milestoneNumber
    let isLeft = currentMessage.user._id !== this.state.currentUser._id

    let filename = currentMessage.image ? currentMessage.image.split('/') : ''
    let username = currentMessage.user ? currentMessage.user.name : ''
    let userRole = (isLeft && currentMessage.user) ? currentMessage.user.userRole : ''
    return (
      <View>
        {hasSeparator && <TitleSeparator title={`Payment Stage ${currentMessage.milestoneNumber}`} />}
        <View style={currentMessage.user._id !== this.state.currentUser._id ? styles.leftFileBubble : styles.rightFileBubble} >
          <Text
            style={currentMessage.user._id !== this.state.currentUser._id ? styles.leftsenderText : styles.rightsenderText}>
            {`${username}${userRole ? '(' + userRole + ')' : ''}`}
          </Text>
          {currentMessage.messageType === messageType.FILE && <View
            style={{
              borderRadius: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 10,
              alignItems: 'center',
              marginBottom: 8,
              backgroundColor: '#e9e9e9',
            }}>
            <CustomIcon
              name={'document'}
              style={{ fontSize: 25, color: '#aaaaaa' }}
            />
            <Text
              style={{
                fontSize: 13,
                marginLeft: 10,
              }}>
              {filename[filename.length - 1]}
            </Text>
            {isLeft && <TouchableOpacity onPress={() => this.onFileDownload(currentMessage)}>
              <CustomIcon
                name={'download-chat'}
                style={{
                  fontSize: 16,
                  color: Color.LightBlue,
                  marginLeft: 7,
                }}
              />
            </TouchableOpacity>}
          </View>
          }
          {currentMessage.messageType === messageType.TEXT && <Text
            style={currentMessage.user._id !== this.state.currentUser._id ? styles.leftmessageText : styles.rightmessageText}>
            {currentMessage.text}
          </Text>
          }
          {currentMessage.messageType === messageType.IMAGE &&
            <Lightbox
              activeProps={{
                resizeMode: 'contain',
                style: { flex: 1, width: null, height: null }
              }}
            >
              <Image
                style={{ height: 150, width: '100%', alignSelf: 'center' }}
                resizeMode='cover'
                source={{ uri: currentMessage.image }}
              />
            </Lightbox>

          }
          <View>
            <Text
              style={currentMessage.user._id !== this.state.currentUser._id ? styles.lefttimeText : styles.righttimeText}>
              {moment(currentMessage.createdAt).format('HH:mm a')}
            </Text>
          </View>
        </View>
      </View>
    );

  }

  async onSend(fileType) {
    let msgObj = {
      pn_debug: true,
      title: "New Message received",
      description: `A new message is received for ${this.state.jobDetails.sJobTitle} from ${this.state.currentUser.name}`,
      sender: this.state.currentUser,
      date: new Date(),
      milestoneNumber: this.state.milestoneNumber
    };
    switch (fileType) {
      case messageType.TEXT:
        if (this.state.msgText != '') {
          msgObj['messageType'] = messageType.TEXT;
          msgObj['text'] = this.state.msgText;
          pubnubService.publishMessage(this.state.spaceId, msgObj);
          this.addNotificationWebService(msgObj)
        }
        break;
      case messageType.IMAGE:
        if (this.state.msgImage != '') {
          msgObj['messageType'] = messageType.IMAGE;
          msgObj['image'] = this.state.msgImage;
          pubnubService.publishMessage(this.state.spaceId, msgObj);
          this.addNotificationWebService(msgObj)
        }
        break;
      case messageType.FILE:
        if (this.state.msgFile != '') {
          msgObj['messageType'] = messageType.FILE;
          msgObj['image'] = this.state.msgFile;
          pubnubService.publishMessage(this.state.spaceId, msgObj);
          this.addNotificationWebService(msgObj)
        }
        break;
      default:
        break;
    }
  }

  render() {
    let { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <View style={{ flex: 1 }}>
            <GiftedChat
              renderAvatar={null}
              minInputToolbarHeight={64}
              messages={this.state.messages}
              user={this.state.currentUser}
              renderMessage={this.renderMessage.bind(this)}
              renderInputToolbar={this.renderInputToolbar.bind(this)}
            />
          </View>
        </SafeAreaView>
        {isLoading && <ProgressHud />}
      </View>
    );
  }

  async handleChooseFile(response) {
    this.setState({ isLoading: true });
    let imageUrl = await uploadImageToServer(response.uri);
    if (imageUrl) {
      let type = response.type.includes('image')
        ? messageType.IMAGE
        : messageType.FILE;
      let stateObj = response.type.includes('image')
        ? { msgImage: imageUrl }
        : { msgFile: imageUrl };
      this.setState(stateObj, () => this.onSend(type));
    } else {
      Alert.alert('Image upload failed');
    }
  }

  getInnerHTML = (msg) => {
    switch (msg.messageType) {
      case 'text':
        return (
          `<div>
            <p>[${msg.user.name}, ${moment(msg.createdAt).format('DD-MM-YYYY hh:mm a')}]: ${msg.text}</p><br />
          </div>`
        )
      case 'image':
        return (
          `<div>
            <p>{[${msg.user.name}, ${moment(msg.createdAt).format('DD-MM-YYYY hh:mm a')}]:</p >
              <img style={{ height: 70, width: 70 }} src=${msg.image} /><br/>
              <a style={{ color: 'blue' }} href=${msg.image} target="_blank">${msg.image}</a>
          </div > `
        )
      case 'file':
        //
        return (
          `<div>
            <p>[${msg.user.name}, ${moment(msg.createdAt).format('DD-MM-YYYY hh:mm a')}]: </p>
            <img src={"https://res.cloudinary.com/nimble-chapps/image/upload/v1592998025/PongoPay/uwwl4armh5eseyanrlnz.png"} /><br/>
            <a style={{ color: 'blue' }} href=${msg.image} download>${msg.image}</a>
          </div >`
        )
      default:
        return ''
    }
  }

  createPDF = async () => {
    let { jobDetails } = this.state
    let fileName = 'PongoPay_' + jobDetails.sJobTitle.replace(/ /g, '_')
    this.setState({ isLoading: true })
    let self = this
    requestStoragePermission(async (allowed) => {
      if (allowed) {
        let { messages } = this.state
        messages = messages.sort((a, b) => a.createdAt - b.createdAt)
        let html = ''
        for (let i = 0; i < messages.length; i++) {
          let msg = messages[i]
          html += this.getInnerHTML(msg)
        }
        let options = {
          html: html,
          fileName: fileName,
          directory: 'Documents',
        };

        let file = await RNHTMLtoPDF.convert(options)
        console.log('path================>', file.filePath);
        self.setState({ isLoading: false })
        let { screenProps } = this.props;
        if (!screenProps.isConnected) {
          return;
        }
        screenProps.callback({ status: true, msg: 'Your chat has been downloaded successfully.' });
      } else {
        // alert('Please on storage permission from setting');
        screenProps.callback({ status: false, msg: 'Please on storage permission from setting' });
      }
    })

  }

  onFileDownload(msg) {
    if (msg.hasOwnProperty('image') && msg.image != undefined) {
      let filename = msg.image.split('/');
      downloadFile(msg.image, filename[filename.length - 1], () => {
        let { screenProps } = this.props;
        if (!screenProps.isConnected) {
          return;
        }
        screenProps.callback({ status: true, msg: 'File has been downloaded successfully.' });
      });
    }
  }

  addNotificationWebService = async (msgobj) => {
    let { jobDetails } = this.state

    try {
      let request = {
        title: msgobj.title,
        description: msgobj.description,
        channel: this.state.spaceId,
        jobId: this.state.spaceId,
      };

      if (jobDetails.ActiveMilestone.DisputeMilestone.length > 0) {
        request['disputeMilestoneId'] = jobDetails.ActiveMilestone.DisputeMilestone[0]._id
      }
      let response = await API.addNotification(request)
      this.setState({ isLoading: false });
      console.log("addNotification response", response)
      if (response.status) {

      } else {
        // this.setState({ toast: { show: true, message: response.msg, isValid: false } })
      }

    } catch (error) {
      console.log("addNotification error", error.message);
      // this.setState({
      //   isLoading: false
      // });
    }
  }
}

