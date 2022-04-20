
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"

let myReposrtScreen = {
    container: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_COLOR,
    },
    safeVStyle: {
        flex: 1,
    },
    dropdownMain: {
        borderWidth: 1,
        width: 240,
        position: "absolute",
        backgroundColor: '#F6F6F6',
        borderRadius: 4,
        left: 16,
        top: 70,
        zIndex: 111,
        borderColor: Color.LightGrey
    },
    textItem: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 10,
        paddingTop: 10
    },
    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 240,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    // DropdownOpen: {
    //     width: 240,
    //     zIndex: 1
    // }
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
