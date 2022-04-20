import React from 'react';
import { PixelRatio, Platform, Dimensions, StyleSheet } from 'react-native';
import Color from "./color";
import { relativeWidth } from "./dimensions";
import DeviceInfo from 'react-native-device-info';

const { width, height } = Dimensions.get('window');
const realWidth = height > width ? width : height;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
export const NAV_HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
const TAB_HEIGHT = 49;

// const fontBaseX10Small = 10;
// const fontBaseX12Small = 12;
// const fontBaseXSmall = 14;
// const fontBaseSmall = 16;
// const fontBaseNormal = 18;
// const fontBaseLarge = 20;
// const fontBaseXLarge = 24;


const fontBase24 = (DeviceInfo.isTablet() ? 24 : 24);
const fontBase22 = (DeviceInfo.isTablet() ? 22 : 22);
const fontBase20 = (DeviceInfo.isTablet() ? 20 : 20);
const fontBase18 = (DeviceInfo.isTablet() ? 18 : 18);
const fontBase16 = (DeviceInfo.isTablet() ? 16 : 16);
const fontBase14 = (DeviceInfo.isTablet() ? 14 : 14);
const fontBase12 = (DeviceInfo.isTablet() ? 12 : 12);

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export function isIOS() {
    return Platform.OS == "ios" ? true : false
}

const isTablet = () => {
    if (DeviceInfo.isTablet()) {
        return true
    } else {
        return false
    }
};

const responsiveHeight = (height) => {
    if (!isTablet())
        return height;
    else
        return (height + (height * 0.25));

};

const drawerWidth = () => {
    if (!isTablet())
        return relativeWidth(75);
    else
        return relativeWidth(60);
};

export const cardStyle = {
    borderRadius: 1,
    borderBottomWidth: 0,
    shadowColor: Color.BLACK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 5,
    shadowRadius: 2,
    elevation: 2,
};

export const circleStyle = {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: Color.BORDER_COLOR
};

const responsiveFontSize = (fontSize) => {
    // console.log("******* isTablet() ******", isTablet());
    const deviceType = DeviceInfo.getDeviceType(); // 'Handset'
    // console.log("******* deviceType ******", deviceType);

    let divider = isTablet() ? 600 : 375;
    return Math.round(fontSize * realWidth / divider);
};

const fontLarge24 = responsiveFontSize(fontBase24);
const fontLarge22 = responsiveFontSize(fontBase22);
const fontNormal20 = responsiveFontSize(fontBase20);
const fontSmall18 = responsiveFontSize(fontBase18);
const fontXSmall16 = responsiveFontSize(fontBase16);
const fontSmall14 = responsiveFontSize(fontBase14);
const fontSmall12 = responsiveFontSize(fontBase12);

const largeCutoff = 800
const mediumCutoff = 640

export {
    fontLarge24, fontLarge22, fontNormal20, fontSmall18, fontXSmall16, fontSmall14, fontSmall12, drawerWidth, responsiveHeight, width, height, mediumCutoff, largeCutoff
};
