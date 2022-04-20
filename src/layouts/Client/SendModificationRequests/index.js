/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Label from '../../../components/Label';
import Color from '../../../utils/color';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import KMButton from "../../../components/KMButton";
import TextField from "../../../components/TextField";
import GlobalStyles from '../../../utils/GlobalStyles';
import styles from "./styles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import pongopayFontConfige from '../../../../selection.json';
import { ErrorMessage } from '../../../utils/message';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
const Icon = createIconSetFromIcoMoon(pongopayFontConfige);

export default class SendModificationRequests extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <HeaderTitle title={"Modification Request"} />,
        }
    };

    constructor(props) {
        super(props)
        const { params = {} } = props.navigation.state;
        this.state = {
            isLoading: false,
            jobId: params.jobId,
            isShowToast: false,
            requestDesc: {
                value: "",
                message: "",
                isValid: false,
            }
        }
    }


    render() {
        const { isLoading, requestDesc } = this.state;

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 24, paddingBottom: 24, }}>
                            {/* <Label Montserrat_Regular fontSize_14 color={Color.LightGrey} style={{ lineHeight: 20, }}>Contract modification request for “Revamp Imperial Heights”</Label> */}
                            <TextField
                                autoFocus={true}
                                multiline
                                placeholder='Write here…'
                                onChangeText={this.onTextChange}
                                value={requestDesc.value}
                                customStyle={{ height: 300, paddingTop: 10, paddingBottom: 10, textAlignVertical: 'top' }}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                    {isLoading && <ProgressHud />}
                </SafeAreaView>
                <KMButton
                    fontSize_16 Montserrat_Medium
                    color={Color.BLACK}
                    title="SUBMIT"
                    textStyle={{ padding: 0 }}
                    // style={[GlobalStyles.bottomButtonStyle, { borderRadius: 0, }]}
                    style={[GlobalStyles.bottomButtonStyle, { backgroundColor: !requestDesc.isValid ? Color.GreyLightColor : Color.Yellow }]}
                    disabled={!requestDesc.isValid}
                    onPress={() => this.onSendModificationRequest()}
                />
            </View >
        );
    }

    onTextChange = (text) => {
        const requestDesc = this.state.requestDesc
        requestDesc.value = text

        if (requestDesc.value.length == 0 || requestDesc.value == "") {
            requestDesc.message = ErrorMessage.modificationRequestRequired
            requestDesc.isValid = false
        } else {
            requestDesc.message = ""
            requestDesc.isValid = true
        }
        this.setState({
            requestDesc
        })
    }

    onSendModificationRequest = async () => {
        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        const { jobId, requestDesc } = this.state;

        try {
            let request = {
                jobId: jobId,
                sComment: requestDesc.value
            };

            let response = await API.createModificationRequest(request)
            this.setState({ isLoading: false });
            console.log("sendModificationRequest response", response)
            screenProps.callback(response)
            if (response.status) {
                this.props.navigation.goBack();
            }
           
        } catch (error) {
            console.log("sendModificationRequest error", error.message);
            this.setState({ isLoading: false });
        }
    }
}

