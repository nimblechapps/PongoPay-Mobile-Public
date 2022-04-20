import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Text,
  Linking
} from 'react-native';
import CustomIcon from '../CustomIcon';
import { createStyles, minWidth } from 'react-native-media-queries';
import {
  fontSmall14,
  fontLarge24,
} from '../../utils/theme';
import Tooltip from 'react-native-walkthrough-tooltip';
import Color from '../../utils/color';

export default class ToolTip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onClickPress, title, link } = this.props;
    return (
      <Tooltip
        // backgroundColor={'transparent'}
        isVisible={this.props.toolTip}
        showChildInTooltip={false}
        content={
          this.props.renderView ? this.props.renderView() :
            <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
              <Text style={{}} >{title}</Text>
            </View>

        }

        placement={this.props.placement}
        onClose={onClickPress}
        contentStyle={styles.toolTipContent}
      >
        {this.props.children ? this.props.children : <TouchableOpacity style={styles.touchable} onPress={onClickPress}>
          <CustomIcon
            name={'info'}
            style={[styles.infoIcon, this.props.customIcon]}
          />
        </TouchableOpacity>}
      </Tooltip>

    );

  }
}

ToolTip.defaultProps = {
  placement: 'bottom',
  link: undefined
}

const base = StyleSheet.create({
  container: {
    // flex: 1,

  },
  toolTipContent: {
    backgroundColor: Color.WHITE,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    paddingTop: 10,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 15,
    width: Dimensions.get('window').width - 50
  },
  tipCss: {
    fontFamily: 'Montserrat-Medium',

  },
  infoIcon: {
    fontSize: fontLarge24,
    color: Color.DarkGrey,
  }
});

const styles = createStyles(
  base,
  minWidth(480, {
    textStyle: {
      fontSize: fontSmall14,
    },
  }),
);
