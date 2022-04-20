
import { StyleSheet, Dimensions } from 'react-native';
import Color from "../../../utils/color"
import { largeCutoff, mediumCutoff, screenHeight, screenWidth } from "../../../utils/theme"
import Globals from "../../../utils/Globals";

let loginStyle = {
    container: {
        height: screenHeight,
        width: screenWidth,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Color.WHITE,
        flex: 1
    },
    logoStyle: {
        alignSelf: 'flex-start',
        marginTop: 50,
        marginLeft: 20
    },
    frndsStyle: {
        alignSelf: 'center',

    },
    logoMainView: {
        width: '100%',
    },

    centerView: { marginTop: 32 },
    mainView: {
        width: screenWidth - 30,
        alignSelf: 'center'
    },
    mainViewPad: {
        width: 450,
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
        width: screenWidth - 30,
        paddingBottom: 40
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
