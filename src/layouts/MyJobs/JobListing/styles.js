
import { StyleSheet, Dimensions } from 'react-native';
import Color from "../../../utils/color"
import Globals from "../../../utils/Globals";
import { largeCutoff, screenHeight, isIOS, fontSmall18 } from "../../../utils/theme";

let myReposrtScreen = {
    container: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_COLOR,
    },
    profileSignature: {
        flexDirection: "row",
        justifyContent: (Globals.isIpad ? "center" : "space-between"),
        alignItems: "center",
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: (Globals.isIpad ? 70 : 48),
        paddingTop: (Globals.isIpad ? 55 : 30),
    },
    informationDetails: {
        paddingLeft: 22,
        paddingRight: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBox: {
        flexDirection: "row",
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
        justifyContent: 'center',
        height: 70,
        alignItems: 'center',
    },
    innerSearch: {
        width: '85%'
    },

    boxPadding: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
    },
    boxPaddingPad: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
    },
    titleBtn: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    titleBtnPad: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    button: {
        backgroundColor: Color.LightBlue,
        width: "47%",
        height: 48,
        color: Color.WHITE,
    },
    safeVStyle: {
        flex: 1,
    },
    SwipeListView: {
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        paddingTop: 16,
    },
    seeAllBox: {
        marginTop: 400,
        height: screenHeight - 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.09,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: Color.WHITE,

    },
    arrowDownBtn: {
        paddingBottom: 16,
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: "center"
    },
    closeBtn: {
        position: "absolute",
        top: 50,
        right: 30,
        alignItems: 'center',
        justifyContent: "center"
    },
    youtubeView: {
        height: Dimensions.get("window").height,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    approveContractBtn: {
        backgroundColor: Color.Yellow,
        width: '100%',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    checkIcon: {
        fontSize: fontSmall18,
        color: Color.LightGrey,
        position: 'absolute',
        top: 0,
        left: 0
    },
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
