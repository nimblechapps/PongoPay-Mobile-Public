
import { StyleSheet, Dimensions } from 'react-native';
import Color from "../../../utils/color"
import Globals from "../../../utils/Globals";
import { screenHeight, fontSmall18 } from "../../../utils/theme";

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
    button: {
        height: 48,
    },
    labelView: {
        flexDirection: "row",
        marginVertical: 5,
        marginHorizontal: 10,
        flexWrap: 'wrap'
    },
    KMbutton: {
        backgroundColor: Color.LightBlue,
        width: "47%",
        height: 48,
        color: Color.WHITE,
    },
    safeVStyle: {
        flex: 1,
    },
    seeAllBox: {
        marginTop: Platform.OS === 'android' ? screenHeight - 300 : screenHeight - 250,
        // marginTop: Dimensions.get('window').width,
        height: Platform.OS === 'android' ? screenHeight - 250 : screenHeight - 400,
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
    approveContractBtn: {
        backgroundColor: Color.Yellow,
        width: '100%',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    SwipeListView: {
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        paddingTop: 16,
    },
    btnRow: {
        flexDirection: "row",
    },
    checkIcon: {
        fontSize: fontSmall18,
        color: Color.LightGrey,
        position: 'absolute',
        top: 0,
        left: 0
    },
    rowView: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: "center",
    },
    headerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        width: '100%',
        backgroundColor: Color.LightBlue, padding: 10,
    },
    horizonatalMainView: {
        width: Dimensions.get("window").width - 32, marginHorizontal: 16, borderWidth: 0.5, borderColor: Color.LightGrey
    },
    bottomNextPrevious: {
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center',
        paddingVertical: 20,
    },
    btnEditDelete: {
        height: 50,
        width: 40,
        alignItems: "center", justifyContent: "center"
    }

}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
