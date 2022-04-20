
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
        paddingLeft: 22,
        paddingRight: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBox: {
        paddingLeft: 16,
        paddingRight: 16,
    },
    boxPadding: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
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
    btnRow: {
        flexDirection: "row",
    },
    safeVStyle: {
        flex: 1,
    },
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
