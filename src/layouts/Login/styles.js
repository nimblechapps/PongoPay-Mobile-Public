
import { StyleSheet, Dimensions } from 'react-native';
import Color from "../../utils/color"
import { largeCutoff, mediumCutoff, screenHeight, screenWidth } from "../../utils/theme"
import Globals from "./../../utils/Globals";

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
        marginTop: screenHeight * 0.08,
        marginBottom: screenHeight * 0.08,

    },
    logoStylePad: {
        alignSelf: 'flex-start',
        marginTop: 0,
        marginBottom: screenHeight * 0.06,
    },
    logoMainView: {
        width: '100%',
    },
    logoMainViewPad: {
        width: 450,
    },
    mainView: {
        width: screenWidth - 30,
    },
    mainViewPad: {
        width: 450,
    },
    boxShadowViewPad: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.WHITE,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: '96%',
        height: screenHeight * 0.5,
        paddingTop: 32,
        paddingBottom: 32,
        paddingRight: 30,
        paddingLeft: 30,
    },
    scrollView: {
        // alignItems: "flex-start",
        // justifyContent: "flex-start",
        // flex: 1,
    },
    scrollViewPad: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    // scrollInsideViewStyle: {
    //     alignSelf: 'center',
    //     width: Globals.isIpad ? screenWidth * 0.5 : screenWidth - 80,
    //     justifyContent: 'center',
    // },
}


const screenDims = Dimensions.get("screen")
if (screenDims.height > largeCutoff) {
    //large
    // loginStyle.scrollInsideViewStyle.marginTop = (Globals.isIpad ? 0 : screenHeight * 0.14)


} else if (screenDims.height > mediumCutoff) {
    //medium
    // loginStyle.scrollInsideViewStyle.marginTop = screenHeight * 0.10

} else {
    //small
    // loginStyle.logoStyle.marginTop = screenHeight * 0.08,
    //     loginStyle.logoStyle.marginBottom = screenHeight * 0.08
}
//@ts-ignore

const styles = StyleSheet.create(loginStyle);

export default styles;
