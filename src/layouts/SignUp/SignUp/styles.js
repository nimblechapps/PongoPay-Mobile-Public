
import { StyleSheet } from 'react-native';
import Color from "../../../utils/color"
import { largeCutoff, mediumCutoff, screenHeight, screenWidth } from "../../../utils/theme"
import Globals from "../../../utils/Globals";

let loginStyle = {
    container: {
        width: screenWidth,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: Color.WHITE,
        flex: 1
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
    },
    logoStyle: {
        alignSelf: 'flex-start',
        marginLeft: 0,
        marginTop: screenHeight * 0.06,
        marginBottom: screenHeight * 0.05,
    },
    logoStylePad: {
        alignSelf: 'flex-start',
        marginTop: 0,
        marginBottom: screenHeight * 0.08,
    },
    logoMainView: {
        width: screenWidth - 30,
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
        padding: 30,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: Color.WHITE,
        width: '96%',
        height: screenHeight * 0.64,
    },
    scrollView: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        // flex: 1,
    },
    scrollViewPad: {
        alignItems: "center",
        justifyContent: "center",
        // flex: 1,
    },
}

if (screenHeight > largeCutoff) {
    //large
    // loginStyle.scrollInsideViewStyle.marginTop = (Globals.isIpad ? 0 : Dimensions.get("window").height * 0.14)
} else if (screenHeight > mediumCutoff) {
    //medium
    // loginStyle.scrollInsideViewStyle.marginTop = Dimensions.get("window").height * 0.10

} else {
    //small
    // loginStyle.logoStyle.marginTop = Dimensions.get("window").height * 0.07,
    //     loginStyle.logoStyle.marginBottom = Dimensions.get("window").height * 0.05
}
//@ts-ignore
const styles = StyleSheet.create(loginStyle);

export default styles;
