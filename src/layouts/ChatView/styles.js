
import { StyleSheet } from 'react-native';
import Color from "../../utils/color"
import { fontSmall12 } from '../../utils/theme';

let myReposrtScreen = {
    image: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
    },
    safeVStyle: {
        flex: 1,
    },
    footerBottom: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Color.WHITE,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        // elevation: 5,
        paddingTop: 15,
        // marginBottom: 15,
    },
    inputBox: {
        backgroundColor: Color.WHITE,
        width: "75%",
        height: 32,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Color.LightGrey,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 5,
        paddingBottom: 5,
    },
    leftFileBubble: {
        alignSelf: 'flex-start',
        borderRadius: 15,
        padding: 10,
        marginLeft: 9,
        marginRight: 9,
        marginBottom: 10,
        backgroundColor: Color.WhiteBlueLight,
        maxWidth: 400
    },
    rightFileBubble: {
        alignSelf: 'flex-end',
        borderRadius: 15,
        padding: 10,
        marginLeft: 9,
        marginRight: 9,
        marginBottom: 10,
        backgroundColor: Color.LightBlue,
        maxWidth: 400
    },
    leftmessageText: {
        fontSize: 14,
        marginLeft: 0,
        color: Color.DarkGrey,
    },
    rightmessageText: {
        fontSize: 14,
        marginLeft: 0,
        color: Color.WHITE,
    },
    leftsenderText: {
        fontFamily: "Montserrat-Bold",
        fontSize: fontSmall12,
        marginLeft: 0,
        color: Color.DarkGrey,
        paddingBottom: 8
    },
    rightsenderText: {
        fontFamily: "Montserrat-Bold",
        fontSize: fontSmall12,
        marginLeft: 0,
        color: Color.WHITE,
        paddingBottom: 8
    },
    lefttimeText: {
        alignSelf: 'flex-start',
        fontSize: 12,
        color: Color.DarkGrey,
        paddingTop: 5
    },
    righttimeText: {
        alignSelf: 'flex-start',
        fontSize: 12,
        color: Color.WHITE,
        paddingTop: 5
    }

}


const styles = StyleSheet.create(myReposrtScreen);

export default styles;
