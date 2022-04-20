/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import Label from '../../../components/Label';
import Color from '../../../utils/color'
import HeaderTitle from '../../../components/Header/HeaderTitle';
import styles from "./styles"
import CustomIcon from "../../../components/CustomIcon";
import { fontXSmall16 } from '../../../utils/theme';
import { Routes } from '../../../utils/Routes';
import { getJobStatus, getMilestoneStatus } from '../../../utils/GetUserStatus';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';

export default class MilestoneListingClient extends Component {
    static navigationOptions = ({ }) => {
        return {
            headerTitle: () => <HeaderTitle title={"Milestones"} />,
        }
    };

    constructor(props) {
        super(props);
        const { params = {} } = props.navigation.state;
        this.state = {
            modalVisible: false,
            milestones: [],
            jobId: params.jobId,
        }
    };

    componentDidMount = () => {
        this.getAllMilestones();
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    };

    renderItem(data) {
        const { navigate } = this.props.navigation;
        console.log("data", data)
        let m = data.item
        return (
            <View style={{ justifyContent: "space-between", flexDirection: "row", }}>
                <TouchableOpacity style={styles.SwipeListView} onPress={() => {
                    navigate(Routes.Client_Milestone_Detail)
                }}>
                    <View>
                        <Label Montserrat_Medium fontSize_16 color={Color.BLACK} mb={10}>{m.sMilestoneTitle}</Label>
                        <View style={{ flexDirection: "row", paddingBottom: 6, }}>
                            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>Payment Stage Status:</Label>
                            <Label Montserrat_Medium fontSize_14 color={Color.LightBlue} ml={4}>{getMilestoneStatus(m.nMilestoneStatus)[0].milestoneStatus}</Label>
                        </View>
                        <View style={{ flexDirection: "row", paddingBottom: 6, }}>
                            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey} >Payment Stage Amount:</Label>
                            <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>£ {m.nMilestoneAmount}</Label>
                        </View>
                    </View>
                    <View style={{ marginRight: 0, }}>
                        <CustomIcon name={"right_arrow"} style={{ fontSize: fontXSmall16, color: Color.DarkGrey }} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }


    render() {
        const { isLoading, milestones } = this.state;
        return (
            <View style={styles.container}>
                {/* <FilterDropdown />   */}
                <SafeAreaView style={styles.safeVStyle}>
                    <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 16, }}>
                        <Label fontSize_14 Montserrat_Bold mb={18}>Payment Stages Breakdown</Label>
                    </View>
                    <FlatList
                        data={milestones}
                        renderItem={item => this.renderItem(item)}
                    />
                </SafeAreaView>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={{ height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: Color.ModalBG }}>
                        <View style={{ backgroundColor: Color.WHITE, borderRadius: 8, width: 232, }}>
                            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey}>Are you sure you want to remove this Payment Stage?</Label>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <TouchableOpacity style={{ width: '50%', paddingBottom: 16, paddingTop: 16, alignItems: "center", justifyContent: "center" }}>
                                    <Label fontSize_14 Montserrat_Regular color={Color.LightBlue}>Confirm</Label>
                                </TouchableOpacity>
                                <View style={{ height: '100%', width: 1, backgroundColor: Color.WhiteGrey }}></View>
                                <TouchableOpacity style={{ width: '50%', paddingBottom: 16, paddingTop: 16, alignItems: "center", justifyContent: "center" }}>
                                    <Label fontSize_14 Montserrat_Regular color={Color.LightBlue}>No</Label>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
                {isLoading && <ProgressHud />}
            </View>
        );
    }
    getAllMilestones = async () => {
        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        try {
            let request = {
                jobId: this.state.jobId,
            };

            let response = await API.getAllMilestone(request)
            this.setState({ isLoading: false });
            console.log("getAllMilestone response", response.data)
            if (response.status) {
                this.setState({
                    milestones: response.data
                })
            }
        } catch (error) {
            console.log("getAllMilestone error", error.message);
            this.setState({ isLoading: false });
        }
    }
}

