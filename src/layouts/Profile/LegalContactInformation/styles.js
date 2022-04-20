
import { StyleSheet } from 'react-native';
import Color from "../../../utils/color"
import Globals from "../../../utils/Globals";

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
        marginTop: 40,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
    },
    borderLine: {
        width: 240,
        height: 1,
        backgroundColor: Color.WhiteGrey,
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 16,
    },
    errorTxt: {
        flexDirection: "row",
        backgroundColor: Color.WHITE,
        marginTop: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        padding: 8,
    },
    btnStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 15,
        marginBottom: 10
    },
    safeVStyle: {
        flex: 1,
    },
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
