/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Label from '../../../components/Label';
import Color from '../../../utils/color'
import HeaderTitle from '../../../components/Header/HeaderTitle';
import HeaderRight from '../../../components/Header/HeaderRight';
import styles from "./styles"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fontXSmall16 } from '../../../utils/theme';
import * as Progress from 'react-native-progress';
import { SwipeListView } from 'react-native-swipe-list-view';
import Globals from '../../../utils/Globals';
import { Routes } from '../../../utils/Routes';
import CustomIcon from "../../../components/CustomIcon";
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import { getJobStatus } from '../../../utils/GetUserStatus';


export default class MilestoneListing extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <HeaderTitle title={"Milestones"} />,
            headerRight: (
                <HeaderRight
                    iconName="plus"
                    iconStyle={{ color: Color.LightBlue, marginRight: 5, fontSize: 22 }}
                    onPress={() => {
                        navigation.navigate(Routes.Add_Milestone);
                    }}
                />
            ),
        }
    };

    constructor(props) {
        super(props);
        const { params = {} } = props.navigation.state;
        this.state = {
            modalVisible: false,
            isLoading: false,
            milestones: [],
            jobId: params.jobId,
            jobAmount: params.jobAmount,
            milestonePendingAmount: params.milestonePendingAmount,
            deleteMilestoneId: undefined // to delete milestone
        }
    }

    onCreate = () => {
        this.getAllMilestones();
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    };

    renderItem(data) {
        const { navigate } = this.props.navigation;
        // console.log("T4esting",data)
        let m = data.item

        return (
            <View style={{ justifyContent: "space-between", flexDirection: "row", }}>
                <TouchableOpacity style={styles.SwipeListView} onPress={() => {
                    navigate(Routes.Milestone_Detail, { milestoneDetails: m, jobAmount: this.state.jobAmount, milestonePendingAmount: this.state.milestonePendingAmount })
                }}>
                    <View>
                        <Label Montserrat_Medium fontSize_16 color={Color.BLACK} mb={10}>{m.sMilestoneTitle}</Label>
                        <View style={{ flexDirection: "row", paddingBottom: 6, }}>
                            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>Payment Stage Status:</Label>
                            <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>{getJobStatus(m.nMilestoneStatus)[0]}</Label>
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
                <View style={styles.btnRow}>
                    <TouchableOpacity onPress={() => {
                        this.setModalVisible(true)
                        this.setState({ deleteMilestoneId: m._id })
                    }}
                        style={{ width: 113, backgroundColor: Color.Red, justifyContent: "center", alignItems: "center" }}>
                        <Label fontSize_16 Montserrat_Medium color={Color.WHITE}>DELETE</Label>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigate(Routes.Edit_Milestone, { milestone: m, jobAmount: this.state.jobAmount, milestonePendingAmount: this.state.milestonePendingAmount })
                    }} style={{ width: 87, backgroundColor: Color.LightBlue, justifyContent: "center", alignItems: "center" }}>
                        <Label fontSize_16 Montserrat_Medium color={Color.WHITE}>EDIT</Label>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        const { isLoading, milestones } = this.state;
        return (
            <View style={styles.container}>
                {/* <FilterDropdown />   */}
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        {Globals.isBuilder &&
                            <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 24, }}>
                                <Label fontSize_14 Montserrat_Bold mb={18}>Payment Stages Breakdown</Label>
                                {/* <Progress.Bar progress={0.2} height={24} color={Color.Yellow} width={Dimensions.get("window").width - 30}
                                    style={{ backgroundColor: Color.GreyLightColor, borderWidth: 0, borderRadius: 50, marginBottom: 30, overflow: 'hidden', }}
                                >
                                    <View style={{ position: "absolute", height: 24, width: '100%', alignItems: 'center', justifyContent: "center" }}>
                                        <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey}>Job Completed: 20%</Label>
                                    </View>
                                </Progress.Bar> */}
                            </View>
                        }
                        {milestones.length > 0 && <SwipeListView
                            data={milestones}
                            renderItem={item =>
                                this.renderItem(item)
                            }
                            renderHiddenItem={(data) => (
                                <View>
                                </View>
                            )}
                            rightOpenValue={-200}
                        />}
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={true}
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
                                <TouchableOpacity onPress={() => {
                                    this.setModalVisible(false)
                                    this.OnDeleteMilestone()
                                }} style={{ width: '50%', paddingBottom: 16, paddingTop: 16, alignItems: "center", justifyContent: "center" }}>
                                    <Label fontSize_14 Montserrat_Regular color={Color.LightBlue}>Confirm</Label>
                                </TouchableOpacity>
                                <View style={{ height: '100%', width: 1, backgroundColor: Color.WhiteGrey }}></View>
                                <TouchableOpacity onPress={() => { this.setModalVisible(false) }}
                                    style={{ width: '50%', paddingBottom: 16, paddingTop: 16, alignItems: "center", justifyContent: "center" }}>
                                    <Label fontSize_14 Montserrat_Regular color={Color.LightBlue}>No</Label>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
                {isLoading && <ProgressHud />}
                <NavigationEvents onWillFocus={this.onCreate} />
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

    onDeleteMilestone = async () => {
        console.log("onDeleteMilestone")
        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        try {
            let request = {
                milestoneId: this.state.deleteMilestoneId,
            };

            console.log("params", request)
            let response = await API.updateMilestones(request)
            this.setState({ isLoading: false });
            console.log("deleteMilestone response", response.data)
            screenProps.callback(response)
            if (response.status) {
                this.props.navigation.navigate(Routes.Milestone_Detail, { milestoneDetails: response.data })
            }
        } catch (error) {
            console.log("deleteMilestone error", error.message);
            this.setState({ isLoading: false });
        }
    }
}

