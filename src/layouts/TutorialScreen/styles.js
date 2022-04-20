import { StyleSheet, Dimensions, ratio } from 'react-native';
import Color from '../../utils/color';
import Globals from '../../utils/Globals';
import { fontSmall16 } from '../../utils/theme';
import { ifIphoneX } from 'react-native-iphone-x-helper';

let myReposrtScreen = {
  container: {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
  },
  safeVStyle: {
    flex: 1,
  },
  mainRenderSection: {
    width: Dimensions.get('window').width,
    ...ifIphoneX(
      {
        paddingTop: 40,
      },
      {
        paddingTop: 45,
      },
    ),
  },
  paginationSection: {
    flexDirection: 'row',
  },
  paginationDots: {
    width: 6,
    height: 6,
    backgroundColor: Color.Grey,
    borderRadius: 3,
    marginRight: 7,
  },
  activeScreen: {
    width: 18,
    height: 6,
    backgroundColor: Color.Yellow,
    borderRadius: 3,
    marginRight: 7,
  },
  desText: {
    ...ifIphoneX(
      {
        paddingTop: 40,
      },
      {
        // paddingTop: 15,
        marginTop: Platform.OS === 'android' ? 10 : 15,
      },
    ),
    fontFamily: 'Montserrat-Regular',
    color: Color.BLACK,
    fontSize: fontSmall16,
    alignSelf: 'center',
    textAlign: 'center',
    paddingLeft: 22,
    paddingRight: 22,
    lineHeight: 24,
    width: 330,
    // paddingTop: 40,
    minHeight: 150,
  },

  mainPaginationBuilder: {
    ...ifIphoneX(
      {
        marginTop: 20,
      },
      {
        marginTop: 10,
        marginBottom: 10,
      },
    ),
    paddingLeft: 22,
    width: 330,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainPaginationClient: {
    paddingLeft: 22,
    marginTop: 20,
    width: 330,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageSection: {
    ...ifIphoneX(
      {},
      {
        height:
          Platform.OS === 'android'
            ? Dimensions.get('window').height - 180
            : Dimensions.get('window').height - 220,
      },
    ),
  },
  imageTag: {
    ...ifIphoneX(
      {},
      {
        height: '100%',
      },
    ),
    // alignSelf: 'flex-end',
    resizeMode: 'contain',
    bottom: 25

  },

  nextText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: fontSmall16,
    color: Color.LightBlue,
    paddingRight: 22,
  },
  right: {
    alignSelf: 'flex-end',
  }
};

const styles = StyleSheet.create(myReposrtScreen);

export default styles;
