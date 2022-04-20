import {
    StyleSheet, Dimensions
} from 'react-native';
import Color from "../../utils/color"


let myReposrtScreen = {

    container: {
        flex: 1,
    },
    safeVStyle: {
        flex: 1
    },
    footerBottom: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Color.WHITE,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 5,
        paddingTop: 15,
    },
    inputBox: {
        backgroundColor: Color.WHITE,
        width: "75%",
        height: 32,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Color.LightGrey,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 5,
        paddingBottom: 5,

    },
}


const styles = StyleSheet.create(myReposrtScreen);

export default styles;
