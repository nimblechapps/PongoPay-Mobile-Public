
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

        // marginBottom: screenHeight * 0.08,
    },
    logoStylePad: {
        alignSelf: 'flex-start',
        marginTop: 0,
        marginBottom: 24
        // marginBottom: screenHeight * 0.06,
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
        marginTop: 32
    },
    mainView: {
        width: screenWidth - 40,
        alignSelf: 'center'
    },
    mainViewPad: {
        width: 450,
    },

    scrollView: {
        position: 'relative',
        // flex: 1
    },
    btnSelectionView: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 4,
        marginTop: 24,
        overflow: 'hidden'
    },

    btnPos: {
        // position: 'absolute',
        // bottom: 40,
        // width: '100%',
        paddingHorizontal: 20
    },
    lastMainBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        // marginBottom: 30
        marginVertical: 40
    },
    linkBtn: {
        marginTop: 16,
        justifyContent: 'center',
        alignSelf: 'center'
    }

}


const screenDims = Dimensions.get("screen")


const styles = StyleSheet.create(loginStyle);

export default styles;
