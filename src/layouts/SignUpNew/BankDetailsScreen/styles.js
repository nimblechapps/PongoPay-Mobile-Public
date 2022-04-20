
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
        width: screenWidth - 40,
        alignSelf: 'center'
    },
    mainViewPad: {
        width: 450,
    },
    scrollView: {
        position: 'relative'
    },
    borderStyleBase: {
        width: 40,
        height: 40,
        borderRadius: 20
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        color: '#606060',
        fontSize: 26
    },

    underlineStyleHighLighted: {
        borderColor: "#000",
    },
    btnSelectionView: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 4,
        marginTop: 24,
        overflow: 'hidden'
    },
    errorView: {
        marginTop: -10
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
    linkBtn: {
        marginTop: 16,
        justifyContent: 'center',
        alignSelf: 'center'
    }

}


const styles = StyleSheet.create(loginStyle);

export default styles;
