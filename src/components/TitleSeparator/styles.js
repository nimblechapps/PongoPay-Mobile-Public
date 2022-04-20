
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"
import { fontSmall12 } from '../../utils/theme';

let TitleSeparator = {
    line: {
        height: 1,
        width: '30%',
        backgroundColor: Color.Grey,
        margin: 10
    },
    separator: {
        margin: 5,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontFamily: "Montserrat-Regular",
        fontSize: fontSmall12,
    }

}

const styles = StyleSheet.create(TitleSeparator);

export default styles;
