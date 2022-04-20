import {
    StyleSheet, Platform
} from 'react-native';
import Color from "../../utils/color"
import { isIOS, screenHeight, largeCutoff } from '../../utils/theme';
let myReposrtScreen = {

    container: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_COLOR,
    },
    searchBox: {
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 24,
        paddingBottom: 24,
        flexDirection: "row"
    },
    ListMain: {
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
        padding: 16,
    },
    labelView: {
        flexDirection: 'row'
    },
    unRead: {
        width: 5,
        height: 5,
        backgroundColor: Color.Yellow,
        borderRadius: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        right: 5,
        top: -5
    },
    filterDropdownBox: {
        backgroundColor: Color.WHITE,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        width: 286,
        position: "absolute",
        borderRadius: 4,
        top: isIOS() ? (screenHeight > largeCutoff ? 190 : 170) : 136,
        right: 16,
        zIndex: 99,
        padding: 16
    },
    filterDropdownBoxPad: {
        backgroundColor: Color.WHITE,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        width: 286,
        position: "absolute",
        borderRadius: 4,
        top: Platform.OS === 'android' ? 136 : 170,
        right: 16,
        zIndex: 99,
        padding: 16
    },
    calenderBtn: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between"
    },
    createBtn: {
        width: 112,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Color.LightBlue,
        height: 40,
    },
    filterTriggle: {
        position: "absolute",
        top: -25,
        right: 0,
    },
    modalBtn: {
        width: '50%',
        paddingTop: 16,
        paddingBottom: 16
    },
    // filterTriggle: {
    //     width: 0,
    //     height: 0,
    //     borderLeftWidth: 10,
    //     borderRightWidth: 10,
    //     borderBottomWidth: 20,
    //     borderBottomColor: Color.WHITE,
    //     borderLeftColor: Color.Red,
    //     borderRightColor: Color.Red,
    //     position: "absolute",
    //     right: 12,
    //     top: -18,
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: -5, },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 6,
    //     elevation: 8,
    //     backgroundColor: Color.TRANSPARENT
    // },
    // filterTriggleShadow: {
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 0, },
    //     shadowOpacity: 0.8,
    //     shadowRadius: 6,
    //     elevation: 8,
    //     width: 6,
    //     height: 6,
    //     position: "absolute",
    //     right: 19,
    //     top: -12,
    //     zIndex: -1111,
    //     backgroundColor: Color.WHITE
    // },
    // filterTriggleShadowPad: {
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 0, },
    //     shadowOpacity: 0.8,
    //     shadowRadius: 6,
    //     elevation: 8,
    //     width: 6,
    //     height: 6,
    //     position: "absolute",
    //     right: 19,
    //     top: -12,
    //     zIndex: -1111,
    //     backgroundColor: Color.WHITE
    // },
    closebtnMain: {
        position: 'absolute',
        top: isIOS() ? (screenHeight > largeCutoff ? 118 : 94) : 64,
        right: 6,
        padding: 10,
        color: Color.darkGrey,
        backgroundColor: Color.white,
        zIndex: isIOS() ? 11 : 0
    },
    closebtnMainPad: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 63 : 95,
        right: 6,
        padding: 10,
        color: Color.darkGrey,
        backgroundColor: Color.white,
        zIndex: isIOS() ? 11 : 0
    },
    closeBtn: {
        backgroundColor: Color.LightBlue,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,

    }



}


const styles = StyleSheet.create(myReposrtScreen);

export default styles;
