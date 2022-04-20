import {StyleSheet} from 'react-native';
import Color from '../../utils/color';
import {fontXSmall16, fontLarge24, fontSmall18, screenWidth} from '../../utils/theme';

let myReposrtScreen = {
  container: {
    flex: 1,
  },
  safeVStyle: {
    flex: 1,
  },
  informationDetails: {
    paddingLeft: 22,
    paddingRight: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Color.LightGrey,
    borderRadius: 4,
    height: 48,
    paddingLeft: 15,
    paddingRight: 15,
  },
  selectDropdown: {
    borderWidth: 1,
    borderColor: Color.LightGrey,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  startDate: {
    width: Globals.isIpad ? 400 : screenWidth - 30,
    marginBottom: 20,
  },
  textItem: {
    // lineHeight: 20,
    // paddingBottom: 16,
    // backgroundColor:"yellow",
  },
  addNewDetails: {},
  createBtn: {
    backgroundColor: Color.GreyLightColor,
    borderRadius: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    alignSelf: 'flex-end',
  },
  checkIcon: {
    fontSize: fontSmall18,
    color: Color.LightGrey,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  labelCss: {
    zIndex: -11,
    marginBottom: 5,
    flexDirection: 'row',
    paddingTop: 16,
  },
};

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
