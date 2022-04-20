//Dimention utils to tack relative width and height.

import {Dimensions} from 'react-native';

const width =  Dimensions.get('window').width;
const height = Dimensions.get('window').height ;


const relativeWidth = num => (width * num) / 100;
const relativeHeight = num => (height * num) / 100;

export {relativeWidth, relativeHeight , height , width};
