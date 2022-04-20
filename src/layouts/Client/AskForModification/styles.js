
import { StyleSheet } from 'react-native';
import Color from "../../../utils/color"

let myReposrtScreen = {
    container: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_COLOR,
    },
    safeVStyle: {
        flex: 1,
    },
    button: {
        backgroundColor: Color.LightBlue,
        width: "47%",
        height: 48,
        color: Color.WHITE,
    },
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
