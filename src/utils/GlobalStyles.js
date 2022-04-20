
//Constant Styles
import Color from './color';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { fontXSmall16, isIOS, screenWidth, fontLarge24 } from './theme';
import Globals from './Globals';

// Then we set our styles with the help of the em() function
export default Style = {
    // For Header Style
    headerStyle: {
        backgroundColor: Color.WHITE,
        shadowColor: Color.LightBlack,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        borderBottomWidth: 0,
        height: (Globals.isIpad ? 65 : 60), // https://github.com/react-navigation/react-navigation/issues/283
        ...ifIphoneX({
            height: 60
        }, {
            height: isIOS() ? 60 : 50
        })
    },
    headerTitleViewStyle: {
        flex: 1,
        alignItems: "center",
    },
    viewLeftStyle: {
        paddingHorizontal: 10
    },
    iconLeftStyle: {
        fontSize: 20
    },
    viewRightStyle: {
        paddingHorizontal: 10
    },
    iconRightStyle: {
        fontSize: 20
    },
    topbar: {
        backgroundColor: Color.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    },
    // For Header Style

    errorTxt: {
        backgroundColor: Color.WHITE,
        borderRadius: 5,
        shadowColor: Color.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 8,
        paddingRight: 8,
        flexDirection: "row",
        alignItems: "center",
        width: "99%",
        marginLeft: "0.5%",
        // flexWrap: 'wrap',
        position: "absolute",
        top: isIOS() ? 78 : 71,
        zIndex: 99
    },
    errorTxtPad: {
        backgroundColor: Color.WHITE,
        borderRadius: 5,
        shadowColor: Color.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 8,
        paddingRight: 8,
        flexDirection: "row",
        alignItems: "center",
        width: "99%",
        marginLeft: '0.5%',
        position: "absolute",
        top: isIOS() ? 84 : 82,
        zIndex: 9999999
    },
    bottomButtonStyle: {
        backgroundColor: Color.Yellow,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        ...ifIphoneX({
            height: 84
        }, {
            height: 64
        })
    },
    AddButtonStyle: {
        backgroundColor: Color.Yellow,
        width: "100%",
        // alignItems: "center",
        // justifyContent: "center", 
        // flexDirection: "row",

        ...ifIphoneX({
            height: 40
        }, {
            height: 40
        })
    },
    topCustomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center'
    },
    newErrorView: {
        // paddingTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        width: '92%',
    },
    errorIcon: {
        color: Color.Red,
        fontSize: fontXSmall16,
        alignItems: "center",
        marginRight: 8
    },
    animImageStyle: {
        width: screenWidth,
        height: 230,
        resizeMode: 'cover',
        marginTop: 40
    },
    textFieldStyle: {
        borderWidth: 0,
        borderBottomWidth: 1,
        marginBottom: 5,
        paddingLeft: 0,
        color: Color.DarkGrey,
        fontFamily: "Montserrat-Regular",
        fontSize: fontLarge24
    }
};