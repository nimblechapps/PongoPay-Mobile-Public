/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import CheckBox from "react-native-check-box";
import Label from '../../components/Label';
import Color from '../../utils/color'
import styles from "./styles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderTitle from '../../components/Header/HeaderTitle';
import HeaderRight from '../../components/Header/HeaderRight';
import KMButton from "../../components/KMButton"
import TextField from '../../components/TextField';
import ToastMessage from '../../components/toastmessage';
import { fontXSmall16, fontLarge24 } from '../../utils/theme';
import { validateCharacter, validatePhone, validateEmail, validateName } from '../../utils/validation';
import { ErrorMessage } from '../../utils/message';
import GlobalStyles from '../../utils/GlobalStyles';
import { Routes } from '../../utils/Routes';
import InputMask from '../../components/InputMask';
import Globals from '../../utils/Globals';
import API from '../../API';
import ProgressHud from '../../components/ProgressHud';
import CustomIcon from "../../components/CustomIcon";

export default class EditJob extends Component {

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
            headerTitle: () => <HeaderTitle title={"Update Job"} />,
            headerRight: (
                <HeaderRight
                    buttonTitle="Cancel"
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            ),
        }
    };

    constructor(props) {
        const { params = {} } = this.props.navigation.state;

        super(props)
        this.state = {
            isLoading: false,
            isShowToast: false,
            selectedClient: "Select Client",
            isShowClient: false,
            isAddClient: false,
            isContractTeams: false,

            jobTitle: {
                value: "",
                message: "",
                isValid: false,
            },
            contractAmount: {
                value: "",
                message: "",
                isValid: false,
            },
            firstName: {
                value: "",
                message: "",
                isValid: false,
            },
            lastName: {
                value: "",
                message: "",
                isValid: false,
            },
            email: {
                value: "",
                message: "",
                isValid: false,
            },
            phoneNumber: {
                value: "",
                message: "",
                isValid: false,
            },
            countryCode: Globals.countryCode,
            jobDetails: params.jobDetails

        }
    }
    render() {
        const { navigate } = this.props.navigation;
        const { isLoading, isAddClient, isContractTeams, isShowClient, selectedClient, jobTitle, contractAmount, firstName, lastName, email, countryCode, phoneNumber } = this.state;

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 24, paddingBottom: 24, }}>
                            <View>
                                <TextField
                                    LabelTitle='Job Title*'
                                    placeholder='Job Title'
                                    onChangeText={this.onJobTitleChange}
                                    value={jobTitle.value}
                                    autoFocus={true}
                                >
                                    {jobTitle.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{jobTitle.message}</Label>
                                        </View>
                                    }
                                </TextField>
                            </View>
                            <View style={{ zIndex: -1, marginBottom: 5, }}>
                                <InputMask
                                    type={'custom'}
                                    options={{ mask: '9999999999999999999999' }}
                                    keyboardType={"numeric"}
                                    returnKeyType="done"
                                    LabelTitle='Amount*'
                                    placeholder='Amount'
                                    onChangeText={this.onContractAmountChange}
                                    value={contractAmount.value}
                                >
                                    {contractAmount.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{contractAmount.message}</Label>
                                        </View>
                                    }

                                </InputMask>
                            </View>
                            {/* <View style={{ zIndex: -11 }}>
                                <TextField
                                    multiline
                                    LabelTitle='Description'
                                    placeholder='Write here…'
                                    customStyle={{ height: 96, paddingTop: 10, paddingBottom: 10, textAlignVertical: 'top' }}
                                />
                            </View> */}
                            <View style={{ zIndex: -111 }}>
                                <TouchableOpacity style={styles.selectBox}
                                    onPress={() => this.setState({ isShowClient: !isShowClient })}>
                                    <Label fontSize_16 Montserrat_Regular color={selectedClient === "Select Client" ? Color.LightGrey : Color.BLACK}>{selectedClient}</Label>
                                    <CustomIcon name={'down_arrow'} color={Color.DarkGrey} />
                                </TouchableOpacity>

                                {isShowClient &&
                                    <View style={styles.selectDropdown}>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ isAddClient: true, selectedClient: "+ Add New Client", isShowClient: false })}>
                                            <Label fontSize_16 Montserrat_Medium color={Color.LightBlue} style={{ paddingTop: 24, paddingBottom: 24, }}>+ Add New Client</Label>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ isAddClient: false, selectedClient: "Melissa E. Outland", isShowClient: false })}>
                                            <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey} style={styles.textItem}>Melissa E. Outland</Label>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ isAddClient: false, selectedClient: "Lottie S. Chandler", isShowClient: false })}>
                                            <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey} style={styles.textItem}>Lottie S. Chandler</Label>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ isAddClient: false, selectedClient: "Roger M. Bentley", isShowClient: false })}>
                                            <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey} style={styles.textItem}>Roger M. Bentley</Label>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ isAddClient: false, selectedClient: "Marcus M. Espinosa", isShowClient: false })}>
                                            <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey} style={styles.textItem}>Marcus M. Espinosa</Label>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ isAddClient: false, selectedClient: "Roger M. Bentley", isShowClient: false })}>
                                            <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey} style={styles.textItem}>Roger M. Bentley</Label>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ isAddClient: false, selectedClient: "Robert T. Cohen", isShowClient: false })}>
                                            <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey} style={styles.textItem}>Robert T. Cohen</Label>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>

                            {isAddClient &&
                                <View style={styles.addNewDetails}>
                                    <Label fontSize_16 Montserrat_Bold color={Color.BLACK} style={{ lineHeight: 24, }} mt={24} mb={16} >Add New Client</Label>

                                    <TextField
                                        placeholder='First Name'
                                        LabelTitle='First Name'
                                        onChangeText={this.onFirstNameChange}
                                        value={firstName.value}
                                    >
                                        {firstName.message !== "" &&
                                            <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{firstName.message}</Label>
                                            </View>
                                        }
                                    </TextField>
                                    <View style={{ zIndex: -1 }}>
                                        <TextField
                                            placeholder='Last Name'
                                            LabelTitle='Last Name'
                                            onChangeText={this.onLastNameChange}
                                            value={lastName.value}
                                        >
                                            {lastName.message !== "" &&
                                                <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                    <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                    <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{lastName.message}</Label>
                                                </View>
                                            }
                                        </TextField>
                                    </View>
                                    <View style={{ zIndex: -11 }}>
                                        <TextField
                                            LabelTitle='Email'
                                            placeholder="Email"
                                            onChangeText={this.onEmailChange}
                                            value={email.value}
                                            keyboardType={"email-address"}>
                                            {email.message !== "" &&
                                                <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                    <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                    <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{email.message}</Label>
                                                </View>
                                            }
                                        </TextField>
                                    </View>
                                    <View style={{ zIndex: -111 }}>
                                        <InputMask
                                            type={'custom'}
                                            options={{ mask: '9999999999999' }}
                                            placeholder='Phone Number'
                                            LabelTitle='Phone Number'
                                            onChangeText={this.onPhoneNumberChange}
                                            value={phoneNumber.value}
                                            keyboardType={"phone-pad"}
                                            returnKeyType={"done"}
                                            customStyle={{ width: "77%", height: 48 }}
                                            isCountryCode={true}
                                            reference={ref => this.phone = ref}
                                            countryCode={countryCode}
                                            onSelectCountry={() => this.setState({ countryCode: this.phone.getValue() })}
                                        >
                                            {phoneNumber.message !== "" &&
                                                <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                    <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                    <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{phoneNumber.message}</Label>
                                                </View>
                                            }
                                        </InputMask>
                                    </View>
                                </View>
                            }
                            <CheckBox
                                style={{ marginTop: 40, }}
                                onClick={() => { this.setState({ isContractTeams: !isContractTeams }) }}
                                checkedImage={<CustomIcon name={"check"} style={styles.checkedIcon} />}
                                unCheckedImage={<View style={styles.checkIcon}></View>}
                                isChecked={isContractTeams}
                                rightText={"I accept contract Terms & Conditions."}
                                rightTextStyle={{ color: Color.DarkGrey, fontFamily: "Montserrat-Regular", fontSize: fontXSmall16, lineHeight: 24 }}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                    <ToastMessage
                        successIconCustom={{ fontSize: fontLarge24 }}
                        massageTextCustom={{ fontSize: fontXSmall16, lineHeight: 24, width: '90%' }}
                        message="New job has been successfully created"
                        mainViewCustom={{ alignItems: "center" }}
                        isVisible={this.state.isShowToast} />
                </SafeAreaView>
                <KMButton
                    fontSize_16 Montserrat_Medium
                    color={Color.BLACK}
                    title="UPDATE JOB"
                    textStyle={{ padding: 0 }}
                    style={[GlobalStyles.bottomButtonStyle, { backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow }]}
                    disabled={this.isSubmitDisable()}
                    onPress={() => {
                        // console.log("isShowToast")
                        // this.setState({ isShowToast: true })
                        navigate(Routes.Job_Details)
                    }}
                // onPress={this.onCreateJobClick}
                />
                {isLoading && <ProgressHud />}
            </View>
        );
    }

    // onJobTitleChange = (text) => {
    //     const jobTitle = this.state.jobTitle
    //     jobTitle.value = text

    //     if (jobTitle.value.length == 0 || jobTitle.value == "") {
    //         jobTitle.isValid = false
    //     } else {
    //         jobTitle.isValid = true
    //     }

    //     this.setState({
    //         jobTitle
    //     })
    // }

    onJobTitleChange = (text) => {
        const jobTitle = this.state.jobTitle
        jobTitle.value = text

        if (jobTitle.value.length == 0 || jobTitle.value == "") {
            jobTitle.message = ErrorMessage.contractTitleRequired
            jobTitle.isValid = false
        } else if (!validateCharacter(jobTitle.value)) {
            jobTitle.message = ErrorMessage.firstNameInvalid
            jobTitle.isValid = false
        } else {
            jobTitle.message = ""
            jobTitle.isValid = true
        }
        this.setState({
            jobTitle
        })
    }
    onContractAmountChange = (text) => {
        const contractAmount = this.state.contractAmount
        contractAmount.value = text.trim()

        if (contractAmount.value.length == 0 || contractAmount.value == "") {
            contractAmount.message = ErrorMessage.contractAmountRequired
            contractAmount.isValid = false
        } else {
            contractAmount.message = ""
            contractAmount.isValid = true
        }
        this.setState({
            contractAmount
        })
    }


    onFirstNameChange = (text) => {
        const firstName = this.state.firstName
        firstName.value = text

        if (firstName.value.length == 0 || firstName.value == "") {
            firstName.message = ErrorMessage.firstNameRequired
            firstName.isValid = false
        } else if (!validateName(firstName.value)) {
            firstName.message = ErrorMessage.firstNameInvalid
            firstName.isValid = false
        } else {
            firstName.message = ""
            firstName.isValid = true
        }
        this.setState({
            firstName
        })
    }

    onLastNameChange = (text) => {
        const lastName = this.state.lastName
        lastName.value = text

        if (lastName.value.length == 0 || lastName.value == "") {
            lastName.message = ErrorMessage.lastNameRequired
            lastName.isValid = false
        } else if (!validateName(lastName.value)) {
            lastName.message = ErrorMessage.lastNameInvalid
            lastName.isValid = false
        } else {
            lastName.message = ""
            lastName.isValid = true
        }
        this.setState({
            lastName
        })
    }

    onEmailChange = (text) => {
        const email = this.state.email
        email.value = text.trim()

        if (email.value.length == 0 || email.value == "") {
            email.message = ErrorMessage.emailRequired
            email.isValid = false
        } else if (!validateEmail(email.value)) {
            email.message = ErrorMessage.emailInvalid
            email.isValid = false
        } else {
            email.message = ""
            email.isValid = true
        }
        this.setState({
            email
        })
    }

    onPhoneNumberChange = (text) => {
        const phoneNumber = this.state.phoneNumber
        phoneNumber.value = text.trim()

        if (phoneNumber.value.length == 0 || phoneNumber.value == "") {
            phoneNumber.message = ErrorMessage.phoneRequired
            phoneNumber.isValid = false
        } else if (!validatePhone(phoneNumber.value)) {
            phoneNumber.message = ErrorMessage.phoneInvalid
            phoneNumber.isValid = false
        } else {
            phoneNumber.message = ""
            phoneNumber.isValid = true
        }
        this.setState({
            phoneNumber
        })
    }

    isSubmitDisable() {
        const { isAddClient, jobTitle, contractAmount, firstName, lastName, email, phoneNumber, isContractTeams, selectedClient } = this.state;
        if (isAddClient) {
            return !jobTitle.isValid || !contractAmount.isValid || !firstName.isValid || !lastName.isValid || !email.isValid || !isContractTeams || !phoneNumber.isValid
        }
        else {
            return !jobTitle.isValid || !isContractTeams || selectedClient == "Select Client"
        }
    }

    onCreateJobClick = () => {
        const { navigation, screenProps } = this.props;
        const { navigate } = navigation

        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        const { jobTitle, firstName, lastName, email, countryCode, phoneNumber } = this.state;

        let request = {
            clientFirstName: firstName.value,
            clientLastName: lastName.value,
            clientEmail: email.value,
            clientPhoneNumber: phoneNumber.value,
            clientCountryCode: countryCode,
            jobTitle: jobTitle.value,
        };

        API.createJob(request).then(res => {
            console.log("createJob response", res.data);
            this.setState({ isLoading: false });
            if (res.data.status) {
                this.setState({
                    isShowToast: true
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            isShowToast: false
                        })
                    }, 5000)
                });
                navigate(Routes.Job_Details)
            }
        }).catch(err => {
            console.log("createJob error", err.message);
            this.setState({ isLoading: false });
        })
    }
}

