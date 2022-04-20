
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"
import { largeCutoff, mediumCutoff, screenHeight } from "../../utils/theme"
import { fontXSmall16 } from '../../utils/theme';
import PropTypes from 'prop-types';

let paymentViewStyle = {
    payment_main: {
        height: '100%',
        // width: 350,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },
    payment_txt: {
        marginTop: 30,
        fontSize: 16,
        color: Color.DarkGrey,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'Montserrat-medium',
    },
    payment_txt_bold: {
        fontFamily: 'Montserrat-SemiBold',
        color: Color.BLACK,
    },
}

const styles = StyleSheet.create(paymentViewStyle);

export default styles;
