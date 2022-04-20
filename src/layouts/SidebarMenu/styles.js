
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"
import Globals from "../../utils/Globals";

let myReposrtScreen = {

    container: {
        flex: 1,
        backgroundColor: Color.WHITE,
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
    logoMain: {
        width: '100%',
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
    },
    logoStyle: {
        width: 90,
        aspectRatio: 1,
    },
    menuList: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
    },
    modalBtn: {
        width: '50%',
        paddingTop: 16,
        paddingBottom: 16
    },
    safeVStyle: {
        flex: 1,
    },

}


const styles = StyleSheet.create(myReposrtScreen);

export default styles;
