import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';
import Color from "../../utils/color"
import { largeCutoff, mediumCutoff } from "./../../utils/theme"
import { fontLarge24, fontLarge22, fontNormal20, fontSmall18, fontXSmall16, fontSmall14, fontSmall12 } from '../../utils/theme';
import Global from "./../../utils/Globals";

let textStyle = {
    fieldStyle: {
        fontSize: fontXSmall16,
        fontFamily: "Montserrat-Regular",
        height: 48,
        padding: 0,
        color: Color.BLACK,
        borderWidth: 1,
        borderColor: Color.LightGrey,
        borderRadius: 4,
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        // textAlignVertical: 'top'
    },
    fieldViewStyle: {
        marginBottom: 16,
    },
    countryCodeMain: {
        width: '20%',
        borderWidth: 1,
        borderRadius: 4,
        marginRight: 10,
        height: 48,
        borderColor: Color.LightGrey,
        backgroundColor: Color.WHITE,
    },
    countryCodeMainPad: {
        width: '20%',
        borderWidth: 1,
        borderRadius: 4,
        marginRight: 10,
        height: 48,
        borderColor: Color.LightGrey,
        backgroundColor: Color.WHITE,
    },
    countryBtn: {
        width: '100%',
        height: 48,
        alignItems: "center",
        justifyContent: 'center'
    },
    flagView: {
        opacity: 0,
        height: 46,
        position: "absolute",
        top: 0,
        width: '100%',
        alignItems: "center",
        zIndex: 1,
        justifyContent: "center"
    },
    flagViewPad: {
        opacity: 0,
        height: 46,
        position: "absolute",
        top: 0,
        width: '100%',
        alignItems: "center",
        zIndex: 1,
        justifyContent: "center"
    },
    flagCodeView: {
        width: "100%",
        height: 48,
        marginLeft: "-18%",
        textAlign: "center",
        color: Color.DarkGrey,
    },
    flagCodeViewPad: {
        width: "100%",
        height: 48,
        marginLeft: "-18%",
        textAlign: "center",
        color: Color.DarkGrey,
    },
    iconMobileView: {
        color: Color.DarkGrey,
        position: "absolute",
        right: 6,
        top: 20,
        fontSize: 8,
    },
    iconPadView: {
        color: Color.DarkGrey,
        position: "absolute",
        right: 10,
        top: 18,
        fontSize: 8
    },
    buttonStyle: {
        width: 46,
        paddingLeft: 10,
        paddingRight: 10,
        position: "absolute",
        right: 1,
        top: 1,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.WHITE,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,

    },
    iconStyle: {
        fontSize: fontXSmall16,
        color: Color.LightGrey,
        paddingTop: 10,
    }
}


const screenDims = Dimensions.get("screen")
if (screenDims.height > largeCutoff) {
    //large

} else if (screenDims.height > mediumCutoff) {
    //medium

} else {
    //small
    textStyle.fieldViewStyle.marginTop = 0
    textStyle.fieldStyle.height = 40
}
//@ts-ignore
const styles = StyleSheet.create(textStyle);

export default styles;
