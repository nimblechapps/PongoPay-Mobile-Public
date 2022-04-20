import {
    StyleSheet,
    Dimensions
} from 'react-native';
import Color from "../../utils/color"
import { largeCutoff, mediumCutoff } from "../../utils/theme"

let customNavigation = {
    containerStyle: {
        flexDirection: 'row',
        backgroundColor: Color.WHITE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 1,
    },
    navigationInsideStyle: {
        width: Dimensions.get("window").width - 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: 10,
        position: 'absolute',
        bottom: 0,
    },

}


const screenDims = Dimensions.get("screen")
if (screenDims.height > largeCutoff) {
    //large

} else if (screenDims.height > mediumCutoff) {
    //medium

} else {
    //small
}
//@ts-ignore
const styles = StyleSheet.create(customNavigation);

export default styles;
