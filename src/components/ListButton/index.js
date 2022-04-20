
import React, { Component } from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import Color from '../../utils/color'
import Label from '../Label';
import { fontXSmall16 } from './../../utils/theme';
import styles from "./styles";
import CustomIcon from "../CustomIcon";
import ToolTip from '../Tooltip';

class ListButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toolTip: false
        }
    }
    showInfo = () => {
        this.setState({ toolTip: !this.state.toolTip })
    }

    render() {
        return (
            <SafeAreaView>
                <View style={[styles.navigationInsideStyle, {}]}>
                    <TouchableOpacity onPress={this.props.onPress} style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 24, paddingTop: 24, paddingLeft: 16, paddingRight: 16, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Label Montserrat_Medium fontSize_16 color={Color.BLACK} style={{ width: 250 }}>{this.props.Title}</Label>
                            {this.props.showNewView &&
                                <View style={{ height: 8, width: 8, borderRadius: 5, backgroundColor: Color.DarkBlue, marginLeft: 8, marginTop: 8 }} />}
                        </View>

                        {this.props.info && <ToolTip
                            placement={this.props.toolTipPosition}
                            title={this.props.info}
                            toolTip={this.state.toolTip}
                            onClickPress={() => this.showInfo()} />}

                        <CustomIcon name={"right_arrow"} style={{ fontSize: fontXSmall16, paddingTop: 2 }} />

                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

ListButton.defaultProps = {
    notification: true,
    info: undefined,
}

export default ListButton;
