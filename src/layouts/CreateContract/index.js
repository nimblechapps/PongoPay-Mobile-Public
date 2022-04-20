/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color'
import styles from "./styles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderTitle from '../../components/Header/HeaderTitle';
import StageDetails from '../../components/StageDetails';
import KMButton from "../../components/KMButton"
import TextField from '../../components/TextField';
import ToastMessage from '../../components/toastmessage';
import { fontXSmall16, fontLarge24 } from '../../utils/theme';
import GlobalStyles from '../../utils/GlobalStyles';
import { Routes } from '../../utils/Routes';
import { ErrorMessage } from '../../utils/message';
import { constant } from '../../utils/Globals';
import CustomIcon from "../../components/CustomIcon";

export default class CreateContract extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <HeaderLeft
                    iconName="close"
                    iconStyle={{ color: Color.LightBlue }}
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            ),
            headerTitle: () => <HeaderTitle title={"Create Contract"} />,
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            isShowToast: false,
            contractTitle: {
                value: "",
                message: "",
                isValid: false,
            },
            contractAmount: {
                value: "",
                message: "",
                isValid: false,
            }
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        const { contractTitle, contractAmount } = this.state;

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 24, paddingBottom: 16, }}>
                            <TextField
                                LabelTitle='Title*'
                                placeholder='Title'
                                onChangeText={this.onContractTitleChange}
                                value={contractTitle.value}
                            >
                                {contractTitle.message !== "" &&
                                    <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                        <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{contractTitle.message}</Label>
                                    </View>
                                }

                            </TextField>

                            <TextField
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

                            </TextField>
                            <TextField
                                multiline
                                LabelTitle='Description'
                                placeholder='Write here…'
                                customStyle={{ height: 96, paddingTop: 10, paddingBottom: 10, textAlignVertical: 'top' }}
                            />
                        </View>
                        <View style={styles.contractFileBox}>
                            <TouchableOpacity><Label fontSize_16 Montserrat_Medium color={Color.LightBlue}>{constant.kUploadContract}</Label></TouchableOpacity>
                            <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} mt={8}>{constant.kUploadContractFileMassage}</Label>
                        </View>
                        <View style={styles.uploadTextView}>
                            <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={{ lineHeight: 20 }}>Revamp Imperial Heights_V1.pdf</Label>
                            <TouchableOpacity>
                                <Label fontSize_16 Montserrat_Medium color={Color.Red} style={{ lineHeight: 20 }} mt={0}>Delete</Label>
                            </TouchableOpacity>
                        </View>

                        {/* // Update page */}
                        <TouchableOpacity onPress={() => navigate(Routes.Milestone_Listing)} style={styles.manageMilestones}>
                            <Label fontSize_16 Montserrat_Medium color={Color.DarkGrey}>Manage Milestones</Label>
                            <CustomIcon name={"right_arrow"} style={{ fontSize: fontXSmall16, color: Color.DarkGrey }} />
                        </TouchableOpacity>

                        <View style={{ borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, paddingRight: 16, paddingLeft: 16, paddingTop: 16, paddingBottom: 16 }}>
                            <StageDetails />
                        </View>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, paddingRight: 16, paddingLeft: 16, paddingTop: 16, paddingBottom: 16 }}>
                            <StageDetails />
                        </View>
                        <View style={styles.contractFileBox}>
                            <TouchableOpacity onPress={() => navigate(Routes.Add_Milestone)}>
                                <Label fontSize_16 Montserrat_Medium color={Color.LightBlue}>
                                    {constant.kAddMilestones}
                                </Label>
                            </TouchableOpacity>
                            <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} mt={8}>{constant.kAddMilestonesMassage}</Label>
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
                    title="CREATE"
                    textStyle={{ padding: 0 }}
                    style={[GlobalStyles.bottomButtonStyle, { backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow }]}
                    onPress={() => {
                        // console.log("isShowToast")
                        this.setState({ isShowToast: true })
                        navigate(Routes.Job_Details)
                    }}
                    disabled={this.isSubmitDisable()}
                />
                {/* // Update page */}

                {/* <KMButton
                    fontSize_16 Montserrat_Medium
                    color={Color.BLACK}
                    title="UPDATE"
                    textStyle={{ padding: 0 }}
                    style={[GlobalStyles.bottomButtonStyle, { backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow }]}
                    disabled={this.isSubmitDisable()}
                /> */}
            </View>
        );
    }

    onContractTitleChange = (text) => {
        const contractTitle = this.state.contractTitle
        contractTitle.value = text.trim()

        if (contractTitle.value.length == 0 || contractTitle.value == "") {
            contractTitle.message = ErrorMessage.contractTitleRequired
            contractTitle.isValid = false
        } else {
            contractTitle.message = ""
            contractTitle.isValid = true
        }
        this.setState({
            contractTitle
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

    isSubmitDisable() {
        return !this.state.contractTitle.isValid || !this.state.contractAmount.isValid
    }
}

