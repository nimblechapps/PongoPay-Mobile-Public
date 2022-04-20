
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"

let stageDetails = {
    containerStyle: {
        flex: 1,
    },
    navigationInsideStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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

const styles = StyleSheet.create(stageDetails);

export default styles;
