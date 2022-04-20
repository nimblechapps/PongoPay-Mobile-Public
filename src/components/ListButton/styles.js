
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"

let listButton = {
    containerStyle: {
        flex: 1,
    },
    customStyle: {
        width: "100%",
        backgroundColor: Color.GreyLightColor,
        borderWidth: 0,
    },
    button: {
        backgroundColor: Color.LightBlue,
        width: "47%",
        height: 48,
        color: Color.WHITE,
    },
}

const styles = StyleSheet.create(listButton);

export default styles;
