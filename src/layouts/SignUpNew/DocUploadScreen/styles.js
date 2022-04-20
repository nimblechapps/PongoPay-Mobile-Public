
import { StyleSheet, Dimensions } from 'react-native';
import Color from "../../../utils/color"
import { largeCutoff, mediumCutoff, screenHeight, screenWidth,isIOS} from "../../../utils/theme"
import Globals from "../../../utils/Globals";
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { width } from '../../../utils/dimensions';

let loginStyle = {
    container: {
        height: screenHeight,
        width: screenWidth,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: Color.WHITE,
        flex: 1
    },
    logoStyle: {
        alignSelf: 'flex-start',
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 24,
    },
    logoMainView: {
        width: '100%',
        paddingHorizontal: 20,
    },
    logoMainViewPad: {
        width: 450,
        paddingHorizontal: 20

    },
    centerView: {
        marginTop: 12
    },
    mainView: {
        width: screenWidth - 40,
        alignSelf: 'center'
    },
    mainViewPad: {
        width: 450,
    },
    scrollView: {
        position: 'relative',
        // flex: 1  
    },
    profileMainView: {
        paddingTop: 24,
        position: 'relative'
    },
    uploadBtn: {
        height: 180,
        width: '100%',
        borderRadius: 10,
        borderColor: Color.Grey,
        borderWidth: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        paddingHorizontal: 50
    },
    uploadImg: {
        height: 46,
        marginBottom: 20,
        resizeMode: 'contain'
    },
    uploadDocument:{
        height:170,
        resizeMode:`cover`,
        borderRadius:10,
        ...ifIphoneX({
            width:240
        }, {
            width:isIOS ? 250:230
        })
    },
    btnPos: {
        // position: 'absolute',
        // bottom: 40,
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20

    },
    lastMainBtn: {
        marginVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        zIndex: -1
    },
    deleteBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 35,
        right: 10,
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: Color.Red,
        zIndex: 9,
        elevation: 9
    }


}


const styles = StyleSheet.create(loginStyle);

export default styles;
