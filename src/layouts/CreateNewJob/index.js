/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  TextInput
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import CheckBox from 'react-native-check-box';
import Label from '../../components/Label';
import Color from '../../utils/color';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderTitle from '../../components/Header/HeaderTitle';
import HeaderRight from '../../components/Header/HeaderRight';
import KMButton from '../../components/KMButton';
import TextField from '../../components/TextField';
import ToastMessage from '../../components/toastmessage';
import DatePicker from 'react-native-datepicker';
import {fontXSmall16, fontLarge24} from '../../utils/theme';
import {
  validateCharacter,
  validatePhone,
  validateEmail,
  validateDecimal,
  validateName,
} from '../../utils/validation';
import {ErrorMessage} from '../../utils/message';
import GlobalStyles from '../../utils/GlobalStyles';
import {Routes} from '../../utils/Routes';
import InputMask from '../../components/InputMask';
import ConfirmModal from '../../components/ConfirmModal';

import Globals, {
  Users,
  isValidValue,
  isValidIntValue,
  getAdminComission,
  getTwoDecimalString,
} from '../../utils/Globals';
import API from '../../API';
import ProgressHud from '../../components/ProgressHud';
import CustomIcon from '../../components/CustomIcon';
import {getUserName} from '../../utils/getUserName';
import ToolTip from '../../components/Tooltip';

let selectClient = '';
let addNewClient = '+ Add New Client';

export default class CreateNewJob extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <HeaderLeft
          iconName={
            navigation.getParam('getTitle') == 'Update Job'
              ? 'left-arrow'
              : 'burger_menu'
          }
          onPress={() => {
            console.log(
              'Title',
              navigation.getParam('getTitle') == 'Update Job',
            );
            navigation.getParam('getTitle') == 'Update Job'
              ? navigation.goBack()
              : navigation.toggleDrawer();
          }}
        />
      ),
      headerTitle: () => (
        <HeaderTitle title={navigation.getParam('getTitle')} />
      ),
      headerRight: (
        <HeaderRight
          buttonTitle="Cancel"
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    const {params = {}} = props.navigation.state;
    console.log('CanEdit', this);
    this.state = {
      dStartDate: "",
      isEdit: false,
      jobDetails: {},
      showConfirm: false,
      isLoading: false,
      isShowClient: false,
      isAddClient: false,
      isContractTeams: false,
      usersList: [],
      searchUserList: [],
      showToolTip: false,
      plans: [],
      client: {
        name: selectClient,
        id: '',
        isValid: false,
      },
      jobTitle: {
        value: '',
        message: '',
        isValid: false,
      },
      jobAmount: {
        value: '',
        message: '',
        isValid: false,
      },
      jobDescription: '',
      firstName: {
        value: '',
        message: '',
        isValid: false,
      },
      lastName: {
        value: '',
        message: '',
        isValid: false,
      },
      email: {
        value: '',
        message: '',
        isValid: false,
      },
      phoneNumber: {
        value: '',
        message: '',
        isValid: false,
      },
      countryCode: Globals.countryCode,
      toastData: {
        isShow: false,
        message: '',
      },
      canEdit: params.isEdit,
      registeredClient: false,
      adminComission: '0',
      builderAmount: '0',
      clientAmount: '0'
    };
  }

  componentDidMount() {
    const {params = {}} = this.props.navigation.state;
    this.props.navigation.setParams({
      getTitle: this.state.canEdit ? 'Update Job' : params.title,
    });
  }

  async getSubscriptionPlans() {
    try {
      let response = await API.getSubscriptionPlans();
      this.setState({isLoading: false});
      console.log('subscription plan response', response);
      if (response.status) {
        this.setState({
          plans: response.data,
        });
      }
    } catch (error) {

    }
  }

  checkRegisteredClient = async phone => {
    const {navigation, screenProps} = this.props;
    const {navigate} = navigation;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});
    try {
      let request = {
        nCountryCode: this.state.countryCode.replace("+", ""),
        nPhoneNumber: phone,
      };

      let response = await API.checkRegisteredClient(request);
      this.setState({isLoading: false});
      console.log('checkRegisteredClient response', response);
      if (response.status) {
        if (response.data) {
          this.setState({
            registeredClient: true,
            client: {
              id: response.data._id,
              name: response.data.name,
              isValid: true,
            },
          });
        }
        screenProps.callback(response)
      } else {
        this.setState({
          registeredClient: false,
          client: {
            name: addNewClient,
            id: '',
            isValid: false,
          },
        });
        response.data && screenProps.callback(response)

      }
    } catch (error) {
      console.log('Edit Job error', error.message);
      this.setState({isLoading: false, registeredClient: false});
    }
  };

  render() {
    const {
      registeredClient,
      isLoading,
      isAddClient,
      isContractTeams,
      isShowClient,
      client,
      jobTitle,
      jobAmount,
      jobDescription,
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      usersList,
      searchUserList,
      toastData,
      canEdit,
      jobDetails,
      dStartDate
    } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <KeyboardAwareScrollView style={{flex: 1}}>
            <View
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 24,
                paddingBottom: 24,
              }}>
              <View>
                <TextField
                  LabelTitle="Job Title*"
                  placeholder="e.g. home extension"
                  onChangeText={this.onJobTitleChange}
                  value={jobTitle.value}
                  autoFocus={true}
                  returnKeyType={'next'}
                  onSubmitEditing={() =>
                    this.jobAmountInput.refs.jobAmountRef.focus()
                  }>
                  {jobTitle.message !== '' && (
                    <View
                      style={
                        Globals.isIpad
                          ? GlobalStyles.errorTxtPad
                          : GlobalStyles.errorTxt
                      }>
                      <CustomIcon
                        name={'warning'}
                        style={{
                          color: Color.Red,
                          fontSize: fontXSmall16,
                          alignItems: 'center',
                        }}
                      />
                      <Label
                        fontSize_14
                        Montserrat_Regular
                        color={Color.DarkGrey}
                        style={{paddingLeft: 10}}>
                        {jobTitle.message}
                      </Label>
                    </View>
                  )}
                </TextField>
              </View>
              <View style={{zIndex: -1, marginBottom: 5}}>
                <TextField
                  type={'custom'}
                  options={{mask: '9999999999999999999999'}}
                  keyboardType={'numeric'}
                  LabelTitle="Job Amount*"
                  placeholder="Enter total cost of job"
                  onFocus={this.getSubscriptionPlans.bind(this)}
                  onChangeText={this.onJobAmountChange}
                  value={jobAmount.value}
                  ref={ref => (this.jobAmountInput = ref)}
                  reference="jobAmountRef"
                  returnKeyType={'next'}
                  onSubmitEditing={() =>
                    this.jobDescriptionInput.refs.jobDescriptionRef.focus()
                  }>
                  {jobAmount.message !== '' && (
                    <View
                      style={
                        Globals.isIpad
                          ? GlobalStyles.errorTxtPad
                          : GlobalStyles.errorTxt
                      }>
                      <CustomIcon
                        name={'warning'}
                        style={{
                          color: Color.Red,
                          fontSize: fontXSmall16,
                          alignItems: 'center',
                        }}
                      />
                      <Label
                        fontSize_14
                        Montserrat_Regular
                        color={Color.DarkGrey}
                        style={{paddingLeft: 10}}>
                        {jobAmount.message}
                      </Label>
                    </View>
                  )}
                </TextField>
              </View>
              
              <View style={{zIndex: -1, marginBottom: 5}}>
                <Label fontSize_16 color={Color.DarkGrey} mb={10}>
                  Start date
                </Label>
                <DatePicker
                style={styles.startDate}
                date={dStartDate}
                mode="date"
                placeholder="DD-MM-YYYY"
                format="DD-MM-YYYY"
                minDate={new Date()}
                customStyles={{
                  dateIcon: {
                    display: 'none',
                  },
                  dateText: {
                    fontSize: fontXSmall16,
                    color: Color.BLACK,
                    fontFamily: 'Montserrat-Regular',
                  },
                  placeholderText: {
                    fontFamily: 'Montserrat-Regular',
                    fontSize: fontXSmall16,
                  },
                  dateInput: {
                    marginLeft: 0,
                    borderRadius: 4,
                    height: 48,
                    alignItems: 'flex-start',
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderColor: Color.LightGrey,
                    fontFamily: 'Montserrat-Regular',
                    fontSize: fontXSmall16,
                  },
                }}
                onDateChange={(date, dateObj) => {
                  this.onStartDateChange(dateObj)
                }}
                />
              </View>

              <View style={styles.labelCss}>
                <Label
                  fontSize_14
                  Montserrat_Medium
                  color={Color.DarkGrey}
                  style={{paddingRight: 8}}>
                  Charge to Client:
                </Label>
                <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                  £ {this.state.clientAmount}
                </Label>
              </View>
              <View style={styles.labelCss}>
                <Label
                  fontSize_14
                  Montserrat_Medium
                  color={Color.DarkGrey}
                  style={{paddingRight: 8}}>
                  Service Fee:
                </Label>
                <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                  £ {this.state.adminComission}
                </Label>
              </View>
              <View style={{backgroundColor: Color.GreyLightColor, height: 1, top: 5}} ></View>
              <View style={styles.labelCss}>
                <Label
                  fontSize_14
                  Montserrat_Bold
                  color={Color.DarkGrey}
                  style={{paddingRight: 8}}>
                  Amount You’ll Receive :
                </Label>
                <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                  £ {this.state.builderAmount}
                </Label>
              </View>
              <View style={{backgroundColor: Color.GreyLightColor, height: 1, top: 5}} ></View>

              <View style={{zIndex: -11}}>
                <TextField
                  multiline
                  LabelTitle="Job Description"
                  placeholder="Write a brief outline of work being carried out"
                  onChangeText={this.onJobDescriptionChange}
                  value={jobDescription}
                  isTooltip={true}
                  customTriangle={{left: '37%'}}
                  toolTipTitle={
                    'Write a description of the job, listing the main tasks you will complete'
                  }
                  customStyle={{
                    height: 96,
                    paddingTop: 10,
                    paddingBottom: 10,
                    textAlignVertical: 'top',
                  }}
                  ref={ref => (this.jobDescriptionInput = ref)}
                  reference="jobDescriptionRef"
                  returnKeyType={'done'}
                />
              </View>
              {/* <View style={{ zIndex: -111 }}> */}
              {/* <TouchableOpacity
                  style={styles.selectBox}
                  onPress={() => this.setState({ isShowClient: !isShowClient })}>
                  <Label
                    fontSize_16
                    Montserrat_Regular
                    color={
                      client.name === selectClient
                        ? Color.LightGrey
                        : Color.BLACK
                    }>
                    {client.name}
                  </Label>
                  <CustomIcon name={'down_arrow'} color={Color.DarkGrey} />
                </TouchableOpacity> */}

              <View style={[styles.selectBox, {fontFamily: 'Montserrat-Regular', fontSize: 16}]}>
                <TextInput
                  onFocus={() => {
                    this.setState({isShowClient: true})
                  }}
                  onChangeText={(text) => {
                    this.searchFilterFunction(text)
                    const client = this.state.client;
                    client.name = text
                    client.isValid = false
                    this.setState({
                      client,
                      isAddClient: false,
                    })
                  }}
                  // onEndEditing={()=>{
                  //   this.setState({ isShowClient: false })
                  // }}
                  placeholderTextColor={Color.LightGrey}
                  placeholder={'Select Client'}
                  value={client.name}
                  style={{fontFamily: 'Montserrat-Regular', fontSize: 16, flex: 1, height: 40}}>
                </TextInput>
                <CustomIcon name={'down_arrow'} color={Color.DarkGrey} />
              </View>


              {isShowClient && (
                <View style={styles.selectDropdown}>
                  <TouchableOpacity onPress={this.onAddNewClientClick}>
                    <Label
                      fontSize_16
                      Montserrat_Medium
                      color={Color.LightBlue}
                      style={{paddingTop: 24, paddingBottom: 10}}>
                      + Add New Client
                    </Label>
                  </TouchableOpacity>
                  <FlatList
                    data={searchUserList}
                    extraData={this.state}
                    renderItem={({item}) => {
                      const clientName =
                        item.userFirstName + ' ' + item.userLastName;
                      return (
                        <TouchableOpacity
                          style={{height: 40, justifyContent: 'center'}}
                          onPress={() =>
                            this.onClientClick(clientName, item._id)
                          }>
                          <Label
                            onPress={() =>
                              this.onClientClick(clientName, item._id)
                            }
                            fontSize_16
                            Montserrat_Regular
                            color={Color.DarkGrey}
                            style={styles.textItem}>
                            {clientName}
                          </Label>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={item => item._id}
                  />
                </View>
              )}
              {/* </View> */}

              {isAddClient && (
                <View style={styles.addNewDetails}>
                  <Label
                    fontSize_16
                    Montserrat_Bold
                    color={Color.BLACK}
                    style={{lineHeight: 24}}
                    mt={24}
                    mb={16}>
                    Add New Client
                  </Label>
                  <View style={{zIndex: -1}}>
                    <InputMask
                      type={'custom'}
                      options={{mask: '9999999999999'}}
                      placeholder="Phone Number"
                      LabelTitle="Phone Number"
                      onChangeText={this.onPhoneNumberChange}
                      value={phoneNumber.value}
                      keyboardType={'phone-pad'}
                      returnKeyType={"done"}
                      customStyle={{width: '77%', height: 48}}
                      isCountryCode={true}
                      reference={ref => (this.phone = ref)}
                      countryCode={countryCode}
                      onSelectCountry={() =>
                        this.setState({countryCode: this.phone.getValue()})
                      }>
                      {phoneNumber.message !== '' && (
                        <View
                          style={
                            Globals.isIpad
                              ? GlobalStyles.errorTxtPad
                              : GlobalStyles.errorTxt
                          }>
                          <CustomIcon
                            name={'warning'}
                            style={{
                              color: Color.Red,
                              fontSize: fontXSmall16,
                              alignItems: 'center',
                            }}
                          />
                          <Label
                            fontSize_14
                            Montserrat_Regular
                            color={Color.DarkGrey}
                            style={{paddingLeft: 10}}>
                            {phoneNumber.message}
                          </Label>
                        </View>
                      )}
                    </InputMask>
                  </View>
                  {!registeredClient && (
                    <View style={{zIndex: -11}}>
                      <TextField
                        placeholder="First Name"
                        LabelTitle="First Name"
                        onChangeText={this.onFirstNameChange}
                        value={firstName.value}>
                        {firstName.message !== '' && (
                          <View
                            style={
                              Globals.isIpad
                                ? GlobalStyles.errorTxtPad
                                : GlobalStyles.errorTxt
                            }>
                            <CustomIcon
                              name={'warning'}
                              style={{
                                color: Color.Red,
                                fontSize: fontXSmall16,
                                alignItems: 'center',
                              }}
                            />
                            <Label
                              fontSize_14
                              Montserrat_Regular
                              color={Color.DarkGrey}
                              style={{paddingLeft: 10}}>
                              {firstName.message}
                            </Label>
                          </View>
                        )}
                      </TextField>
                      <View style={{zIndex: -111}}>
                        <TextField
                          placeholder="Last Name"
                          LabelTitle="Last Name"
                          onChangeText={this.onLastNameChange}
                          value={lastName.value}>
                          {lastName.message !== '' && (
                            <View
                              style={
                                Globals.isIpad
                                  ? GlobalStyles.errorTxtPad
                                  : GlobalStyles.errorTxt
                              }>
                              <CustomIcon
                                name={'warning'}
                                style={{
                                  color: Color.Red,
                                  fontSize: fontXSmall16,
                                  alignItems: 'center',
                                }}
                              />
                              <Label
                                fontSize_14
                                Montserrat_Regular
                                color={Color.DarkGrey}
                                style={{paddingLeft: 10}}>
                                {lastName.message}
                              </Label>
                            </View>
                          )}
                        </TextField>
                      </View>
                      <View style={{zIndex: -1111}}>
                        <TextField
                          LabelTitle="Email"
                          placeholder="Email"
                          onChangeText={this.onEmailChange}
                          autoCapitalize={'none'}
                          value={email.value}
                          keyboardType={'email-address'}>
                          {email.message !== '' && (
                            <View
                              style={
                                Globals.isIpad
                                  ? GlobalStyles.errorTxtPad
                                  : GlobalStyles.errorTxt
                              }>
                              <CustomIcon
                                name={'warning'}
                                style={{
                                  color: Color.Red,
                                  fontSize: fontXSmall16,
                                  alignItems: 'center',
                                }}
                              />
                              <Label
                                fontSize_14
                                Montserrat_Regular
                                color={Color.DarkGrey}
                                style={{paddingLeft: 10}}>
                                {email.message}
                              </Label>
                            </View>
                          )}
                        </TextField>
                      </View>
                    </View>
                  )}
                </View>
              )}
              <TouchableOpacity>
                <CheckBox
                  style={{marginTop: 30}}
                  onClick={() => {
                    this.setState({isContractTeams: !isContractTeams});
                  }}
                  // checkedImage={<CustomIcon style={styles.checkedIcon} name="check" />}
                  // unCheckedImage={<View style={styles.checkIcon}></View>}
                  checkedImage={
                    <CustomIcon name="checked-box" style={styles.checkIcon} />
                  }
                  unCheckedImage={
                    <CustomIcon name="unchecked-box" style={styles.checkIcon} />
                  }
                  isChecked={isContractTeams}
                  rightTextView={
                    <View style={{paddingLeft: 25, paddingRight: 16}}>
                      <Label color={Color.BLACK}>
                        I confirm that I have read, understand and agree to the
                        PongoPay
                        <Label
                          color={Color.LightBlue}
                          onPress={() =>
                            Linking.openURL(Globals.termsServiceUrl)
                          }>
                          {' '}
                          Terms of Service{' '}
                        </Label>
                        including the PongoPay User Agreement and PongoPay
                        Deposit Agreement.
                      </Label>
                      {/* <TouchableOpacity onPress={() => Linking.openURL(Globals.termsServiceUrl)} >
                                                <Label color={Color.LightBlue}>terms and conditions</Label>
                                            </TouchableOpacity> */}
                      {/* <Label color={Color.BLACK}> including the PongoPay User Agreement and PongoPay Escrow Agreement.</Label> */}
                    </View>
                  }
                />
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
          <ToastMessage
            successIconCustom={{fontSize: fontLarge24}}
            massageTextCustom={{
              fontSize: fontXSmall16,
              lineHeight: 24,
              width: '90%',
            }}
            message={toastData.message}
            mainViewCustom={{alignItems: 'center'}}
            isVisible={toastData.isShow}
          />
        </SafeAreaView>
        {canEdit ?
          <View style={{flexDirection: 'row'}}>
            <KMButton
              fontSize_16
              Montserrat_Medium
              color={Color.BLACK}
              title="UPDATE JOB"
              textStyle={{padding: 0}}
              style={[
                GlobalStyles.bottomButtonStyle,
                {
                  borderRadius: 0,
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: this.isSubmitDisable()
                    ? Color.GreyLightColor
                    : Color.Yellow,
                  textcolor: 'white'
                },

              ]}
              disabled={this.isSubmitDisable()}
              onPress={() => {
                this.setState({
                  showConfirm: true,
                  confirmMsg: 'Are you sure you want to update the job details?',
                  confirmFnc: () => this.onEditJobClick(),
                  hideFnc: () => this.setState({showConfirm: false})
                })
              }}

            />
            <View style={{width: 1, height: 64}} />
            <KMButton
              fontSize_16
              Montserrat_Medium
              color={Color.BLACK}
              title="DELETE JOB"
              textStyle={{padding: 0}}
              style={[
                GlobalStyles.bottomButtonStyle,
                {
                  borderRadius: 0,
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red',
                  color: 'white'
                },
              ]}
              onPress={() => {
                this.setState({
                  showConfirm: true,
                  confirmMsg: 'Are you sure you want to delete this job?',
                  confirmFnc: () => this.onDeleteJob(jobDetails._id),
                  hideFnc: () => this.setState({showConfirm: false})
                })
              }
              }
            />
          </View>
          :
          <KMButton
            fontSize_16
            Montserrat_Medium
            color={Color.BLACK}
            title={'CREATE JOB'}
            textStyle={{padding: 0}}
            style={[
              GlobalStyles.bottomButtonStyle,
              {
                backgroundColor: this.isSubmitDisable()
                  ? Color.GreyLightColor
                  : Color.Yellow,
              },
            ]}
            disabled={this.isSubmitDisable()}
            onPress={
              this.onCreateJobClick
            }
          />
        }
        {isLoading && <ProgressHud />}
        <NavigationEvents onWillFocus={this.getAllDetails} />
        <ConfirmModal show={this.state.showConfirm}
          onHide={this.state.hideFnc}
          onConfirm={() => {
            this.setState({showConfirm: false})
            this.state.confirmFnc()
          }}
          msg={this.state.confirmMsg} />
      </View>
    );
  }

  getAllDetails = () => {
    this.getUserDetails();
    const {params = {}} = this.props.navigation.state;
    this.setState(
      {
        jobDetails: params.jobDetails,
        // modificationRequestId: params ?.modificationRequestId
      },
      () => {
        const {jobDetails} = this.state;
        console.log('JOB DETAILS', jobDetails);
        if (jobDetails) {
          let isEdit = true;

          const jobTitle = this.state.jobTitle;
          jobTitle.value = jobDetails.sJobTitle;
          jobTitle.isValid = isValidValue(jobDetails.sJobTitle);

          const jobAmount = this.state.jobAmount;
          isValidValue(jobDetails.nJobAmount) && (jobAmount.value = jobDetails.nJobAmount.toString());
          jobAmount.isValid = isValidIntValue(jobDetails.nJobAmount);
          if (this.state.canEdit) {
            this.setState({
              adminComission: getTwoDecimalString(jobDetails.nAdminComission),
              builderAmount: getTwoDecimalString(jobDetails.nJobBuilderAmount),
              clientAmount: getTwoDecimalString(jobDetails.nJobAmount)
            });
          }

          const jobDescription = jobDetails?.sJobDescription?.toString();
          jobDetails.dStartDate && this.setState({dStartDate: new Date(jobDetails.dStartDate)})

          this.onClientClick(
            getUserName(jobDetails.Client),
            jobDetails.Client._id,
          );

          // const firstName = this.state.firstName
          // firstName.value = jobDetails.Client.sFirstName
          // firstName.isValid = isValidValue(jobDetails.Client.sFirstName)
          // const lastName = this.state.lastName
          // lastName.value = jobDetails.Client.sLastName
          // lastName.isValid = isValidValue(jobDetails.Client.sLastName)
          // const email = this.state.email
          // email.value = jobDetails.Client.sEmail
          // email.isValid = isValidValue(jobDetails.Client.sEmail)
          // const phoneNumber = this.state.phoneNumber
          // phoneNumber.value = jobDetails.Client.nPhoneNumber
          // phoneNumber.isValid = isValidValue(jobDetails.Client.nPhoneNumber)
          // let countryCode = jobDetails.Client.nCountryCode

          let isContractTeams = true;

          this.setState({
            isEdit,
            jobTitle,
            jobAmount,
            jobDescription,
            // firstName,
            // lastName,
            // email,
            // countryCode,
            // phoneNumber,
            isContractTeams,
          });
        }
      },
    );
  };
  onDeleteJob = async (jobId) => {
    this.setState({isLoading: true});
    try {
      let request = {
        jobId: jobId,
      };

      console.log("param", request)

      let response = await API.deleteJob(request)
      this.setState({isLoading: false});
      console.log("deleteJob response", response)
      const {screenProps} = this.props;
      if (!screenProps.isConnected) {
        return
      }
      screenProps.callback(response)
      if (response.status) {
        this.props.navigation.navigate(Routes.Job_Listing)
      }

    } catch (error) {
      console.log("cancelJob error", error.message);
      const {screenProps} = this.props;
      if (!screenProps.isConnected) {
        return
      }
      screenProps.callback(ErrorResponse)
      this.setState({isLoading: false});
    }
  }

  getUserDetails = async () => {
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});

    try {
      let request = {
        userRoleId: Users.CLIENT,
      };

      let response = await API.getClients(request);
      this.setState({isLoading: false});
      console.log('getUser response', response);
      if (response.status) {
        this.setState({
          usersList: response.data.users,
          searchUserList: response.data.users,
        });
      }
    } catch (error) {
      console.log('getUser error', error.message);
      this.setState({isLoading: false});
    }
  };

  searchFilterFunction = (text) => {
    const newData = this.state.usersList.filter((item) => {
      const itemData =
        `${item.userFirstName.toUpperCase()}` + ' ' +
        `${item.userLastName.toUpperCase()}`;

      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      searchUserList: newData
    })
  };

  onAddNewClientClick = () => {
    const client = this.state.client;
    client.name = addNewClient;

    this.setState({
      isAddClient: true,
      client,
      isShowClient: false,
    });
  };

  onClientClick = (clientName, clientId) => {
    console.log(clientName, clientId);
    const client = this.state.client;
    client.name = clientName;
    client.id = clientId;
    client.isValid = true;

    if(clientName === "PongoPay Reward"){
      this.onJobTitleChange("PongoPay Reward");
      this.onJobAmountChange("30");
      this.onJobDescriptionChange('PongoPay reward scheme');
    }
    
    this.setState({
      isAddClient: false,
      client,
      isShowClient: false,
    });
  };

  onJobTitleChange = text => {
    const jobTitle = this.state.jobTitle;
    jobTitle.value = text;

    if (jobTitle.value.length == 0 || jobTitle.value == '') {
      jobTitle.message = ErrorMessage.jobTitleRequired;
      jobTitle.isValid = false;
    }
    // else if (!validateCharacter(jobTitle.value)) {
    //     jobTitle.message = ErrorMessage.firstNameInvalid
    //     jobTitle.isValid = false
    // }
    else {
      jobTitle.message = '';
      jobTitle.isValid = true;
    }
    this.setState({
      jobTitle,
    });
  };

  onJobAmountChange = text => {
    let {jobAmount, adminComission} = this.state
    jobAmount.value = text;
    if (jobAmount.value.length == 0 || jobAmount.value == '') {
      jobAmount.message = ErrorMessage.jobAmountRequired;
      jobAmount.isValid = false;
    } else if (!validateDecimal(jobAmount.value)) {
      jobAmount.message = 'Invalid value';
      jobAmount.isValid = false;
    } else {
      jobAmount.message = '';
      jobAmount.isValid = true;
    }

    adminComission = getAdminComission(jobAmount.value, this.state.plans)
    this.setState({
      jobAmount,
      adminComission: getTwoDecimalString(adminComission),
      builderAmount: getTwoDecimalString((parseFloat(jobAmount.value) - parseFloat(adminComission))),
      clientAmount: getTwoDecimalString((parseFloat(jobAmount.value)))
    });
  };

  onJobDescriptionChange = text => {
    this.setState({
      jobDescription: text,
    });
  };

  onStartDateChange = date =>{
    this.setState({dStartDate: new Date(date)})
  }

  onFirstNameChange = text => {
    const firstName = this.state.firstName;
    firstName.value = text;

    if (firstName.value.length == 0 || firstName.value == '') {
      firstName.message = ErrorMessage.firstNameRequired;
      firstName.isValid = false;
    } else if (!validateName(firstName.value)) {
      firstName.message = ErrorMessage.firstNameInvalid;
      firstName.isValid = false;
    } else {
      firstName.message = '';
      firstName.isValid = true;
    }
    this.setState({
      firstName,
    });
  };

  onLastNameChange = text => {
    const lastName = this.state.lastName;
    lastName.value = text;

    if (lastName.value.length == 0 || lastName.value == '') {
      lastName.message = ErrorMessage.lastNameRequired;
      lastName.isValid = false;
    } else if (!validateName(lastName.value)) {
      lastName.message = ErrorMessage.lastNameInvalid;
      lastName.isValid = false;
    } else {
      lastName.message = '';
      lastName.isValid = true;
    }
    this.setState({
      lastName,
    });
  };

  onEmailChange = text => {
    const email = this.state.email;
    email.value = text.trim();

    if (email.value.length == 0 || email.value == '') {
      email.message = ErrorMessage.emailRequired;
      email.isValid = false;
    } else if (!validateEmail(email.value)) {
      email.message = ErrorMessage.emailInvalid;
      email.isValid = false;
    } else {
      email.message = '';
      email.isValid = true;
    }
    this.setState({
      email,
    });
  };

  onPhoneNumberChange = text => {
    const phoneNumber = this.state.phoneNumber;
    phoneNumber.value = text.trim();
    let client = {
      id: '',
      name: addNewClient,
      isValid: false,
    };
    if (phoneNumber.value.length == 0 || phoneNumber.value == '') {
      phoneNumber.message = ErrorMessage.phoneRequired;
      phoneNumber.isValid = false;
    } else if (!validatePhone(phoneNumber.value)) {
      phoneNumber.message = ErrorMessage.phoneInvalid;
      phoneNumber.isValid = false;
    } else {
      this.checkRegisteredClient(text);
      phoneNumber.message = '';
      phoneNumber.isValid = true;
    }
    let state = {
      phoneNumber,
    };
    if (!phoneNumber.isValid) {
      state['client'] = client;
    }
    this.setState(state);
  };

  isSubmitDisable() {
    const {
      isAddClient,
      registeredClient,
      jobTitle,
      jobAmount,
      firstName,
      lastName,
      email,
      phoneNumber,
      isContractTeams,
      client,
    } = this.state;
    if (isAddClient && !registeredClient) {
      return (
        !jobTitle.isValid ||
        !jobAmount.isValid ||
        !firstName.isValid ||
        !lastName.isValid ||
        !email.isValid ||
        !phoneNumber.isValid ||
        !isContractTeams
      );
    } else {
      return (
        !jobTitle.isValid ||
        !jobAmount.isValid ||
        !client.isValid ||
        !isContractTeams
      );
    }
  }

  onCreateJobClick = async () => {
    const {navigation, screenProps} = this.props;
    const {navigate} = navigation;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});

    const {
      registeredClient,
      jobTitle,
      jobAmount,
      jobDescription,
      client,
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      adminComission,
      builderAmount
    } = this.state;

    try {
      let request = {
        jobTitle: jobTitle.value,
        jobAmount: jobAmount.value,
        jobDescription,
        nJobBuilderAmount: parseFloat(builderAmount),
        nAdminComission: parseFloat(adminComission)
      };
      if(this.state.dStartDate) request.dStartDate = this.state.dStartDate;
      if (client.id) {
        request.clientId = client.id;
        request.registeredClient = registeredClient;
      } else {
        request.clientFirstName = firstName.value;
        request.clientLastName = lastName.value;
        request.clientEmail = email.value;
        request.clientPhoneNo = phoneNumber.value;
        request.clientCountryCode = countryCode.replace("+", "");
      }
      console.log('createJob request', request);

      let response = await API.createJob(request);
      this.setState({isLoading: false});
      console.log('createJob response', response);
      //screenProps.callback(response);
      if (response.status) {
        navigate(Routes.Job_Details, {
          jobId: response.data._id,
          isJobAccepted: true,
        });
      } else {
        let {screenProps} = this.props;
        if (!screenProps.isConnected) {
          return;
        }
        // this.props.navigation.goBack();
      }
    } catch (error) {
      console.log('createJob error', error.message);
      this.setState({isLoading: false});
    }
  };
  onEditJobClick = async () => {
    const {navigation, screenProps} = this.props;
    const {navigate} = navigation;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true, showConfirm: false});

    const {
      jobTitle,
      jobAmount,
      jobDescription,
      client,
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      jobDetails,
      adminComission,
      builderAmount,
      // modificationRequestId
    } = this.state;
    try {
      let request = {
        jobId: jobDetails._id,
        jobTitle: jobTitle.value,
        jobAmount: jobAmount.value,
        jobDescription,
        nJobBuilderAmount: parseFloat(builderAmount),
        nAdminComission: parseFloat(adminComission)
      }
      if (client.id) {
        request.clientId = client.id;
      } else {
        request.clientFirstName = firstName.value;
        request.clientLastName = lastName.value;
        request.clientEmail = email.value;
        request.clientPhoneNo = phoneNumber.value;
        request.clientCountryCode = countryCode;
      }
      // if (modificationRequestId) {
      //   request.modificationRequestId = modificationRequestId;
      // }

      let response = await API.editJob(request);
      this.setState({isLoading: false});
      console.log('editjob response', response);
      if (response.status) {
        this.showHideToast(response);
        navigate(Routes.Job_Details, {
          jobId: response.data._id,
          isJobAccepted: true,
        });
      } else {
        let {screenProps} = this.props;
        if (!screenProps.isConnected) {
          return;
        }
        screenProps.callback(response);
        // this.props.navigation.goBack();
      }
    } catch (error) {
      console.log('Edit Job error', error.message);
      this.setState({isLoading: false});
    }
  };
  showHideToast = response => {
    const toastData = this.state.toastData;
    toastData.isShow = true;
    toastData.message = response.msg;
    this.setState(
      {
        toastData,
      },
      () => {
        toastData.isShow = false;
        toastData.message = '';
        setTimeout(() => {
          this.setState({
            toastData,
          });
        }, 5000);
      },
    );
  };
}
