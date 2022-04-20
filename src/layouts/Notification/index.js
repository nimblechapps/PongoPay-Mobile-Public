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
  Modal,
  Image,
} from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color';
import HeaderRight from '../../components/Header/HeaderRight';
import HeaderTitle from '../../components/Header/HeaderTitle';
import styles from './styles';
import Globals from './../../utils/Globals';
import HeaderLeft from '../../components/Header/HeaderLeft';
import SearchBar from '../../components/searchbar';
import {
  fontNormal20,
  fontSmall14,
  fontSmall12,
  fontSmall18,
} from '../../utils/theme';
import DatePicker from 'react-native-datepicker';
import KMButton from '../../components/KMButton';
import CustomIcon from '../../components/CustomIcon';
import API from '../../API';
import ProgressHud from "../../components/ProgressHud";
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { Routes } from '../../utils/Routes';


const images = {
  TriangleImage: require('./../../../src/assets/Images/Triangle_Withshadow.png'),
};
export default class Notification extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderLeft
          iconName="burger_menu"
          onPress={() => {
            navigation.toggleDrawer()
          }}
        />
      ),
      headerTitle: () => <HeaderTitle title={'Notifications'} />,
      headerRight: (
        <HeaderRight
          buttonTitle="Clear"
          iconStyle={{ fontSize: 26, color: Color.DarkGrey }}
          // onPress={() => {
          //   navigation.getParam('clearNotifications')
          // }}
          onPress={navigation.getParam('onClearClickHeader')}

        />
      ),
    };
  };

  constructor(props) {
    super(props);
    const { params = {} } = props.navigation.state;

    this.state = {
      startDate: '',
      endDate: '',
      searchText: '',
      isShowFilter: false,
      notificationList: [],
      isLoading: false,
      isShowClear: false
    };
  }
  onCreate = () => {
    this.getNotificationList();
  }

  onClearClickHeader = () => {
    console.log("Click")
    this.setState({ isShowClear: true });
  }
  hideModal = () => {
    console.log("Click")
    this.setState({ isShowClear: false });
  }
  markNotificationAsRead = async (callback, loading = true) => {
    const { screenProps } = this.props;
    if (!screenProps.isConnected) {
      return
    }

    if (loading) this.setState({ isLoading: true });

    const { searchText,
      //  pageNo,
      status,
      isLoadingMore } = this.state;
    let pageNo = 0
    try {
      let request = {
      };

      let response = await API.markNotificationAsRead(request)

      this.setState({ isLoading: false });
      console.log("response", response)

    } catch (error) {
      console.log("getAllJobs error", error.message);
      this.setState({
        isLoading: false
      });
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onClearClickHeader: this.onClearClickHeader
    });
  }
  clearNotifications = async (callback, loading = true) => {
    console.log("Hello", "called")
    const { screenProps } = this.props;
    if (!screenProps.isConnected) {
      return
    }
    this.setState({ isShowClear: false });

    if (loading) this.setState({ isLoading: true });

    const { searchText,
      //  pageNo,
      status,
      isLoadingMore } = this.state;
    let pageNo = 0
    try {
      let request = {
      };

      let response = await API.clearAllNotifications(request)

      this.setState({ isLoading: false });
      console.log("response", response)
      if (response.status) {
        this.setState({
          notificationList: response.data
        })
      }

    } catch (error) {
      console.log("getAllJobs error", error.message);
      this.setState({
        isLoading: false
      });
    }
  }
  markOneAsRead = async (callback, loading = true, item) => {
    const { screenProps } = this.props;
    if (!screenProps.isConnected) {
      return
    }

    if (loading) this.setState({ isLoading: true });


    try {
      let request = {
        notificationId: item._id,
      };

      let response = await API.markNotificationAsRead(request)

      this.setState({ isLoading: false });
      console.log("response", response)
      if (response.status) {
        const { navigate } = this.props.navigation;
        item.oJobId ?
          navigate(Routes.Job_Details, {
            jobId: item.oJobId
          })
          :
          navigate(Routes.Chat_View, {
            spaceId: item.oJobId ? item.oJobId : item.sChannel,
          })

      }
    } catch (error) {
      console.log("getAllJobs error", error.message);
      this.setState({
        isLoading: false
      });
    }
  }

  getNotificationList = async (callback, loading = true) => {
    const { screenProps } = this.props;
    if (!screenProps.isConnected) {
      return
    }

    if (loading) this.setState({ isLoading: true });

    const { searchText,
      //  pageNo,
      status,
      isLoadingMore } = this.state;
    let pageNo = 0
    try {
      let request = {
        searchText: this.state.searchText,
        dStartDate: this.state.startDate != '' ? moment(this.state.startDate, 'DD-MM-YYYY', true).format('YYYY-MM-DD') : '',
        dEndDate: this.state.endDate != '' ? moment(this.state.endDate, 'DD-MM-YYYY', true).format('YYYY-MM-DD') : '',
      };

      let response = await API.getNotification(request)

      this.setState({ isLoading: false });
      console.log("response", response)
      if (response.status) {

        this.setState({
          notificationList: response.data
        }, () => {
          // this.markNotificationAsRead()
        })
      }
    } catch (error) {
      console.log("getAllJobs error", error.message);
      this.setState({
        isLoading: false
      });
    }
  }
  hideModalFilter() {
    this.setState({
      isShowFilter: false,
    });
  }

  onFilterClick() {
    this.setState({
      isShowFilter: true,
    });
  }
  onSearchTextChange = (text) => {
    console.log("::::", text)
    this.setState({
      searchText: text
    }, () => {
      this.getNotificationList(() => {
      }, false);
    })
  }

  renderListItem({ item }) {
    return (
      <View style={styles.ListMain} >
        <TouchableOpacity onPress={() => {
          this.markOneAsRead(() => {
          }, false, item);
        }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>


            <Label fontSize_12 Montserrat_Regular color={Color.LightGrey} mb={8}>
              {moment(item.dCreatedAt).format('DD-MM-YYYY')}
            </Label>
            <Label fontSize_12 Montserrat_Regular color={Color.LightGrey} mb={8}>
              {moment(item.dCreatedAt).format('HH:mm A')}
            </Label>
          </View>
          <View style={styles.labelView}>
            {item.sStatus == 0 && <View style={styles.unRead}></View>}
            <Label fontSize_14 Montserrat_Bold color={Color.DarkGrey} mb={5} style={{}}>
              {item.sTitle}
            </Label>
          </View>

          <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey}>
            {item.sMessage}
          </Label>
        </TouchableOpacity>
      </View >
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchBox}>
          <SearchBar
            placeholder="Search notification by any keywords"
            boxStyleCustom={{
              width: '90%',
              height: 40,
              alignItems: 'center',
              fontSize: fontSmall12,
            }}
            value={this.state.searchText}
            onChangeText={this.onSearchTextChange}
          />
          <TouchableOpacity
            onPress={() => this.onFilterClick()}
            style={{
              borderRadius: 2,
              backgroundColor: Color.LightBlue,
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CustomIcon
              name={'mobile_filter'}
              style={{ fontSize: fontNormal20, color: Color.WHITE }}
            />
          </TouchableOpacity>
        </View>
        {this.state.notificationList == 0 ?

          <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Label Montserrat_Medium style={{ alignItems: "center", marginTop: -250, fontSize: 16, color: Color.BLACK }}>
              {"No notifications for you."}</Label>
          </View>
          : <FlatList data={this.state.notificationList} renderItem={item => this.renderListItem(item)} />
        }
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.isShowClear}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: Color.ModalBG }}
            onPress={() => this.hideModal()}>
            <View style={{ width: 280, backgroundColor: Color.WHITE, borderRadius: 8 }}>
              <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 12, lineHeight: 22 }}>Are you sure you want to clear the notification listing?</Label>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: Color.WhiteGrey }}>
                <KMButton
                  fontSize_16 Montserrat_Medium
                  color={Color.DarkBlue}
                  title="Yes"
                  onPress={() => this.clearNotifications()}
                  textStyle={{ padding: 0, }}
                  style={styles.modalBtn}
                />
                <View style={{ width: 1, height: '100%', backgroundColor: Color.WhiteGrey }}></View>
                <KMButton
                  fontSize_16 Montserrat_Medium
                  color={Color.DarkBlue}
                  title="No"
                  onPress={() => this.hideModal()}
                  textStyle={{ padding: 0, }}
                  style={styles.modalBtn}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.isShowFilter}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ height: '100%' }}
            onPress={() => this.hideModalFilter()}>
            <View
              style={
                Globals.isIpad ? styles.closebtnMainPad : styles.closebtnMain
              }>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => this.hideModalFilter()}>
                <CustomIcon
                  name={'close'}
                  style={{
                    color: Color.WHITE,
                    fontSize: fontSmall18,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={
                Globals.isIpad
                  ? styles.filterDropdownBoxPad
                  : styles.filterDropdownBox
              }>
              {/* <View style={styles.filterTriggle}></View>
                            <View style={Globals.isIpad ? styles.filterTriggleShadowPad : styles.filterTriggleShadow}>
                            </View> */}
              <Image
                source={images.TriangleImage}
                style={styles.filterTriggle}
              />
              <DatePicker
                style={{ width: 200 }}
                date={this.state.startDate}
                mode="date"
                maxDate={new Date()}
                placeholder="Form"
                format="DD-MM-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                iconComponent={
                  <CustomIcon
                    name={'calendar'}
                    style={{
                      position: 'absolute',
                      right: 8,
                      color: Color.LightBlue,
                      fontSize: fontSmall14,
                    }}
                  />
                }
                style={{ width: '100%', marginBottom: 16 }}
                customStyles={{
                  dateInput: {
                    marginLeft: 0,
                    borderRadius: 4,
                    height: 40,
                    alignItems: 'flex-start',
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderColor: Color.LightGrey,
                    fontFamily: 'Montserrat-Regular',
                    fontSize: fontSmall14,
                  },

                  dateText: {
                    fontSize: 16,
                    color: Color.BLACK,
                    fontFamily: 'Montserrat-Regular',
                  },
                  btnTextConfirm: {
                    color: Color.LightBlue,
                    fontFamily: 'Montserrat-Medium',
                  },
                  btnTextCancel: {
                    color: Color.DarkGrey,
                    fontFamily: 'Montserrat-Medium',
                  },
                }}
                onDateChange={date => {
                  this.setState({ startDate: date });
                }}
              />
              <DatePicker
                style={{ width: 200 }}
                date={this.state.endDate}
                mode="date"
                minDate={this.state.startDate}
                placeholder="To"
                format="DD-MM-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                iconComponent={
                  <CustomIcon
                    name={'calendar'}
                    style={{
                      position: 'absolute',
                      right: 8,
                      color: Color.LightBlue,
                      fontSize: fontSmall14,
                    }}
                  />
                }
                style={{ width: '100%', marginBottom: 16 }}
                customStyles={{
                  dateText: {
                    fontSize: 16,
                    color: Color.BLACK,
                    fontFamily: 'Montserrat-Regular',
                  },
                  dateInput: {
                    marginLeft: 0,
                    borderRadius: 4,
                    height: 40,
                    alignItems: 'flex-start',
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderColor: Color.LightGrey,
                    fontFamily: 'Montserrat-Regular',
                    fontSize: fontSmall14,
                  },
                  dateText: {
                    fontFamily: 'Montserrat-Regular',
                  },
                  btnTextConfirm: {
                    color: Color.LightBlue,
                    fontFamily: 'Montserrat-Medium',
                  },
                  btnTextCancel: {
                    color: Color.DarkGrey,
                    fontFamily: 'Montserrat-Medium',
                  },
                }}
                onDateChange={date => {
                  this.setState({ endDate: date });
                }}
              />
              <View style={styles.calenderBtn}>
                <KMButton
                  fontSize_16
                  Montserrat_Medium
                  color={Color.BLACK}
                  title="Apply"
                  onPress={() => {
                    this.setState({
                      isShowFilter: !this.state.isShowFilter

                    })

                    this.getNotificationList()
                  }}
                  textStyle={{ padding: 0, color: Color.WHITE }}
                  style={[styles.createBtn, { backgroundColor: Color.LightBlue }]}
                />
                <KMButton
                  fontSize_16
                  Montserrat_Medium
                  color={Color.BLACK}
                  title="Clear All"
                  textStyle={{ padding: 0, color: Color.LightBlue }}
                  style={[styles.createBtn, { backgroundColor: Color.WHITE }]}
                  onPress={() => {
                    this.setState({
                      startDate: "",
                      endDate: '',
                      isShowFilter: false
                    }, () => {
                      this.getNotificationList()
                    })
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        {this.state.isLoading && <ProgressHud />}
        <NavigationEvents onWillFocus={this.onCreate} />

      </SafeAreaView>
    );
  }
}
