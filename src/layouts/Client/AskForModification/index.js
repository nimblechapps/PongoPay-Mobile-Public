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

export default class AskForModification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowToast: false,
        }
    }
    static navigationOptions = ({ }) => {
        return {
            headerTitle: () => <HeaderTitle title={"Ask for Modification"} />,
        }
    };

    render() {

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 24, paddingBottom: 24, }}>
                            <TextField
                                returnKeyType={"next"}
                                autoFocus={true}
                                multiline
                                placeholder='Write here…'
                                customStyle={{ height: 300, paddingTop: 10, paddingBottom: 10, textAlignVertical: 'top' }}
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
                    onPress={() => {
                        console.log("isShowToast")
                        this.setState({ isShowToast: true })

                    }}
                />
            </View>
        );
    }
}

