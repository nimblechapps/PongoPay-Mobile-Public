/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, Image, TouchableOpacity, Modal, Linking } from 'react-native';
import Label from '../../components/Label';
import KMButton from '../../components/KMButton';
import Color from '../../utils/color'
import Globals, { clearUserData } from "../../utils/Globals";
import styles from "./styles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Routes } from '../../utils/Routes';
import { DrawerActions } from 'react-navigation-drawer';
import { NavigationActions, StackActions, ThemeColors } from 'react-navigation';
import API from '../../API';
import ProgressHud from '../../components/ProgressHud';
import AsyncStorage from '@react-native-community/async-storage';






export default class SidebarMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowLogout: false,
            isShowDeleteAccount: false,
            activePage: Routes.Job_Listing
        }
    }

    hideModalLogout() {
        this.setState({
            isShowLogout: false
        })
    }

    onLogoutClick() {
        const { dispatch } = this.props.navigation;
        dispatch(DrawerActions.closeDrawer())
        this.setState({
            isShowLogout: true,
        })

    }

    hideModalDeleteAccount() {
        this.setState({
            isShowDeleteAccount: false
        })
    }
    logoutWebservice = async () => {

        let fcmToken = await AsyncStorage.getItem('fcmToken');

        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        try {
            let request;
            if (global.os == "android") {
                request = {
                    androidToken: global.deviceToken,
                    fcmToken: fcmToken
                }
            } else {
                request = {
                    iosToken: global.deviceToken,
                    fcmToken : fcmToken
                }
            }
            let response = await API.logout(request)

            this.setState({ isLoading: false });
            console.log("response", response)
            screenProps.callback(response);
            if (response.status) {
                await clearUserData(this.props)
                screenProps.onRefreshUser()
                await AsyncStorage.setItem('alreadyLaunched', 'true');
                this.navigateToScreen(Routes.Login)
            }
        } catch (error) {
            console.log("getAllMilestone error", error.message);
            this.setState({ isLoading: false });
        }
    }
    deleteAccount = async () => {
        this.hideModalDeleteAccount()
        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        try {
            let request = {
            };

            let response = await API.deleteAccount(request)
            this.setState({ isLoading: false });
            console.log("response", response)
            screenProps.callback(response);
            if (response.status) {
                await clearUserData(this.props)
                screenProps.onRefreshUser()
                this.navigateToScreen(Routes.Login)
            }
        } catch (error) {
            console.log("getAllMilestone error", error.message);
            this.setState({ isLoading: false });
        }
    }



    onDeleteAccountClick() {
        const { dispatch } = this.props.navigation;
        dispatch(DrawerActions.closeDrawer())
        this.setState({
            isShowDeleteAccount: true
        })
    }

    // navigateToScreen = (route) => {
    //     this.setState({ activePage: route })
    //     const { dispatch, navigate } = this.props.navigation;

    //     if (Routes.Login == route) {
    //         Globals.countryCode = '+44'
    //         navigate(Routes.Login)
    //     }
    //     else {
    //         console.log("navigate", route)
    //         // dispatch(DrawerActions.closeDrawer())

    //         const navigateAction = NavigationActions.navigate({
    //             routeName: route
    //         });
    //         dispatch(navigateAction);
    //         setTimeout(() => {
    //             dispatch(DrawerActions.closeDrawer());
    //         }, 100);

    //         // dispatch(DrawerActions.closeDrawer())



    //     }
    // }
    navigateToScreen = (route) => {
        this.setState({ activePage: route })
        const { dispatch, navigate } = this.props.navigation;
        if (Routes.Login == route) {
            Globals.countryCode = '+44'
            navigate(Routes.Login)
        }
        else {
            console.log("navigate", route)
            this.isActivePage(route)
            const navigateAction = NavigationActions.navigate({
                routeName: route
            });
            dispatch(navigateAction);

            if (route === Routes.My_Profile) {
                // const resetAction = StackActions.reset({
                //     index: 0,
                //     actions: [NavigationActions.navigate({ routeName: route })],
                // });
                // dispatch(resetAction);
            }

            setTimeout(() => {
                dispatch(DrawerActions.closeDrawer());
            }, 100);
        }
    }




    isActivePage(route) {
        if (this.state.activePage == route) {
            return Color.LightBlue
        } else {
            return Color.LightBlack
        }
    }

    render() {
        const { activePage } = this.state
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>

                        <View style={styles.logoMain}>
                            <Image source={require("./../../assets/Images/logo_small.png")} />
                        </View>

                        <TouchableOpacity onPress={() => this.navigateToScreen(Routes.Job_Listing)} style={styles.menuList}>
                            <Label fontSmall14 Montserrat_Medium color={this.isActivePage(Routes.Job_Listing)} style={{ lineHeight: 24 }} >Jobs</Label>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.navigateToScreen(Routes.Property_Manager_List)} style={styles.menuList}>
                            <Label fontSmall14 Montserrat_Medium color={this.isActivePage(Routes.Property_Manager_List)} style={{ lineHeight: 24 }} >My Property Managers</Label>
                        </TouchableOpacity>

                        {Globals.isBuilder ?
                            <TouchableOpacity onPress={() => this.navigateToScreen(Routes.Clients_List)} style={styles.menuList}>
                                <Label fontSmall14 Montserrat_Medium color={this.isActivePage(Routes.Clients_List)} style={{ lineHeight: 24 }} >My Clients</Label>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.navigateToScreen(Routes.Clients_List)} style={styles.menuList}>
                                <Label fontSmall14 Montserrat_Medium color={this.isActivePage(Routes.Clients_List)} style={{ lineHeight: 24 }} >My Tradesperson</Label>
                            </TouchableOpacity>
                        }

                        <TouchableOpacity onPress={() => this.navigateToScreen(Routes.Notification)} style={styles.menuList}>
                            <Label fontSmall14 Montserrat_Medium color={this.isActivePage(Routes.Notification)} style={{ lineHeight: 24 }} >Notifications</Label>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.navigateToScreen(Routes.My_Profile)} style={styles.menuList}>
                            <Label fontSmall14 Montserrat_Medium color={this.isActivePage(Routes.My_Profile)} style={{ lineHeight: 24 }} >My Profile</Label>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuList} onPress={() => Linking.openURL(Globals.contactUsUrl)}>
                            <Label fontSmall14 Montserrat_Medium color={Color.LightBlack} style={{ lineHeight: 24 }} >Contact and Support</Label>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.onDeleteAccountClick()} style={styles.menuList}>
                            <Label fontSmall14 Montserrat_Medium color={Color.Red} style={{ lineHeight: 24 }} >Delete Account</Label>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.onLogoutClick()} style={styles.menuList}>
                            <Label fontSmall14 Montserrat_Medium color={Color.LightBlack} style={{ lineHeight: 24 }} >Logout</Label>
                        </TouchableOpacity>

                    </KeyboardAwareScrollView>
                </SafeAreaView>

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.isShowLogout}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: Color.ModalBG }}
                        onPress={() => this.hideModalLogout()}>
                        <View style={{ width: 280, backgroundColor: Color.WHITE, borderRadius: 8 }}>
                            <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 12, lineHeight: 22 }}>Are you sure you want to logout?</Label>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: Color.WhiteGrey }}>
                                <KMButton
                                    fontSize_16 Montserrat_Medium
                                    color={Color.DarkBlue}
                                    title="Yes"
                                    onPress={() => {
                                        this.logoutWebservice()

                                    }}
                                    textStyle={{ padding: 0, }}
                                    style={styles.modalBtn}
                                />
                                <View style={{ width: 1, height: '100%', backgroundColor: Color.WhiteGrey }}></View>
                                <KMButton
                                    fontSize_16 Montserrat_Medium
                                    color={Color.DarkBlue}
                                    title="No"
                                    onPress={() => this.hideModalLogout()}
                                    textStyle={{ padding: 0, }}
                                    style={styles.modalBtn}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Delete Account Modal */}
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.isShowDeleteAccount}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: Color.ModalBG }}
                        onPress={() => this.hideModalDeleteAccount()}>
                        <View style={{ width: 280, backgroundColor: Color.WHITE, borderRadius: 8 }}>
                            <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 12, lineHeight: 22 }}>Are you sure you want to Delete the Account?</Label>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: Color.WhiteGrey }}>
                                <KMButton
                                    fontSize_16 Montserrat_Medium
                                    color={Color.DarkBlue}
                                    title="Yes"
                                    onPress={() => this.deleteAccount()}
                                    textStyle={{ padding: 0, }}
                                    style={styles.modalBtn}
                                />
                                <View style={{ width: 1, height: '100%', backgroundColor: Color.WhiteGrey }}></View>
                                <KMButton
                                    fontSize_16 Montserrat_Medium
                                    color={Color.DarkBlue}
                                    title="No"
                                    onPress={() => this.hideModalDeleteAccount()}
                                    textStyle={{ padding: 0, }}
                                    style={styles.modalBtn}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

            </View>
        );
    }
}

