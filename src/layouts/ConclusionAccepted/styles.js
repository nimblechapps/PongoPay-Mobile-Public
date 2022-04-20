import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';
import Color from "../../utils/color"
import Globals from "../../utils/Globals";
import { fontLarge24, fontLarge22, fontNormal20, fontSmall18, fontXSmall16, fontSmall14, fontSmall12 } from '../../utils/theme';
let myReposrtScreen = {

    container: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_COLOR,
    },
    safeVStyle: {
        flex: 1,
    },


}


const styles = StyleSheet.create(myReposrtScreen);

export default styles;
