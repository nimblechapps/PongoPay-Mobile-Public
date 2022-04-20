/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Color from '../../../utils/color';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import KMButton from "../../../components/KMButton";
import TextField from "../../../components/TextField";
import ToastMessage from '../../../components/toastmessage';
import GlobalStyles from '../../../utils/GlobalStyles';
import styles from "./styles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import pongopayFontConfige from '../../../../selection.json';

import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';

const Icon = createIconSetFromIcoMoon(pongopayFontConfige);

export default class RejectWork extends Component {
    constructor(props) {
        super(props)
        const { params = {} } = props.navigation.state;
        this.state = {
            isShowToast: false,
            comment: '',
            milestoneDetails: params.milestoneDetails
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <HeaderTitle title={"Request Tradesperson Action"} />,
        }
    };

    onRejctionCommentChange = (text) => {
        this.setState({
            comment: text
        })
    }

    onSubmit = async () => {
        const { screenProps } = this.props;
        let { milestoneDetails } = this.state
        if (!screenProps.isConnected) {
            return
        }
        this.setState({ isLoading: true });
        try {
            let request = {
                milestoneId: milestoneDetails._id,
                milestoneNumber: milestoneDetails.nMilestoneNumber,
                comment: this.state.comment
            };

            //5e5ca10d9f640a10e3eb5436
            console.log("param", request)
            let response = await API.rejectMilestoneWithoutDispute(request)
            this.setState({ isLoading: false });
            console.log("rejectMilestoneWithoutDispute response", response)
            if (response.status) {
                this.props.navigation.state.params.onGoBack && this.props.navigation.state.params.onGoBack(response.data)
                this.props.navigation.goBack()
            }
            screenProps.callback(response)

        } catch (error) {
            console.log("rejectMilestoneWithoutDispute error", error.message);
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 16, paddingBottom: 24, }}>
                            <TextField
                                autoFocus={true}
                                multiline
                                placeholder='Write here…'
                                customStyle={{ height: 300, paddingTop: 10, paddingBottom: 10, textAlignVertical: 'top' }}
                                onChangeText={this.onRejctionCommentChange}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                    <ToastMessage
                        message="Payment Stage modification request successfully sent"
                        isVisible={this.state.isShowToast} />
                </SafeAreaView>
                <KMButton
                    fontSize_16 Montserrat_Medium
                    color={Color.BLACK}
                    title="SUBMIT"
                    textStyle={{ padding: 0 }}
                    style={[GlobalStyles.bottomButtonStyle, { borderRadius: 0, }]}
                    onPress={this.onSubmit}
                // onPress={() => this.props.navigation.navigate('AskForModification')}
                />
                {this.state.isLoading && <ProgressHud />}
            </View >
        );
    }
}

