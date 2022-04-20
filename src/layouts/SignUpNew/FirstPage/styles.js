
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
        // marginTop: screenHeight * 0.08,
        marginBottom: 24
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
        paddingTop: 50
    },
    logoMainViewPad: {
        width: 450,
        paddingTop: 50
    },
    centerView: { marginTop: 32 },
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
        position: 'relative',
        flex: 1
    },
    scrollViewPad: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        position: 'relative'
    },
    btnSelectionView: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 4,
        marginTop: 24,
        overflow: 'hidden'
    },
    btnSelection: {
        alignItems: 'center', justifyContent: 'center', width: '50%', paddingVertical: 15
    },
    dot: {
        height: 4,
        width: 4,
        borderRadius: 2,
        backgroundColor: Color.BLACK,
        marginRight: 8
    },
    labeldotView: { flexDirection: 'row', alignItems: 'center' },

    divider: {
        width: 2,
        height: 50,
        backgroundColor: Color.Grey
    },
    btnPos: {
        position: 'absolute',
        bottom: 40,
        width: '100%'
    },
    lastMainBtn: {
        marginTop: 32,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        zIndex: -1
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
