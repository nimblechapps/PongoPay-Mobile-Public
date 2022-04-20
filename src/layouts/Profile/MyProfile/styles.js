
import { StyleSheet } from 'react-native';
import Color from "../../../utils/color"
import Globals from "../../../utils/Globals";
import { fontXSmall16 } from '../../../utils/theme';


let myReposrtScreen = {

    container: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_COLOR,
    },
    userPhotoStyle: {
        // width: (Globals.isIpad ? "30%" : 160),
        width: (Globals.isIpad ? 160 : 120),
        aspectRatio: 1,
        marginRight: (Globals.isIpad ? 60 : 0),
        borderRadius: (Globals.isIpad ? 160 : 120) / 2,
    },
    profileSignature: {
        flexDirection: "row",
        justifyContent: (Globals.isIpad ? "center" : "space-between"),
        alignItems: "center",
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: (Globals.isIpad ? 70 : 48),
        paddingTop: (Globals.isIpad ? 55 : 30),
        justifyContent: 'center'
    },
    informationDetails: {
        paddingLeft: 22,
        paddingRight: 22,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center'
    },
    codeDetails: {
        paddingHorizontal: 22,
        paddingTop:22,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center'
    },
    copyCode: {
        flexDirection: 'row', 
        alignItems: 'center',
        
    },
    codeLabel: {
       
        paddingHorizontal: 15,
        paddingVertical:5,
        alignItems:'center'
    },
    shareIcon:{
        fontSize: fontXSmall16,
        paddingTop: 2,
    },
    dashedBorder: {
        borderStyle: 'dashed',
        borderWidth: 1,
        marginRight: 20,
    },
    borderLine: {
        width: 240,
        height: 1,
        backgroundColor: Color.WhiteGrey,
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 16,
    },
    btnStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 15,
        marginBottom: 10
    },
    safeVStyle: {
        flex: 1,
    },
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
