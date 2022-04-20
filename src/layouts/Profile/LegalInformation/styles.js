
import { StyleSheet } from 'react-native';
import Color from "../../../utils/color"
import Globals from "../../../utils/Globals";
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { screenHeight, isIOS, largeCutoff } from '../../../utils/theme';

// const topMargin = isIOS() ? (screenHeight > largeCutoff ? screenHeight * 0.60 : screenHeight * 0.65) : screenHeight * 0.65

let myReposrtScreen = {
    container: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_COLOR,
    },
    profileSignature: {
        flexDirection: "row",
        justifyContent: (Globals.isIpad ? "center" : "space-between"),
        alignItems: "center",
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: (Globals.isIpad ? 70 : 48),
        paddingTop: (Globals.isIpad ? 55 : 30),
        justifyContent: 'center',
    },
    userPhotoStyle: {
        // width: (Globals.isIpad ? "30%" : 160),
        width: (Globals.isIpad ? 160 : 120),
        aspectRatio: 1,
        marginRight: (Globals.isIpad ? 60 : 0),
        borderRadius: (Globals.isIpad ? 160 : 120) / 2,


    },
    informationDetails: {
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        zIndex: -1
    },
    borderLine: {
        width: 240,
        height: 1,
        backgroundColor: Color.WhiteGrey,
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 16,
    },
    // errorTxt: {
    //     flexDirection: "row",
    //     backgroundColor: Color.WHITE,
    //     marginTop: 4,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 2,
    //     elevation: 1,
    //     padding: 8,
    // },
    btnStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 15,
        marginBottom: 10
    },
    editBtn: {
        backgroundColor: Color.LightBlue,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        right: 18,
    },
    editBtnSignsture: {
        backgroundColor: Color.LightBlue,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: -2,
        right: -35,
    },
    safeVStyle: {
        flex: 1,
    },

    // Signature
    closeView: {
        backgroundColor: Color.WHITE,
        position: "absolute",
        alignItems: "center",
        right: 0,
        paddingLeft: 5,
        borderTopLeftRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 1,
        ...ifIphoneX({
            top: screenHeight - 340,
        }, {
            top: screenHeight - (isIOS() ? 315 : 335)
        })
    },
    closeBtn: {
        margin: 15
    },
    signatureView: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.09,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: Color.WHITE,
        // marginTop: topMargin,
        // height: screenHeight - topMargin,
        ...ifIphoneX({
            height: 84 + 200,
            marginTop: screenHeight - 284
        }, {
            height: 64 + 200,
            marginTop: screenHeight - (isIOS() ? 264 : 285)
        })
    },
    seperatorStyle: {
        width: 1,
        ...ifIphoneX({
            height: 84
        }, {
            height: 64
        })
    },
    buttonStyle: {
        borderRadius: 0,
        width: "50%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkIcon: {
        width: 24,
        height: 24,
        backgroundColor: Color.WHITE,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Color.LightGrey
    },
    checkedIcon: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Color.LightGrey,
        backgroundColor: Color.WHITE,
        color: Color.Green,
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 22,
        textAlign: "center"
    }
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
