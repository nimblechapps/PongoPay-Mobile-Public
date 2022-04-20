/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Text,
  Keyboard
} from 'react-native';

import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Globals, { afterSuccessLogin } from '../../utils/Globals';
import API from '../../API';
import Label from '../../components/Label';


const BuilderTutorialScreens = [
  {
    id: 0,
    title: 'Welcome to PongoPay',
    text:
      'Pongo is the tool that takes the hassle out of setting up and taking payment for construction jobs.',
    image: require('../../assets/Images/tutorial/clienttutorial1.png'),
  },
  {
    id: 1,
    title: 'Create a New Job Anywhere, Anytime',
    text:
      'To send a job proposal, simply enter in a job title, amount, job description and client details.',
    image: require('../../assets/Images/tutorial/createnewjob.png'),

  },
  {
    id: 2,
    title: 'Give your clients a more professional service',
    text: 'Clients pay into the Pongo Safe Deposit Box before work starts. Remember to send job proposals at least 24 hours before you start work!',
    image: require('../../assets/Images/tutorial/managejobs.png'),
    css: styles.right
  },
  {
    id: 3,
    title: 'No more chasing late payments ',
    text: 'If your job changes, you can add variations or extra payment stages at any time.',
    image: require('../../assets/Images/tutorial/payment.png'),
  },
  {
    id: 4,
    title: 'Manage all your jobs in one place',
    text:
      'Using Pongo protects you from late payments, ensures you are covered by a basic building contract and makes your business more professional and reliable.',
    image: require('../../assets/Images/tutorial/managealljobs.png'),
  },
  // {
  //   id: 5,
  //   title: 'Wave Goodbye to Late Payments',
  //   text:
  //     'The Client releases funds from the Deposit Box once work is complete',
  //   image: require('../../assets/Images/tutorial/buildertutorial5.png'),
  //   css: styles.right
  // },
]

const ClientTutorialScreens = [
  {
    id: 0,
    title: 'Welcome to PongoPay',
    text:
      'The Construction Payments App',
    image: require('../../assets/Images/tutorial/clienttutorial1.png'),
  },
  {
    id: 1,
    title: '',
    text: 'Agree on work terms',
    image: require('../../assets/Images/tutorial/clienttutorial2_new.png'),
  },
  {
    id: 2,
    title: '',
    text: 'Deposit funds into the Safe Deposit Box',
    image: require('../../assets/Images/tutorial/clienttutorial3.png'),
  },
  {
    id: 3,
    title: '',
    text: 'Discuss work progress',
    image: require('../../assets/Images/tutorial/clienttutorial4.png'),
  },
  {
    id: 4,
    title: '',
    text:
      'Simply release payment from the Safe Deposit Box once you\'re happy with the work',
    image: require('../../assets/Images/tutorial/clienttutorial5.png'),
  },
]
export default class Tutorial extends Component {
  static navigationOptions = ({ }) => ({
    header: null,
  });
  constructor(props) {
    super(props);
    const { params = {} } = props.navigation.state;
    this.state = {
      isLoading: false,
      currentIndex: 0,
      screens: Globals.isBuilder ? BuilderTutorialScreens : ClientTutorialScreens,
      offset: 0,
      direction: '',
    };

  }

  componentDidMount() {
    Keyboard.dismiss()
  }

  renderTutorial({ item }) {
    return (
      <View style={styles.mainRenderSection}>
        <View style={styles.imageSection}>
          <Image
            style={[styles.imageTag, item.css ? item.css : {}]}
            // resizeMode="contain"
            source={item.image}
          />
        </View>
        {item.title !== '' && <Label ml={10} mr={10} style={{ textAlign: 'center' }} color={Color.BLACK} fontSize_16 Montserrat_Bold>{item.title}</Label>}
        <Text style={styles.desText}>{item.text}</Text>
      </View>
    );
  }

  handleScroll = event => {
    this.setState({
      scrollPosition: event.nativeEvent.contentOffset.x,
    });
    var currentOffset = event.nativeEvent.contentOffset.x;
    var direction = currentOffset > this.state.offset ? 'right' : 'left';
    let offset = currentOffset;
    this.setState({ offset });
    this.setState({ direction });
  };

  async seenTutorialAPI() {
    try {
      let response = await API.seenTutorial()
      if (response.status) {
        afterSuccessLogin(this.props, response.data)
      }
    } catch (error) {

    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { screens } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps>
            <View>
              <FlatList
                ref={ref => {
                  this.flatListRef = ref;
                }}
                horizontal
                data={screens}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
                renderItem={item => this.renderTutorial(item)}
                onScrollEndDrag={() => {
                  if (this.state.direction == 'right') {
                    if (
                      this.state.currentIndex ===
                      screens.length - 1
                    ) {
                      return;
                    }
                    this.setState(prevState => {
                      return {
                        currentIndex: prevState.currentIndex + 1,
                      };
                    });
                  } else {
                    if (this.state.currentIndex === 0) {
                      return;
                    }
                    this.setState(prevState => {
                      return {
                        currentIndex: prevState.currentIndex - 1,
                      };
                    });
                  }
                }}
                onScroll={this.handleScroll}
              />
            </View>
          </KeyboardAwareScrollView>
          <View style={[styles.mainPaginationBuilder, {}]}>
            <TouchableOpacity
              style={styles.paginationSection}
              activeOpacity={1}
              onPress={() => {
                if (this.state.currentIndex === 0) {
                  return;
                }
                this.setState(
                  prevState => {
                    return {
                      currentIndex: prevState.currentIndex - 1,
                    };
                  },
                  () => {
                    this.flatListRef.scrollToIndex({
                      index: this.state.currentIndex,
                      animated: true,
                    });
                  },
                );
              }}>
              {
                screens.map((screen, index) => {
                  return <View style={[styles.paginationDots, index === this.state.currentIndex ? styles.activeScreen : {}]} />
                })
              }
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={async () => {
                if (this.state.currentIndex === this.state.screens.length - 1) {
                  await this.seenTutorialAPI()
                  return
                }

                this.setState(prevState => {
                  return {
                    currentIndex: prevState.currentIndex + 1,
                  };
                }, () => {
                  this.flatListRef.scrollToIndex({
                    index: this.state.currentIndex,
                    animated: true,
                  });
                },
                );
              }}>
              <Text style={styles.nextText}>NEXT</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>

      </View>

    );
  }
}
