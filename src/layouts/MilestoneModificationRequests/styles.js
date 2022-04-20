
import { StyleSheet, Dimensions } from 'react-native';
import Color from "../../utils/color"

let myReposrtScreen = {
    container: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_COLOR,
    },
    safeVStyle: {
        flex: 1,
        
    },
    NodataView:{
        height: Dimensions.get('window').height - 140 ,
         justifyContent:'center',
         alignItems:'center'
    },
    completeButton:{
        backgroundColor: Color.LightBlue,
        width: "42%",
        height: 38,
        color: Color.WHITE, 
        marginTop : 20
    },
    button: {
        backgroundColor: Color.LightBlue,
        width: "47%",
        height: 48,
        color: Color.WHITE,
    },
}

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
