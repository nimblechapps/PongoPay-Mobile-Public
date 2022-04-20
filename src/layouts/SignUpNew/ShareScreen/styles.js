
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
        marginTop: 12
    },
    mainView: {
        width: screenWidth,
        alignSelf: 'center',
        paddingHorizontal: 20
    },
    mainViewPad: {
        width: 450,
    },
    scrollView: {
        position: 'relative',
        // flex: 1
    },

    codeMainView: {
        position: 'relative'
    },
    uploadBtn: {
        height: 180,
        width: '100%',
        borderRadius: 10,
        borderColor: Color.Grey,
        borderWidth: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        paddingHorizontal: 50
    },
    uploadImg: {
        height: 46,
        marginBottom: 20,
        resizeMode: 'contain'
    },
    btnPos: {
        // position: 'absolute',
        // bottom: 40,
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20

    },
    lastMainBtn: {
        marginVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        zIndex: -1

    },
    deleteBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 35,
        right: 10,
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: Color.Red,
        zIndex: 9,
        elevation: 9
    },
    submitBtn: {
        position: 'absolute',
        top: 29,
        right: 5,
        zIndex: 99,
        padding: 10
    },
    yellowBtn: {
        position: 'absolute',
        top: 29,
        right: 5,
        zIndex: 99,
        backgroundColor: Color.Yellow,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 6
    },
    shareTxt: {
        fontSize: 14,
        color: Color.BLACK
    },
    inputMaskView: {
        marginBottom: 10,
        position: 'relative'
    },
    shareImg: {
        height: 18,
        width: 15,
        marginLeft: 6
    },
    appView: {
        flexDirection: 'row'
    },
    appImg: {
        height: 60,
        width: 60,
        borderRadius: 30,
        resizeMode: 'contain',
        marginBottom: 5
    }

}


const styles = StyleSheet.create(loginStyle);

export default styles;
