
import { StyleSheet, Dimensions } from 'react-native';
import Color from "../../../utils/color"
import { largeCutoff, mediumCutoff, screenHeight, screenWidth } from "../../../utils/theme"
import Globals from "../../../utils/Globals";

let loginStyle = {
    container: {
        height: screenHeight,
        width: screenWidth,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: Color.WHITE,
        flex: 1
    },
    logoStyle: {
        alignSelf: 'flex-start',
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 24,
    },
    logoMainView: {
        width: '100%',
        paddingHorizontal: 20,
    },
    logoMainViewPad: {
        width: 450,
        paddingHorizontal: 20

    },
    centerView: {
        marginTop: 22
    },
    mainView: {
        width: screenWidth - 40,
        alignSelf: 'center'
    },
    mainViewPad: {
        width: 450,
    },
    scrollView: {
        // position: 'relative',
        // flex: 1
    },
    AnimImgStyle: {
        marginTop: 55
    },
    profileMainView: { flexDirection: 'row', alignItems: 'center', paddingTop: 24 },
    uploadBtn: {
        height: 80,
        width: 80,
        borderRadius: 40,
        borderColor: Color.Grey,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: "center",
        marginRight: 16
    },
    uploadImg: { height: 18, width: 21 },
    uploadUserImg: {
        height: 80,
        width: 80,
        borderRadius: 40,
        resizeMode: 'contain'
    },
    btnPos: {
        // position: 'absolute',
        // bottom: 40,
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 10

    },
    lastMainBtn: {
        marginVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        zIndex: -1
    },


}


const styles = StyleSheet.create(loginStyle);

export default styles;
