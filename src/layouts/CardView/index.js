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
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
  Linking
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import Color from '../../utils/color';
import styles from './styles';
import Globals, {
  isValidIntValue,
  Users,
  isValidValue,
  Accounts,
  afterSuccessLogin,
  PAYMENT_TYPE,
  getKycRoute,  
} from '../../utils/Globals';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckBox from 'react-native-check-box';

import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderTitle from '../../components/Header/HeaderTitle';
import HeaderRight from '../../components/Header/HeaderRight';
import ProgressHud from '../../components/ProgressHud';

import {fontNormal20, fontXSmall16} from '../../utils/theme';
import KMButton from '../../components/KMButton';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import API from '../../API';
import Mangopay from '../../utils/mangopay';
import RadioButton from '../../components/RadioButton';
import Label from '../../components/Label';
import {ErrorMessage} from '../../utils/message';
import {getStoredData} from '../../utils/store';
import GlobalStyles from '../../utils/GlobalStyles';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import BankListing from '../../components/BankListing';
import CustomIcon from "../../components/CustomIcon";

export default class Payment extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: null,
      headerTitle: () => <HeaderTitle title={'Payment'} />,
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
    this.state = {
      valid: false, // will be true once all fields are "valid" (time to enable the submit button)
      values: {},
      status: {},
      savedCards: [],
      selectedCard: undefined,
      selectedView: 0,
      loading: true,
      onlineTransfer: undefined,
      expanded: true,
      showBank: false,
      isTrueLayerTerms: false
    };
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
    } catch (error) {}
  }

  async componentDidMount() {
    let cards = await Mangopay.getCardsOfUser();
    if (cards.length > 0) {
      let savedCards = [];
      cards.map(card => {
        if (
          !savedCards.some(c => c.Alias === card.Alias) &&
          card.Validity === 'VALID' &&
          card.Active
        ) {
          savedCards.push(card);
        }
        this.setState({
          savedCards,
          loading: false,
        });
      });
    }
  }

  _onChange(e) {
    this.setState({
      selectedCard: undefined,
      values: e.values,
      valid: e.valid,
    });
  }

  isVerifiedUser = async () => {
    let {selectedView} = this.state;
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }
    let verified = () => {
      if (screenProps.isVerified) {
        return true;
      } else {
        return selectedView !== 1;
      }
    };
    if (!verified()) {
      this.cardRef.setValues({
        number: '',
        expiry: '',
        cvc: '',
      });
      const {navigate} = this.props.navigation;
      let user = await getStoredData(Globals.kUserData);
      let routeName = await getKycRoute('bank', user);
      navigate(routeName);
    }
    return verified();
  };

  async onPay() {
    let paymentDetails = {};
    let paymentType = '';

    if (this.state.selectedView == 0) {
      paymentType = PAYMENT_TYPE.BANK;
      paymentDetails = {
        onlineTransfer: true,
      };
      //provider_id

      // OPEN MODAL AND SELECT BANK

      this.setState({
        showBank: true,
      });
    } else if (this.state.selectedView == 1) {
      paymentType = PAYMENT_TYPE.CARD;
      paymentDetails = this.state.selectedCard
        ? {cardId: this.state.selectedCard}
        : this.state.values;
      let verified = true;
      if (verified) {
        this.props.navigation.state.params.onGoBack &&
          this.props.navigation.state.params.onGoBack(
            paymentType,
            paymentDetails,
            verified,
          );
        this.props.navigation.goBack();
      }
    } else if (this.state.selectedView == 2) {
      paymentType = PAYMENT_TYPE.BANK;
      paymentDetails = {onlineTransfer: false};

      let verified = true;
      if (verified) {
        this.props.navigation.state.params.onGoBack &&
          this.props.navigation.state.params.onGoBack(
            paymentType,
            paymentDetails,
            verified,
          );
        this.props.navigation.goBack();
      }
    }
  }

  render() {
    const {
      loading,
      selectedCard,
      savedCards,
      bankAccount,
      selectedView,
    } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <SafeAreaView style={styles.safeVStyle}>
            <View
              style={{
                alignSelf: 'center',
                marginTop: 10,
                width: '90%',
                flexDirection: 'column',
                zIndex: 1,
              }}>
              {/* <RadioButton
                            title={'Pay via Bank Transfer (Preferred Method)'}
                            textStyle={{ fontSize: fontNormal20, fontFamily: 'Montserrat-Medium' }}
                            onChange={() => this.setState({ selectedView: 0 })}
                            selected={this.state.selectedView == 0} /> */}
              <RadioButton
                title={'Pay via Bank Transfer (Preferred Method)'}
                textStyle={{
                  fontSize: fontNormal20,
                  fontFamily: 'Montserrat-Medium',
                }}
                onChange={() =>
                  this.setState({
                    onlineTransfer: true,
                    selectedView: 0,
                  })
                }
                selected={this.state.selectedView == 0}
              />
              
              {/* <View style={{
                            
                        }} /> */}

              <View
                style={{
                  marginTop: 10,
                  width: '100%',
                  alignSelf: 'center',
                  borderStyle: 'solid',
                  borderWidth: 0.8,
                  borderColor: Color.Grey,
                }}
              />

              <Collapse
                isExpanded={this.state.expanded}
                onToggle={isExpanded =>
                  this.setState({
                    expanded: isExpanded,
                  })
                }>
                <CollapseHeader
                  style={[
                    styles.headerStyle,
                    {
                      flex: 1,
                      alignItems: 'center',
                      flexDirection: 'row',
                    },
                  ]}>
                  <Image
                    style={{
                      marginHorizontal: 5,
                      marginVertical: 10,
                      width: 20,
                      height: 20,
                    }}
                    source={
                      this.state.expanded
                        ? require('./../../assets/Images/icon_expand_right.png')
                        : require('./../../assets/Images/icon_expand_down.png')
                    }
                  />
                  <Label fontSize_18 Montserrat_Medium color={Color.DarkGrey}>
                    {'More Payment Methods'}
                  </Label>
                </CollapseHeader>
              </Collapse>

              {!this.state.expanded && (
                <CollapseBody
                  style={{
                    marginVertical: 10,
                    width: '100%',
                  }}>
                  <RadioButton
                    title={'Pay via Card'}
                    textStyle={{
                      fontSize: fontNormal20,
                      fontFamily: 'Montserrat-Medium',
                    }}
                    onChange={() =>
                      this.setState({
                        selectedView: 1,
                      })
                    }
                    selected={this.state.selectedView == 1}
                  />
                  <View
                    style={{
                      marginVertical: 10,
                      width: '100%',
                      alignSelf: 'center',
                      borderStyle: 'solid',
                      borderWidth: 0.8,
                      borderColor: Color.Grey,
                    }}
                  />

                  <RadioButton
                    title={
                      'Leave App to Make a Manual BACS Transfer from Account'
                    }
                    textStyle={{
                      fontSize: fontNormal20,
                      fontFamily: 'Montserrat-Medium',
                    }}
                    onChange={() =>
                      this.setState({
                        onlineTransfer: false,
                        selectedView: 2,
                      })
                    }
                    selected={this.state.selectedView == 2}>
                    {this.state.selectedView == 2 && 
                      <Label
                      mr={10}
                      mt={5}
                      fontSize_16
                      Montserrat_Medium
                      color={Color.Grey}>
                      Leave the app to transfer funds manually from your bank
                      account into the safe deposit box.
                    </Label>}
                    
                  </RadioButton>
                </CollapseBody>
              )}

              {/* {selectedView != 1 &&
                            <View style={{ marginVertical: 10, width: '100%', alignSelf: 'center', height: 1, backgroundColor: Color.LightGrey }}></View>
                        } */}
            </View>

            {/* <View style={{ marginHorizontal: 20, marginTop: 60, marginBottom: 10 }} >
                        <Label fontSize_14 Montserrat_Medium color={Color.Red} >{this.state.selectedView == 1 ? `*Please Note: ${ErrorMessage.cardUsegeWarning}` : `*Please Note: ${ErrorMessage.bankUsageWarning}`}</Label>
                    </View> */}
            {this.state.selectedView == 1 && (
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                <Label
                  fontSize_14
                  Montserrat_Medium
                  color={Color.Red}>{`*Please Note: ${
                  ErrorMessage.cardUsegeWarning
                }`}</Label>
                <Label
                  fontSize_14
                  Montserrat_Medium
                  color={Color.Red}>{`\n*Please Note: Card payments may appear on your statement as MANGOPAY.`}</Label>
              </View>
            )}

            <View style={{flex: 1}}>
              {/* {selectedView == 0 && !loading &&
                                < View style={{
                                    marginTop: 40,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                }}> */}
              {/* {!bankAccount ?
                                        <View>
                                            <Label Montserrat_Medium style={{ textAlign: "center", fontSize: 14, color: Color.LightGrey }}>There is no bank account details added in your profile. Please add it in your profile.</Label>
                                            <Label Montserrat_Medium style={{ textAlign: "center", marginTop: 5, fontSize: 14, color: Color.LightGrey }}>You can still make a payment using Card in next tab.</Label>
                                        </View>
                                        :
                                        <View>
                                            <Label fontSize_18 Montserrat_Bold mb={18}>Bank Details</Label>
                                            <Label fontSize_14 light mb={18}>Account Number: {bankAccount.AccountNumber}</Label>
                                            <Label fontSize_14 light mb={18}>Sort Code: {bankAccount.SortCode}</Label>
                                        </View>
                                    } */}
              {/* </View>
                        } */}

              {selectedView === 1 && (
                <View>
                  <View style={styles.informationDetails}>
                    <View
                      style={{
                        width: Globals.isIpad ? 400 : '100%',
                      }}>
                      <CreditCardInput
                        ref={input => (this.cardRef = input)}
                        additionalInputsProps={{
                          number: {
                            returnKeyType: 'done',
                          },
                          expiry: {
                            returnKeyType: 'done',
                          },
                          cvc: {
                            returnKeyType: 'done',
                          },
                        }}
                        inputStyle={{
                          color: '#606060',
                          fontWeight: '500',
                          borderWidth: 1,
                          borderColor: '#cccccc',
                          paddingLeft: 8,
                          marginTop: 10,
                          borderRadius: 5,
                          height: 48,
                          fontFamily: 'Montserrat-Regular',
                        }}
                        placeholderColor="#CCCCCC"
                        cardFontFamily="Montserrat-Regular"
                        labelStyle={{
                          fontSize: 16,
                          fontFamily: 'Montserrat-Regular',
                          fontWeight: '400',
                          color: '#606060',
                        }}
                        labels={{
                          number: 'Card Number',
                          expiry: 'Expiry',
                          cvc: 'CVV',
                        }}
                        placeholders={{
                          number: 'Card Number',
                          expiry: 'MM YY',
                          cvc: 'CVV',
                        }}
                        inputContainerStyle={{
                          borderWidth: 0,
                        }}
                        onChange={this._onChange.bind(this)}
                      />
                    </View>
                  </View>
                  {savedCards.length > 0 && (
                    <View
                      style={{
                        paddingLeft: 20,
                        marginVertical: 30,
                      }}>
                      <Label fontSize_14 Montserrat_Bold mb={18}>
                        Previously used cards
                      </Label>
                      {savedCards.map(card => {
                        return (
                          <RadioButton
                            title={card.Alias}
                            onChange={() =>
                              this.setState({
                                selectedCard: card.Id,
                                valid: true,
                              })
                            }
                            selected={card.Id === selectedCard}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              )
              // :
              // remove condition
              // <View>
              //     <View style={{
              //         marginTop: 20,
              //         paddingLeft: 20,
              //         paddingRight: 10,
              //         width: '100%',
              //         alignSelf: 'center'
              //     }}>
              //         <RadioButton
              //             title={'Make in-App Transfer Now (Recommended)'}
              //             textStyle={{ fontSize: fontNormal20, fontFamily: 'Montserrat-Medium' }}
              //             onChange={() => this.setState({ onlineTransfer: true })}
              //             selected={this.state.onlineTransfer == true} >
              //             <Label fontSize_16 Montserrat_Medium color={Color.Grey} style={{ paddingVertical: 5, }}>Transfer funds directly into the safe deposit box from your account without having to leave the app.</Label>
              //         </RadioButton>

              //         {/* <View style={{ marginVertical: 10, width: '100%', alignSelf: 'center', height: 1, backgroundColor: Color.LightGrey }}></View> */}
              //         {/*
              //         <RadioButton style={{ marginBottom: 30 }}
              //             title={'Leave App to Make a Manual BACS Transfer from Account'}
              //             textStyle={{ fontSize: fontNormal20, fontFamily: 'Montserrat-Medium' }}
              //             onChange={() => this.setState({ onlineTransfer: false })}
              //             selected={this.state.onlineTransfer == false}>
              //             <Label fontSize_16 Montserrat_Medium color={Color.Grey} >Leave the app to transfer funds manually from your bank account into the safe deposit box.</Label>
              //         </RadioButton> */}
              //     </View>
              // </View>
              }
            </View>
          </SafeAreaView>
        </KeyboardAwareScrollView>
        <View>
          {selectedView == 0 &&
          <View
          style={{
            paddingLeft: 16,
            paddingRight: 16,
          }}>
            <CheckBox                        
          style={{marginBottom: 20}}
          onClick={() => {
            this.setState({
              isTrueLayerTerms: !this.state.isTrueLayerTerms,
            });
          }}
          isChecked={this.state.isTrueLayerTerms}
          checkedImage={
            <CustomIcon
              name="checked-box"
              style={styles.checkIcon}
            />
          }
          unCheckedImage={
            <CustomIcon
              name="unchecked-box"
              style={styles.checkIcon}
            />
          }
          rightTextView={
            <View
              style={{
                paddingLeft: 25,
              }}>
              <Label color={Color.BLACK}>
              By continuing you are permitting TrueLayer to initiate a payment from your bank account. You also agree to our{' '}
              </Label>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(Globals.trueLayerTermsOfServiceUrl)
                  }>
                  <Label color={Color.LightBlue}>
                    End User Terms of Service{' '}
                  </Label>
                </TouchableOpacity>
                <Label color={Color.BLACK}>                                
                  and{' '}
                </Label>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(Globals.trueLayerPrivacyPolicyUrl)
                  }>
                  <Label color={Color.LightBlue}>
                    Privacy Policy
                  </Label>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
          </View>
          }
          <Label
            align="center"
            fontSize_16
            mb={16}
            ml={16}
            mr={16}
            color={Color.DarkGrey}>
            {
              'You also permit your funds to be automatically released from the Safe Deposit Box 24 hours after a payment release request if you do not respond.'
            }
          </Label>
          <KMButton
            disabled={this.setDisable()}
            title={'PAY NOW'}
            // style={[styles.button, { height: 55, marginBottom: (Platform.OS === 'ios') ? 0 : 10, backgroundColor: !this.setDisable() ? Color.Yellow : Color.GreyLightColor }]}
            style={[
              GlobalStyles.bottomButtonStyle,
              {
                backgroundColor: !this.setDisable()
                  ? Color.Yellow
                  : Color.GreyLightColor,
              },
            ]}
            textStyle={{
              color: Color.BLACK,
              fontSize: fontXSmall16,
              fontFamily: 'Montserrat-Medium',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => this.onPay()}
          />
        </View>
        <BankListing
          msg={'Select bank'}
          show={this.state.showBank}
          onHide={() => {
            this.setState({
              showBank: false,
            });
          }}
          onBankClick={item => {
            console.log('===== item ===', item);

            this.setState(
              {
                showBank: false,
              },
              () => {
                let verified = true;
                var paymentType = PAYMENT_TYPE.BANK;
                var paymentDetails = {
                  onlineTransfer: true,
                };
                var providerId = item.provider_id;

                if (verified) {
                  this.props.navigation.state.params.onGoBack &&
                    this.props.navigation.state.params.onGoBack(
                      paymentType,
                      paymentDetails,
                      verified,
                      providerId,
                    );
                  this.props.navigation.goBack();
                }
              },
            );
          }}
        />

        <NavigationEvents onWillFocus={this.getUserData} />
      </View>
    );
  }

  canPay() {
    // let { selectedView, bankAccount } = this.state
    // if (selectedView === 0) {
    //     return bankAccount != undefined
    // } else {
    return true;
    // }
  }

  setDisable() {
    if (this.state.selectedView == 0 && !this.state.isTrueLayerTerms) {
      return !this.state.valid;
    }
    if (this.state.selectedView == 1) {
      return !this.state.valid;
    }
  }
}
