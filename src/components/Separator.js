
import React, { Component } from 'react';
import { View } from 'react-native';
import Color from '../utils/color'
import Globals from "../utils/Globals";

class Separator extends Component {
  render() {
    return (
      <View style={
        [styles.containerStyle, {
          backgroundColor: this.props.separatorColor,
        }, this.props.style]} >
      </View>
    )
  }
}

const styles = {
  containerStyle: {
    height: (Globals.isIpad ? 1 : 0.5),
    width: '100%'
  }
}

Separator.Default = {
  separatorColor: Color.TEXTFIELD_TITLE
}

export default Separator;
