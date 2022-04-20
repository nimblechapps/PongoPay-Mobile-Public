

import React from 'react';
import SplashScreen from 'react-native-splash-screen';

import { Routes } from '../../utils/Routes';
import { getStoredData } from '../../utils/store';
import Globals, { isValidValue, Users, afterSuccessLogin } from '../../utils/Globals';

export default class AuthScreen extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const token = await getStoredData(Globals.kToken);
        const { navigation } = this.props;
        const { navigate } = navigation

        setTimeout(() => {
            // do stuff while splash screen is shown
            // After having done stuff (such as async tasks) hide the splash screen
            if (token) {
                console.log("Globals.kToken", token)
                getStoredData(Globals.kUserData).then(value => {
                    let result = JSON.parse(value)
                    console.log("Globals.kUserData", result)
                    if (result) {
                        if (result.isProfileCompleted) {
                            afterSuccessLogin(this.props, result)
                        } else {
                            navigate(Routes.Login)
                        }
                    }
                    else {
                        navigate(Routes.Login)
                        // navigate(Routes.FirstPage)
                    }
                }).catch(() => {
                    navigate(Routes.Login)
                    // navigate(Routes.FirstPage)

                })
            }
            else {
                navigate(Routes.Login)
                // navigate(Routes.FirstPage)


            }
            SplashScreen.hide();
        }, 1000);
    };

    render() {
        return null;
    }
}