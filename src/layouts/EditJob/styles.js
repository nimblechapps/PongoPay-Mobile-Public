
import { StyleSheet } from 'react-native';
import Color from "../../utils/color";
import { fontLarge22 } from "../../utils/theme";
import color from '../../utils/color';

let myReposrtScreen = {
    container: {
        flex: 1,
    },
    safeVStyle: {
        flex: 1,
    },
    informationDetails: {
        paddingLeft: 22,
        paddingRight: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Color.LightGrey,
        borderRadius: 4,
        height: 48,
        paddingLeft: 15,
        paddingRight: 15
    },
    selectDropdown: {
        borderWidth: 1,
        borderColor: Color.LightGrey,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    textItem: {
        lineHeight: 20,
        paddingBottom: 16,
    },
    addNewDetails: {
    },
    createBtn: {
        backgroundColor: Color.GreyLightColor,
        borderRadius: 0,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        alignSelf: 'flex-end',
    },
    checkIcon: {
        width: 24,
        height: 24,
        backgroundColor: Color.WHITE,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Color.LightGrey
    },
    checkedIcon: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Color.LightGrey,
        backgroundColor: Color.WHITE,
        color: Color.Green,
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 22,
        textAlign: "center"
    }
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
