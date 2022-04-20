
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"

let myReposrtScreen = {
    container: {
        flex: 1,
        backgroundColor: Color.WHITE,
    },
    safeVStyle: {
        flex: 1,
    },
    listMain: {
        paddingLeft: 32,
        paddingRight: 32,
        paddingBottom: 24,
        paddingTop: 24,
        borderBottomWidth: 1,
        borderBottomColor: Color.WhiteGrey,
    },
    addressMobile: {
        paddingLeft: 70,
    },
    addressPad: {
        paddingLeft: 83
    }
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
