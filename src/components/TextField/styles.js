
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"
import { largeCutoff, mediumCutoff, screenHeight } from "./../../utils/theme"
import { fontXSmall16 } from '../../utils/theme';
import PropTypes from 'prop-types';

let textStyle = {
    fieldStyle: {
        fontSize: fontXSmall16,
        fontFamily: "Montserrat-Regular",
        height: 48,
        color: Color.BLACK,
        borderWidth: 1,
        borderColor: Color.LightGrey,
        borderRadius: 4,
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
    },
    fieldViewStyle: {
        marginBottom: 16,
        justifyContent: 'space-between'
    },
}

if (screenHeight > largeCutoff) {
    //large
} else if (screenHeight > mediumCutoff) {
    //medium
} else {
    //small
    textStyle.fieldViewStyle.marginTop = 0
    textStyle.fieldStyle.height = 40
}
//@ts-ignore

const styles = StyleSheet.create(textStyle);

export default styles;
