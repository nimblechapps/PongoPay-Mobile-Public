import React, { Component } from 'react';
import { TextInput, View } from 'react-native';
import Color from './../../utils/color';
import Label from './../Label';
import PropTypes from 'prop-types';
import styles from './styles';
import ToolTip from '../Tooltip';

class TextField extends Component {
  constructor(props) {
    super(props);
    console.log('Tooltip', props.toolTip);
    this.state = {
      isvisible: props.secureTextEntry,
      showToolTip: false,
    };
  }

  spaceValidation = str => {
    let array = Array.from(str);
    let input = '';
    let isSpace = false;
    for (let a in array) {
      if (array[a] != ' ') {
        isSpace = true;
        input += array[a];
      } else if (isSpace) {
        input += array[a];
      }
    }
    console.log('input', input);
    return input;
  };
  onTooltipClick = () => {
    console.log('Tooltip click');
    this.setState(
      {
        showToolTip: !this.state.showToolTip,
      },
      () => {
        console.log('Show tooltip', this.state.showToolTip);
      },
    );
  };
  render() {
    return (
      <View style={styles.fieldViewStyle}>
        {this.props.isTooltip ? (
          <View
            style={{
              paddingTop: 24,
              borderBottomWidth: 1,
              borderBottomColor: Color.WhiteGrey,
              flexDirection: 'row',
              zIndex: 11,
            }}>
            <Label
              fontSize_16
              Montserrat_Regular
              color={Color.DarkGrey}
              style={{ marginBottom: 10 }}>
              {this.props.LabelTitle}
            </Label>
            <ToolTip
              onClickPress={this.onTooltipClick}
              toolTip={this.state.showToolTip}
              title={this.props.toolTipTitle}
              customTriangle={this.props.customTriangle}
            />
          </View>
        ) : (
          <Label
            fontSize_16
            Montserrat_Regular
            color={Color.DarkGrey}
            style={[{ marginBottom: 10 }, this.props.labelStyle]}>
            {this.props.LabelTitle}
          </Label>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            editable={!this.props.disabled}
            style={[styles.fieldStyle, this.props.customStyle]}
            keyboardType={this.props.keyboardType}
            placeholder={this.props.placeholder}
            autoCapitalize={this.props.autoCapitalize}
            onChangeText={value => {
              if (!(value == ' ' && !value)) {
                value = this.spaceValidation(value);
                this.props.onChangeText(value);
              }
            }}
            onFocus={this.props.onFocus}
            // onFocus={false}
            value={this.props.value}
            multiline={this.props.multiline}
            // autoFocus={this.props.autoFocus}
            autoFocus={false}
            secureTextEntry={this.props.secureTextEntry}
            ref={this.props.reference}
            onSubmitEditing={this.props.onSubmitEditing}
            returnKeyType={this.props.returnKeyType}
            blurOnSubmit={this.props.multiline}
            autoCapitalize={this.props.autoCapitalize}
          />
        </View>
        {this.props.children}
      </View>
    );
  }
}

TextField.defaultProps = {
  title: '',
  separatorColor: Color.TEXTFIELD_TITLE,
};

TextField.propTypes = {
  title: PropTypes.string,
};

export default TextField;
