
import { StyleSheet, Platform, Dimensions } from 'react-native';
import Color from "../../utils/color";
import { largeCutoff, screenHeight, isIOS, fontSmall18 } from "../../utils/theme";
import { ifIphoneX } from 'react-native-iphone-x-helper';

let filterDropDown = {
    filterBox: {
        backgroundColor: Color.WHITE,
        position: "absolute",
        right: 5,
        top: isIOS() ? (screenHeight > largeCutoff ? 170 : 150) : 51,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 24,
        width: Dimensions.get("window").width - 50,
        height: Dimensions.get("window").height - 10,
        ...ifIphoneX(
            {
                height: Dimensions.get("window").height - 80,
            },

        )
    },
    buliderFilter: {
        backgroundColor: Color.WHITE,
        position: "absolute",
        right: 5,
        top: isIOS() ? (screenHeight > largeCutoff ? 100 : 80) : 51,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 24,
        width: Dimensions.get("window").width - 50,
        height: Dimensions.get("window").height - 10,
        ...ifIphoneX(
            {
                height: Dimensions.get("window").height - 50,
            },

        )
    },

    buliderFilterBoxPad: {
        backgroundColor: Color.WHITE,
        position: "absolute",
        right: 3,
        top: Platform.OS === 'android' ? 80 : 45,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 24,
        width: 250,
        height: Dimensions.get("window").height - 20,
    },
    filterBoxPad: {
        backgroundColor: Color.WHITE,
        position: "absolute",
        right: 3,
        top: Platform.OS === 'android' ? 150 : 85,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 24,
        width: 250,
        height: Dimensions.get("window").height - 20,
    },
    checkboxMain: {
        flex: 1,
        marginBottom: 8,
        marginTop: 8,

    },

    checkIcon: {
        fontSize: fontSmall18,
        color: Color.LightGrey,
        position: 'absolute',
        top: 5,
        left: 0
    },
    // triangle: {
    //     width: 0,
    //     height: 0,
    //     borderBottomWidth: 18,
    //     borderRightWidth: 10,
    //     borderLeftWidth: 10,
    //     position: 'absolute',
    //     right: 9,
    //     top: -18,
    //     borderBottomColor: Color.WHITE,
    //     borderLeftColor: Color.TRANSPARENT,
    //     borderRightColor: Color.TRANSPARENT,
    //     zIndex: 11,
    // },
    // triangleBox: {
    //     width: 5,
    //     height: 5,
    //     backgroundColor: Color.WHITE,
    //     position: 'absolute',
    //     right: 17,
    //     top: -12,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 0 },
    //     shadowOpacity: 0.5,
    //     shadowRadius: 5,
    //     elevation: 1,
    // },
    button: {
        backgroundColor: Color.LightBlue,
        width: 112,
        height: 40,
        color: Color.WHITE,
    },
    filterTriggle: {
        position: "absolute",
        top: -25,
        right: 3,
    },
}

const styles = StyleSheet.create(filterDropDown);

export default styles;
