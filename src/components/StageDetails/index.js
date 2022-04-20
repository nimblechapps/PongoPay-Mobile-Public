
import React, { Component } from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import Color from '../../utils/color';
import Label from '../Label';
import styles from "./styles";
import CustomIcon from "../CustomIcon";
import { fontXSmall16 } from '../../utils/theme';
import { getJobStatus } from '../../utils/GetUserStatus';

class StageDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { data } = this.props;

        return (
            <SafeAreaView>
                <TouchableOpacity style={styles.navigationInsideStyle}>
                    <View>
                        <Label Montserrat_Medium fontSize_16 color={Color.BLACK} mb={10}>{data.sMilestoneTitle}</Label>
                        <View style={{ flexDirection: "row", paddingBottom: 6, }}>
                            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>Payment Stage Status:</Label>
                            <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>{getJobStatus(data.nMilestoneStatus)[0]}</Label>
                        </View>
                        <View style={{ flexDirection: "row", paddingBottom: 6, }}>
                            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey} >Payment Stage Amount:</Label>
                            <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>£ {data.nMilestoneAmount}</Label>
                        </View>
                    </View>
                    <View style={{ marginRight: 0, }}>
                        <CustomIcon name="right_arrow" style={{ fontSize: fontXSmall16, color: Color.DarkGrey }} />
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

StageDetails.defaultProps = {
    notification: true
}

export default StageDetails;
