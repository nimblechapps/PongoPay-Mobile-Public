
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"

let userDetails = {
    containerStyle: {
        flex: 1,
    },
    navigationInsideStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 24,
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

const styles = StyleSheet.create(userDetails);

export default styles;
