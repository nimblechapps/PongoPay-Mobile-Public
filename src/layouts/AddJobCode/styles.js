
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"

let myReposrtScreen = {
    container: {
        flex: 1,
    },
    safeVStyle: {
        flex: 1,
    },
    scrollView: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flex: 1
    },
    scrollViewPad: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flex: 1
    },
    boxInput: {
        paddingTop: 80,
        paddingBottom: 24,
        paddingLeft: 16,
        paddingRight: 16,
    },
    boxInputPad: {
        paddingTop: 200,
        paddingLeft: 16,
        paddingRight: 16,
    }


}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
