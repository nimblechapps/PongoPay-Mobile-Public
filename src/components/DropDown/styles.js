
import { StyleSheet } from 'react-native';
import Color from "../../utils/color";
import { fontXSmall16, fontSmall14 } from '../../utils/theme';

let DropDown = {

    mainDrop: {
        flex: 1,
        marginBottom: 16,

    },
    mainLabel: {
        marginBottom: 10,
        // zIndex: -1
    },
    dropDownContainer: {
        borderWidth: 1,
        borderColor: Color.LightGrey,
        borderRadius: 4,
        fontFamily: "Montserrat-Bold",

    },
    dropDownBaseView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden'
    },
    dropDownText: {
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 30,
        fontSize: fontXSmall16,
        fontFamily: "Montserrat-Regular",
        color: Color.DarkGrey,
    },
    dropDownArrow: {
        width: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },


    containerStyle: {
        flex: 1,
    },
    MainDrop: {
        marginBottom: 16,

    },
    DropButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
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
        alignItems: 'center',
        position: 'relative'
    },
    MainLabel: {
        marginBottom: 10,
    },
    DropItems: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        fontSize: fontXSmall16,
        fontFamily: "Montserrat-Regular",
        color: Color.BLACK,
        borderWidth: 1,
        borderColor: Color.LightGrey,
        borderRadius: 4,
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        borderTopWidth: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        position: 'absolute',
        top: 78,
        right: 0,
        left: 0,
        zIndex: 1111,
        backgroundColor: Color.WHITE,
        maxHeight: 200,
        overflow: 'hidden'

    },
    InnerItemLable: {
        color: Color.DarkGrey,
        fontSize: fontSmall14,
        fontFamily: "Montserrat-Regular",
    },
    InnerList: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,

    },
    labelStyle: {
        color: Color.LightGrey,

    },
    selectlabel: {
        color: Color.DarkGrey,
        fontSize: fontSmall14,
        fontFamily: "Montserrat-Regular",
    }


}

const styles = StyleSheet.create(DropDown);

export default styles;
