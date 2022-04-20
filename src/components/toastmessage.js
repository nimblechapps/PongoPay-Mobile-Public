import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-root-toast';
import Color from '../utils/color';
import {
  fontXSmall16,
  fontLarge24,
  screenWidth,
  isIOS,
  fontSmall18,
} from '../utils/theme';
import Label from './Label';
import Globals from '../utils/Globals';
import CustomIcon from '../components/CustomIcon';

export default class ToastMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // warning: false
    };
  }
  render() {
    const {
      isVisible,
      message,
      mainViewCustom,
      successIconCustom,
      massageTextCustom,
      isError,
    } = this.props;

    return (
      isVisible ? (
        <View style={styles.toastView} backgroundColor={Color.WHITE}>
          <CustomIcon
            name={!isError ? 'success' : 'warning'}
            color={!isError ? Color.Green : Color.Red}
            style={[styles.successIcon, successIconCustom]}
          />
          <Label style={[styles.massageText, massageTextCustom]}>
            {message}
          </Label>
        </View>
      )
        : null
    );
  }
}

const styles = StyleSheet.create({
  toastView: {
    width: Globals.isIpad ? 400 : screenWidth - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1,
    borderRadius: 50,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 6,
    position: 'absolute',
    left: 15,
    top: isIOS() ? 90 : 0 - Globals.isIpad ? 120 : 80,
  },
  massageText: {
    color: Color.DarkGrey,
    fontSize: fontXSmall16,
    paddingLeft: 45,
  },
  successIcon: {
    fontSize: fontSmall18,
    marginTop: 2,
    position: 'absolute',
    left: 15,
  },
  mainView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
