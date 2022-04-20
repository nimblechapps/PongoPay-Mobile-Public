
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"
import Globals from "../../utils/Globals";
import { fontSmall18 } from "../../utils/theme";

let myReposrtScreen = {
    container: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_COLOR,
    },
    informationDetails: {
        marginTop: 40,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
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
    checkIcon: {
        fontSize: fontSmall18,
        color: Color.LightGrey,
        position: 'absolute',
        top: 1,
        left: 0
    },
    checkboxMain: {
        flex: 1,
        marginBottom: 8,
        marginTop: 8,

    },
    safeVStyle: {
        flex: 1,
    },
    button: {
        height: 48,
        width: '100%',
        backgroundColor: Color.Yellow,
        color: Color.WHITE,
        borderRadius: 0

    }
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
