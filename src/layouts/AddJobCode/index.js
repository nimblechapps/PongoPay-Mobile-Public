/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color'
import styles from "./styles";
import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderRight from '../../components/Header/HeaderRight';
import KMButton from "../../components/KMButton";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ToastMessage from '../../components/toastmessage';
import { fontXSmall16, fontLarge24 } from '../../utils/theme';
import GlobalStyles from '../../utils/GlobalStyles';
import { validateOtp } from '../../utils/validation';
import InputMask from '../../components/InputMask';
import { ErrorMessage } from '../../utils/message';
import CustomIcon from "../../components/CustomIcon";
import API from "../../API";
import ProgressHud from "../../components/ProgressHud";
import { Routes } from '../../utils/Routes';

export default class AddJobCode extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <HeaderLeft
                    null
                />
            ),
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
        super(props)
        this.state = {
            isLoading: false,
            isShowToast: false,
            jobCode: {
                value: "",
                message: "",
                isValid: false,
            },
            toast: {
                show: false,
                message: "",
                isValid: false,
            },
        }
    }

    render() {
        const { isLoading, jobCode, toast } = this.state;

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={Globals.isIpad ? styles.scrollViewPad : styles.scrollView}>
                        <View style={Globals.isIpad ? styles.boxInputPad : styles.boxInput}>
                            <InputMask
                                placeholder='Enter Job Code'
                                LabelTitle='Enter Your Job Code'
                                type={'custom'}
                                options={{ mask: '999999' }}
                                onChangeText={this.onjobCodeChange}
                                value={jobCode.value}
                                keyboardType={"phone-pad"}
                                returnKeyType={"done"}
                                secureTextEntry={false}
                                autoFocus={true}
                            >
                                {jobCode.message !== "" &&
                                    <View style={GlobalStyles.errorTxt}>
                                        <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{jobCode.message}</Label>
                                    </View>
                                }
                            </InputMask>
                        </View>
                        <ToastMessage
                            isError={!toast.isValid}
                            successIconCustom={{ fontSize: fontLarge24 }}
                            massageTextCustom={{ fontSize: fontXSmall16, lineHeight: 24, width: '90%' }}
                            message={toast.message} //Job added successfully!!
                            mainViewCustom={{ alignItems: 'center' }}
                            isVisible={toast.show} />
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                <KMButton
                    fontSize_16 Montserrat_Medium
                    color={Color.BLACK}
                    title="ADD JOB"
                    textStyle={{ padding: 0 }}
                    style={[GlobalStyles.bottomButtonStyle, { backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow }]}
                    onPress={() => {
                        // console.log("isShowToast")
                        this.onAddJobCode(jobCode.value)

                    }}
                    disabled={this.isSubmitDisable()}
                />
                {isLoading && <ProgressHud />}
            </View>
        );
    }

    onjobCodeChange = (text) => {
        const jobCode = this.state.jobCode
        jobCode.value = text.trim()

        if (jobCode.value.length == 0 || jobCode.value == "") {
            jobCode.message = ErrorMessage.jobCodeRequired
            jobCode.isValid = false
        }
        // else if (!validateOtp(jobCode.value)) {
        //     jobCode.message = ErrorMessage.jobCodeInvalid
        //     jobCode.isValid = false
        // }
        else {
            jobCode.message = ""
            jobCode.isValid = true
        }
        this.setState({
            jobCode
        })
    }

    isSubmitDisable() {
        return !this.state.jobCode.isValid
    }

    onAddJobCode = async (jobCode) => {
        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        try {
            let request = {
                jobCode: jobCode
            };

            let response = await API.addJobByJobCode(request)
            this.setState({ isLoading: false });
            console.log("addJobByJobCode response", response)
            screenProps.callback(response);
            if (response.status) {
                this.setState({ isLoading: false });
                //call job detail page 
                console.log("jobId", response.data._id)
                const { navigate } = this.props.navigation;
                navigate(Routes.Job_Details, {
                    jobId: response.data._id,
                    jobDetails: response.data,
                    isJobAccepted: !(response.data.nAcceptBuilderStatus == 0 && response.data.oCreatedBy != this.state.userId)
                })
            } else {
            }

        } catch (error) {
            console.log("addJobByJobCode error", error.message);
            this.setState({
                isLoading: false
            });
        }
    }
}

