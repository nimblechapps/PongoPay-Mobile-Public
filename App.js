import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Platform,
  AppState,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationActions,
} from 'react-navigation';
import {
  createStackNavigator,
  HeaderStyleInterpolator,
} from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import HeaderLeft from './src/components/Header/HeaderLeft';
import GlobalStyles from './src/utils/GlobalStyles';
import { isIOS } from './src/utils/theme';
import { Routes } from './src/utils/Routes';
import ToastMessage from './src/components/toastmessage';

import AuthScreen from './src/layouts/AuthScreen';
import PubNub from 'pubnub';
import messaging from '@react-native-firebase/messaging';

import KMButton from './src/components/KMButton';

// Login
import Login from './src/layouts/Login';
import SignUp from './src/layouts/SignUp/SignUp';
import SignUpOtp from './src/layouts/SignUp/SignUpOtp';

// Profile
import MyProfile from './src/layouts/Profile/MyProfile';
import PersonalInformation from './src/layouts/Profile/PersonalInformation';
import ContactInformation from './src/layouts/Profile/ContactInformation';
import FinancialInformation from './src/layouts/Profile/FinancialInformation';

// Job Listing
import JobListing from './src/layouts/MyJobs/JobListing';
import JobDetails from './src/layouts/MyJobs/JobDetails';
import CreateNewJob from './src/layouts/CreateNewJob';
import EditJob from './src/layouts/EditJob';
import CreateContract from './src/layouts/CreateContract';
import UpdateContract from './src/layouts/UpdateContract';
import AddMilestone from './src/layouts/AddMilestone';
import SidebarMenu from './src/layouts/SidebarMenu';
import ContractModificationRequests from './src/layouts/ContractModificationRequests';
import MilestoneModificationRequests from './src/layouts/MilestoneModificationRequests';
import SendModificationRequests from './src/layouts/Client/SendModificationRequests';
import MilestoneListing from './src/layouts/MyJobs/MilestoneListing';
import MilestoneListingClient from './src/layouts/Client/MilestoneListingClient';
import MilestoneDetail from './src/layouts/MyJobs/MilestoneDetail';
import MilestoneUpdates from './src/layouts/MyJobs/MilestoneUpdates';
import ChatView from './src/layouts/ChatView';
import CardView from './src/layouts/CardView';
import WorkProgressList from './src/layouts/WorkProgressList';
import WorkProgressDetail from './src/layouts/WorkProgressDetail';
import WorkProgressUpload from './src/layouts/WorkProgressUpload';
import BuildingIssues from './src/layouts/BuildingIssues';
import MilestoneRejectionComments from './src/layouts/MilestoneRejectionComments';
import ConclusionAccepted from './src/layouts/ConclusionAccepted';
import Notification from './src/layouts/Notification';
import IncorporateMyProfile from './src/layouts/Profile/IncorporateMyProfile';
import TutorialScreen from './src/layouts/TutorialScreen';

// Property Manager
import PropertyManagerList from './src/layouts/PropertyManagerList';
import PropertyManagerDetails from './src/layouts/PropertyManagerDetails';

// Client List
import ClientsList from './src/layouts/ClientsList';
import ClientsDetails from './src/layouts/ClientsDetails';

import AddJobCode from './src/layouts/AddJobCode';
import EditMilestone from './src/layouts/EditMilestone';

//Clients User
import AskForModification from './src/layouts/Client/AskForModification';
import RejectWork from './src/layouts/Client/RejectWork';
import uboPersonDetails from './src/layouts/Profile/uboPersonDetails';
import EditBusinessUBO1 from './src/layouts/Profile/EditBusinessUBO1';
import EditBusinessUBO2 from './src/layouts/Profile/EditBusinessUBO2';

import { getStoredData } from './src/utils/store';
import Globals, { isValidValue, getKycRoute } from './src/utils/Globals';
import NotificationService from './src/utils/NotificationService';
import CompanyInformation from './src/layouts/Profile/CompanyInformation';
import LegalInformation from './src/layouts/Profile/LegalInformation';
import LegalContactInformation from './src/layouts/Profile/LegalContactInformation';
import ToolTip from './src/components/Tooltip';
import Label from './src/components/Label';
import Mangopay from './src/utils/mangopay';

//New SignUp Pages
import FirstPage from './src/layouts/SignUpNew/FirstPage';
import PhoneNumScreen from './src/layouts/SignUpNew/PhoneNumScreen';
import OTPScreen from './src/layouts/SignUpNew/OTPScreen';
import EmailScreen from './src/layouts/SignUpNew/EmailScreen';
import NameScreen from './src/layouts/SignUpNew/NameScreen';
import ProfileScreen from './src/layouts/SignUpNew/ProfileScreen';
import TradingScreen from './src/layouts/SignUpNew/TradingScreen';
import DOBScreen from './src/layouts/SignUpNew/DOBScreen';
import NationalityScreen from './src/layouts/SignUpNew/NationalityScreen';
import BusinessNameScreen from './src/layouts/SignUpNew/BusinessNameScreen';
import BusinessAddress from './src/layouts/SignUpNew/BusinessAddress';
import BusinessEmailScreen from './src/layouts/SignUpNew/BusinessEmailScreen';
import BusinessYourAddress from './src/layouts/SignUpNew/BusinessYourAddress';
import BusinessOwner from './src/layouts/SignUpNew/BusinessOwner';

import BankDetailsScreen from './src/layouts/SignUpNew/BankDetailsScreen';
import DocUploadScreen from './src/layouts/SignUpNew/DocUploadScreen';
import ShareScreen from './src/layouts/SignUpNew/ShareScreen';
import CongratsScreen from './src/layouts/SignUpNew/CongratsScreen';
import BusinessUBO1 from './src/layouts/SignUpNew/BusinessUBO1';
import BusinessUBO2 from './src/layouts/SignUpNew/BusinessUBO2';
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-community/async-storage';

var PushNotification = require('react-native-push-notification');
const pubnub = new PubNub({
  publishKey: 'pub-c-9c81ecb3-c6f3-4e6b-9925-4027d7b9bbdc',
  subscribeKey: 'sub-c-25fd98f8-5929-11ea-b226-5aef0d0da10f',
  uuid: 'PJ-android',
});

// Login
const AuthStack = createStackNavigator(
  {
    [Routes.Login]: { screen: Login },
    [Routes.FirstPage]: { screen: FirstPage },
    [Routes.PhoneNumScreen]: { screen: PhoneNumScreen },
    [Routes.OTPScreen]: { screen: OTPScreen },
    [Routes.EmailScreen]: { screen: EmailScreen },
    [Routes.NameScreen]: { screen: NameScreen },
    [Routes.ProfileScreen]: { screen: ProfileScreen },
    [Routes.TradingScreen]: { screen: TradingScreen },
    [Routes.DOBScreen]: { screen: DOBScreen },
    [Routes.NationalityScreen]: { screen: NationalityScreen },
    [Routes.BusinessNameScreen]: { screen: BusinessNameScreen },
    [Routes.BusinessAddress]: { screen: BusinessAddress },
    [Routes.BusinessEmailScreen]: { screen: BusinessEmailScreen },
    [Routes.BusinessYourAddress]: { screen: BusinessYourAddress },
    [Routes.BusinessOwner]: { screen: BusinessOwner },
    [Routes.BusinessUBO1]: { screen: BusinessUBO1 },
    [Routes.BusinessUBO2]: { screen: BusinessUBO2 },

    [Routes.BankDetailsScreen]: { screen: BankDetailsScreen },
    [Routes.DocUploadScreen]: { screen: DocUploadScreen },

    [Routes.ShareScreen]: { screen: ShareScreen },
    [Routes.CongratsScreen]: { screen: CongratsScreen },

    [Routes.SignUp]: { screen: SignUp },
    [Routes.SignUp_Otp]: { screen: SignUpOtp },
    [Routes.TutorialScreen]: { screen: TutorialScreen },
  },
  {
    initialRouteName: Routes.Login,
    defaultNavigationOptions: ({ }) => ({
      gesturesEnabled: false,
      headerShown: false,
      // headerStyle: GlobalStyles.headerStyle,
    }),
  },
);

// Profile
const ProfileStack = createStackNavigator(
  {
    [Routes.My_Profile]: { screen: MyProfile },
    [Routes.Personal_Information]: { screen: PersonalInformation },
    [Routes.Contact_Information]: { screen: ContactInformation },
    [Routes.Financial_Information]: { screen: FinancialInformation },
    [Routes.uboPersonDetails]: { screen: uboPersonDetails },
    [Routes.EditBusinessUBO1]: { screen: EditBusinessUBO1 },
    [Routes.EditBusinessUBO2]: { screen: EditBusinessUBO2 },
    [Routes.IncorporateMyProfile]: { screen: IncorporateMyProfile },
    [Routes.CompanyInformation]: { screen: CompanyInformation },
    [Routes.LegalInformation]: { screen: LegalInformation },
    [Routes.LegalContactInformation]: { screen: LegalContactInformation },
  },
  {
    initialRouteName: Routes.My_Profile,
    defaultNavigationOptions: ({ }) => ({
      gesturesEnabled: false,
      headerStyle: GlobalStyles.headerStyle,
    }),
  },
);

// Job Listing
const JobStack = createStackNavigator(
  {
    [Routes.Job_Listing]: { screen: JobListing },
    [Routes.Milestone_Listing]: { screen: MilestoneListing },
    [Routes.Milestone_Listing_Client]: { screen: MilestoneListingClient },
    [Routes.Milestone_Detail]: { screen: MilestoneDetail },
    [Routes.Milestone_Updates]: { screen: MilestoneUpdates },
    [Routes.Job_Details]: { screen: JobDetails, path: 'JobDetails/:id' },
    [Routes.Create_New_Job]: { screen: CreateNewJob },
    [Routes.Edit_Job]: { screen: EditJob },
    [Routes.Create_Contract]: { screen: CreateContract },
    [Routes.Update_Contract]: { screen: UpdateContract },
    [Routes.Add_Milestone]: { screen: AddMilestone },
    [Routes.Contract_Modification_Requests]: {
      screen: ContractModificationRequests,
    },
    [Routes.Milestone_Modification_Requests]: {
      screen: MilestoneModificationRequests,
    },
    [Routes.Send_Modification_Requests]: { screen: SendModificationRequests },
    [Routes.Chat_View]: { screen: ChatView },
    [Routes.CardView]: { screen: CardView },
    [Routes.Work_Progress_List]: { screen: WorkProgressList },
    [Routes.Work_Progress_Detail]: { screen: WorkProgressDetail },
    [Routes.Work_Progress_Upload]: { screen: WorkProgressUpload },
    [Routes.Building_Issues]: { screen: BuildingIssues },
    [Routes.Milestone_Rejection_Comments]: { screen: MilestoneRejectionComments },
    [Routes.Conclusion_Accepted]: { screen: ConclusionAccepted },
    [Routes.Notification]: { screen: Notification },
    [Routes.Add_Job_Code]: { screen: AddJobCode },
    [Routes.Edit_Milestone]: { screen: EditMilestone },
    [Routes.Ask_For_Modification]: { screen: AskForModification },
    [Routes.Reject_Work]: { screen: RejectWork },
  },
  {
    initialRouteName: Routes.Job_Listing,
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      headerTransparent: false,
      headerStyle: GlobalStyles.headerStyle,
      headerLeft: (
        <HeaderLeft iconName="left-arrow" onPress={() => navigation.goBack()} />
      ),
      headerRight: isIOS() ? null : <View style={{ width: 30 }} />,
    }),
  },
);

// Property Manager
const MyPropertyManagerStack = createStackNavigator(
  {
    [Routes.Property_Manager_List]: { screen: PropertyManagerList },
    [Routes.Property_Manager_Details]: { screen: PropertyManagerDetails },
  },
  {
    initialRouteName: Routes.Property_Manager_List,
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      headerTransparent: false,
      headerStyle: GlobalStyles.headerStyle,
      headerLeft: (
        <HeaderLeft iconName="left-arrow" onPress={() => navigation.goBack()} />
      ),
      headerRight: isIOS() ? null : <View style={{ width: 30 }} />,
    }),
  },
);

// Client List
const MyClientStack = createStackNavigator(
  {
    [Routes.Clients_List]: { screen: ClientsList },
    [Routes.Clients_Details]: { screen: ClientsDetails },
  },
  {
    initialRouteName: Routes.Clients_List,
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      headerTransparent: false,
      headerStyle: GlobalStyles.headerStyle,
      headerLeft: (
        <HeaderLeft iconName="left-arrow" onPress={() => navigation.goBack()} />
      ),
      headerRight: isIOS() ? null : <View style={{ width: 30 }} />,
    }),
  },
);

const DrawerNavigator = createDrawerNavigator(
  {
    [Routes.Job_Listing]: { screen: JobStack },
    [Routes.Property_Manager_List]: { screen: MyPropertyManagerStack },
    [Routes.Clients_List]: { screen: MyClientStack },
    [Routes.My_Profile]: { screen: ProfileStack },
  },
  {
    contentComponent: SidebarMenu,
    drawerWidth: 280,
    drawerLockMode: 'locked-closed',
  },
);

const RootStackNavigator = createSwitchNavigator(
  {
    [Routes.Auth]: { screen: AuthScreen },
    [Routes.Auth_Stack]: { screen: AuthStack },
    [Routes.App_Drawer]: { screen: DrawerNavigator },
  },
  {
    initialRouteName: Routes.Auth,
    headerMode: 'none',
    defaultNavigationOptions: ({ }) => ({
      gesturesEnabled: false,
    }),
  },
);
const RootNavigator = createAppContainer(RootStackNavigator);
const prefix = 'pongopay://';

export default class App extends Component {
  _subscription = null;

  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      toastData: {
        isShow: false,
        message: '',
      },
      reminder: {
        completeKYC: true,
        completePayout: true,
        completeRegistration: true
      },
      user: {},
    };
    this.navigator = null;
    let channels = [];
  }

  onAppBootstrap = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();
    // Get the token
    const token = await messaging().getToken();
    // alert(token)
    await AsyncStorage.setItem('fcmToken', token);
  };

  // Token

  getToken = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      messaging()
        .getToken()
        .then(async fcmToken => {
          if (fcmToken) {
            console.log('User has notification permissions enabled.', fcmToken);
            // alert('enable notification permission from settings.' + fcmToken);
            await AsyncStorage.setItem('fcmToken', fcmToken);
          } else {
            //alert("user doesn't have a device token yet");
          }
        });
    } else {
      alert('enable notification permission from settings.');
    }
  };

  // Permissions

  checkApplicationPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
      this.getToken();
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  };

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.onAppBootstrap();
    } else {
      this.checkApplicationPermission();
    }

    getStoredData(Globals.kChannels).then(async value => {
      let result = JSON.parse(value);
      console.log('job channles', result);
      channels = result;
    });
    this.refreshUser();
    this.notification = new NotificationService(this.onNotification);

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
      });
  }

  onNotification = notification => {
    let count = global.notificationCount;
    count === '' || count === undefined ? 1 : count + 1;
    // count = count + 1
    global.notificationCount = count;
    if (notification.noti_type === 'chat') {
      if (
        this.navigation &&
        this.navigation.state.routeName !== Routes.Chat_View
      ) {
        this.navigation.dispatch(
          NavigationActions.navigate({
            routeName: Routes.Chat_View,
            params: {
              spaceId: notification.spaceId,
              jobDetails: {
                sJobTitle: notification.jobTitle,
              },
            },
          }),
        );
      }
    }
  };

  checkVersionUpdate = async () => {
    if (Platform.OS === 'ios') {
      const countryCode = await VersionCheck.getCountry();

      const latestVersion = await VersionCheck.getLatestVersion({
        provider: 'appStore', // for iOS
        country: countryCode.toLocaleLowerCase(),
      });

      const needToUpdate = await VersionCheck.needUpdate({
        currentVersion: VersionCheck.getCurrentVersion(),
        latestVersion: latestVersion,
      });

      if (needToUpdate && needToUpdate.isNeeded) {
        Alert.alert(
          'PongoPay App Update',
          'The latest version of the app is now available to download on the app store. Please update to use our latest features.',
          [
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(
                  'https://apps.apple.com/gb/app/pongopay/id1526424988',
                );
              },
            },
            {
              text: 'No',
              onPress: () => console.log('OK Pressed'),
            },
          ],
        );
      }
    } else {
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: 'playStore', // for Android
      });

      const needToUpdate = await VersionCheck.needUpdate({
        currentVersion: VersionCheck.getCurrentVersion(),
        latestVersion: latestVersion,
      });

      if (needToUpdate && needToUpdate.isNeeded) {
        Alert.alert(
          'PongoPay App Update',
          'The latest version of the app is now available to download on the app store. Please update to use our latest features.',
          [
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.pongopay.pongopay',
                );
              },
            },
            {
              text: 'No',
              onPress: () => console.log('OK Pressed'),
            },
          ],
        );
      }
    }
  };

  componentDidMount() {
    this.checkVersionUpdate();

    // // CHECK HERE UPDATE

    // console.log("====1", VersionCheck.getPackageName());        // com.reactnative.app
    // console.log("====2", VersionCheck.getCurrentBuildNumber()); // 10
    // console.log("====3", VersionCheck.getCurrentVersion());     // 0.1.1

    // VersionCheck.getLatestVersion()
    //   .then(latestVersion => {
    //     console.log("====4", latestVersion);    // 0.1.2
    //   });

    // VersionCheck.getLatestVersion({
    //   provider: 'appStore',  // for iOS
    //   country: 'gb'
    // })
    //   .then(latestVersion => {
    //     console.log("====5", latestVersion);    // 0.1.2
    //   });

    // VersionCheck.getLatestVersion({
    //   provider: 'playStore'  // for Android
    // })
    //   .then(latestVersion => {
    //     console.log("====6", latestVersion);    // 0.1.2
    //   });

    // VersionCheck.getLatestVersion()    // Automatically choose profer provider using `Platform.select` by device platform.
    //   .then(latestVersion => {
    //     console.log("====7", latestVersion);    // 0.1.2
    //   });

    // const latestVersion = await VersionCheck.getLatestVersion({
    //   forceUpdate: true,
    //   provider: () => fetch(`https://itunes.apple.com/${countryCode}/lookup?bundleId=${packageName}`),
    //   country: 'gb',
    // });

    // const latestVersion = await VersionCheck.needUpdate({
    // });

    // console.log("-------------- V", latestVersion);    // true

    // console.log("== URL ==", `https://itunes.apple.com/${countryCode}/lookup?bundleId=${packageName}`)
    // console.log("-------------- V", VersionCheck.getCurrentVersion());    // true
    // console.log("-------------- V", VersionCheck.getLatestVersion({
    //   forceUpdate: true,
    //   provider: () => fetch(`https://itunes.apple.com/${countryCode}/lookup?bundleId=${packageName}`),
    //   country: 'gb',
    // }));    // true

    // VersionCheck.needUpdate({
    //   currentVersion: "1.0",
    //   latestVersion: "2.0",
    //   depth: 1,
    //   forceUpdate: true
    // }).then(res => {
    //   console.log("--------------", res);  // true
    // });

    TextInput.defaultProps = {
      ...(TextInput.defaultProps || {}),
      allowFontScaling: false,
    };
    Text.defaultProps = {
      ...(Text.defaultProps || {}),
      allowFontScaling: false,
    };
    Text.defaultProps.allowFontScaling = false;
    console.log('APP', 'app.js');
    this._subscription = NetInfo.addEventListener(
      this._handleConnectivityChange,
    );
  }

  componentWillUnmount() {
    this._subscription && this._subscription();
  }

  _handleConnectivityChange = state => {
    console.log('handleConnectivityChange', state.isConnected);
    this.setState({
      isConnected: state.isConnected,
    });
  };

  refreshUser(hideReminder) {
    if (hideReminder) {
      this.setState({
        reminder: {
          completeKYC: true,
          completePayout: true,
        },
      });
      return;
    }
    getStoredData(Globals.kUserData).then(async value => {
      let result = JSON.parse(value);
      if (!isValidValue(result)) {
        this.setState({
          reminder: {
            completeKYC: true,
            completePayout: true,
          },
        });
        return;
      }
      let hasBankAdded = isValidValue(result.bank_acc_id);
      let hasAddress = isValidValue(result.oAddress);
      if (!result.bank_acc_id) {
        let response = await Mangopay.getBankAccountOfUser();
        let bankDetails = response.bankAccounts.filter(
          b => b.Active == true && b.AccountNumber,
        );
        if (bankDetails.length > 0) {
          let isAccountNumber = bankDetails[0]?.AccountNumber;
          bankAccNo = isAccountNumber
            ? bankDetails[0]?.AccountNumber
            : bankDetails[0].IBAN;
          sortCode = isAccountNumber
            ? bankDetails[0]?.SortCode
            : bankDetails[0].BIC;
          hasBankAdded = bankAccNo && sortCode;
        }
      }
      let completeKYC = isValidValue(result.kyc_status);

      let reminderCount = () => {
        //here
        let count = 2;
        (completeKYC && hasBankAdded) && count--;
        hasAddress && count--;
        return count;
      };

      if (result.sAccountType?.toLowerCase() == 'business') {
        completeKYC = isValidValue(result?.kyc_status?.articals_of_association);
        // PP-12 completeKYC = isValidValue(result?.kyc_status?.identity_proof) && isValidValue(result?.kyc_status?.articals_of_association) && isValidValue(result?.kyc_status?.registration_proof)
      }
      this.setState(
        {
          reminder: {
            completeKYC,
            completePayout: hasBankAdded,
            completeRegistration: hasAddress
          },
          user: result,
          reminderCount: reminderCount(),
        },
        () => {
          console.log(
            '===== completeKYC -----',
            this.state.reminder.completeKYC,
          );
          console.log(
            '===== completeKYC -----',
            this.state.reminder.completePayout,
          );
        },
      );
    });
  }

  onReminderClick = async type => {
    this.setState({ showToolTip: false });
    let { user } = this.state;
    let routeName = await getKycRoute(type, user);
    // let isBusiness = user.sAccountType ?.toLowerCase() == 'business' ? true : false
    // let routeName = Routes.Financial_Information

    // if (type === 'bank') {
    //   if (isBusiness && !user ?.oLegalRepresentativeDetail ?.address) {
    //     routeName = Routes.LegalInformation
    //   } else if (!user ?.oAddress) {
    //     routeName = Routes.Contact_Information
    //   }
    // }

    this.navigator &&
      this.navigator.dispatch(
        NavigationActions.navigate({
          routeName: routeName,
        }),
      );
  };

  renderToolTipView = () => {
    let { reminder } = this.state;
    return (
      <View>
        {!reminder.completeRegistration && (
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Label
              style={{
                width: '68%',
                paddingRight: 10,
              }}
              color={Color.BLACK}
              fontSize_16
              Montserrat_Medium>
              Complete Registration
            </Label>
            <KMButton
              onPress={() => this.onReminderClick('register')}
              fontSize_16
              Montserrat_Medium
              color={Color.WHITE}
              title="Add Now"
              style={{
                width: '32%',
                backgroundColor: Color.LightBlue,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            />
          </View>
        )}
        {!(reminder.completeKYC && reminder.completePayout) && (
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <Label
              style={{
                width: '68%',
                paddingRight: 10,
              }}
              color={Color.BLACK}
              fontSize_16
              Montserrat_Medium>
              Complete KYC:{"\n"}
              {!reminder.completePayout &&  "• Add Bank Details\n"}
              {!reminder.completeKYC &&  "• Verify ID"}              
            </Label>
            <KMButton
              onPress={() => {!reminder.completePayout ? this.onReminderClick('bank') : this.onReminderClick('kyc')}}
              fontSize_16
              Montserrat_Medium
              color={Color.WHITE}
              title="Add Now"
              style={{
                width: '32%',
                backgroundColor: Color.LightBlue,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            />
          </View>
        )}
      </View>
    );
  };

  render() {
    const {isConnected, toastData, reminder, reminderCount, user} = this.state;
    return (
      <View style={styles.container}>
        <RootNavigator
          uriPrefix={prefix}
          screenProps={{
            isConnected: isConnected,
            callback: this.showHideToast,
            isVerified: reminder.completeKYC && reminder.completePayout,
            onRefreshUser: hidden => this.refreshUser(hidden),
          }}
          ref={nav => {
            this.navigator = nav;
          }}
        />
        <ToastMessage
          message={toastData.message}
          isVisible={toastData.isShow}
          isError={
            toastData.hasOwnProperty('isError') ? toastData.isError : false
          }
        />

        {/* {Globals.isBuilder && ( */}
        { user.isProfileCompleted && 
          <View
            style={{
              paddingBottom: 100,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
              right: 16,
            }}>
            {(!reminder.completeKYC || !reminder.completePayout) && (
              <ToolTip
                onClickPress={this.onTooltipClick}
                toolTip={this.state.showToolTip}
                placement={'top'}
                renderView={() => this.renderToolTipView()}>
                <View
                  style={{
                    backgroundColor: Color.WHITE,
                    backgroundColor: Color.WHITE,
                    borderRadius: 4,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    elevation: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,
                    zIndex: 999,
                  }}>
                  <TouchableOpacity
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Color.LightBlue,
                    }}
                    onPress={this.onTooltipClick}>
                    <Label color={Color.WHITE} fontSize_16 Montserrat_Medium>
                      {reminderCount}
                    </Label>
                  </TouchableOpacity>
                </View>
              </ToolTip>
            )}
          </View>
        }

        {/* )} */}
      </View>
    );
  }

  onTooltipClick = () => {
    this.setState({
      showToolTip: !this.state.showToolTip,
    });
  };

  showHideToast = response => {
    clearInterval(this.timerInterval);
    const toastData = this.state.toastData;
    toastData.isShow = true;
    toastData.message = response.msg;
    toastData.isError = !response.status;
    this.setState(
      {
        toastData,
      },
      () => {
        toastData.isShow = false;
        toastData.message = '';
        this.timerInterval = setTimeout(() => {
          this.setState({
            toastData,
          });
        }, 3000);
      },
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
