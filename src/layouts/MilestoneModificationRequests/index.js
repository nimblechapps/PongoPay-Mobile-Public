/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, Text } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color';
import HeaderTitle from '../../components/Header/HeaderTitle';
import KMButton from "../../components/KMButton";
import GlobalStyles from '../../utils/GlobalStyles';
import styles from "./styles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Globals, { Users, JobStatus, contains } from '../../utils/Globals';
import { Routes } from '../../utils/Routes';
import API from '../../API';
import ProgressHud from '../../components/ProgressHud';
import moment from 'moment';
import { NavigationEvents } from 'react-navigation';
import { fontSmall14, fontXSmall16, fontLarge24 } from '../../utils/theme';
import { getModificationStatus } from '../../utils/GetUserStatus';

export default class MilestoneModificationRequests extends Component {
    static navigationOptions = ({ }) => {
        return {
            headerTitle: () => <HeaderTitle title={"Modification Requests"} />,
        }
    };

    constructor(props) {
        super(props)
        const { params = {} } = props.navigation.state;
        this.state = {
            isLoading: false,
            jobId: params.jobId,
            modificationRequests: [],
            jobDetails: params.jobDetails
        }
    }


    onCreate = () => {
        this.getAllModificationRequests()
    }

    render() {
        const { navigate } = this.props.navigation;
        const { isLoading, jobId, modificationRequests, hasUpdateJob, jobDetails } = this.state;

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>{
                        modificationRequests.length > 0 ?
                            <FlatList
                                data={modificationRequests}
                                extraData={this.state}
                                renderItem={({ item }) => this.renderItem(item)}
                                keyExtractor={(item) => item._id}

                            /> : <View style={styles.NodataView}>
                                <Text style={{ color: Color.LightGrey, fontSize: fontSmall14 }}>No Modification Request</Text>
                            </View>
                    }

                    </KeyboardAwareScrollView>
                    {isLoading && <ProgressHud />}
                    <NavigationEvents onWillFocus={this.onCreate} />
                </SafeAreaView>

                {/* client milestone modification Request start */}
                {!Globals.isBuilder && jobDetails.nStatus === JobStatus.AWAITING_RESPONSE &&
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="Ask For Modification"
                        textStyle={{ padding: 0 }}
                        style={[GlobalStyles.bottomButtonStyle, { borderRadius: 0, }]}
                        onPress={() => navigate(Routes.Send_Modification_Requests, { jobId: this.state.jobId })}
                    />
                }
                {hasUpdateJob && Globals.isBuilder &&
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="Update Job Proposal"
                        textStyle={{ padding: 0 }}
                        style={[GlobalStyles.bottomButtonStyle, { borderRadius: 0, }]}
                        onPress={() => navigate(Routes.Create_New_Job, {
                            jobDetails: this.state.jobDetails,
                            isEdit: true,
                        })}
                    />
                }
            </View>
        );
    }

    renderItem(data) {
        const { navigate } = this.props.navigation;

        return (
            <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, }}>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Request On:</Label>
                    {/* <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ July 14, 2019</Label> */}
                    <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{moment(data.dCreatedAt).format(Globals.ModiRequestDatePickerFormat)}</Label>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Requested By:</Label>
                    <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{data.CreatedBy.sFirstName + " " + data.CreatedBy.sLastName}</Label>
                </View>
                {/* pending work */}
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Status:</Label>
                    <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{getModificationStatus(data.nModificationStatus)}</Label>
                </View>
                <View>
                    <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Comments:</Label>
                    <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} mt={5}>{data.sComment}</Label>
                </View>

                {Globals.isBuilder && data.nModificationStatus == 0 && <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 10, }}>
                    <KMButton
                        title={"Accept"}
                        onPress={() => this.onAcceptRejectModificationRequest(data._id, 1)}
                        style={styles.button} textStyle={{ color: Color.WHITE, fontSize: fontXSmall16, fontFamily: 'Montserrat-Medium' }} />
                    <KMButton
                        title={"Reject"}
                        onPress={() => this.onAcceptRejectModificationRequest(data._id, 2)}
                        textStyle={{ color: Color.LightBlue, fontSize: fontXSmall16, fontFamily: 'Montserrat-Medium' }}
                        style={[styles.button, { backgroundColor: "transparent", borderWidth: 1, borderColor: Color.LightBlue }]} />
                </View>}
            </View>
        );
    }

    //get all milestones modification request
    getAllModificationRequests = async (callback, loading = true) => {
        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        if (loading) this.setState({ isLoading: true });

        try {
            let request = {
                jobId: this.state.jobId
            };

            let response = await API.getModificationRequest(request)
            this.setState({ isLoading: false });
            console.log("getAllModificationRequests response", response)
            if (response.status) {
                let hasUpdateJob = response.data.filter((m) => m.nModificationStatus === 1).length != 0 && contains([JobStatus.PENDING, JobStatus.AWAITING_RESPONSE, JobStatus.REQUESTED], this.state.jobDetails.nStatus)
                this.setState({ modificationRequests: response.data, hasUpdateJob })
            }
        } catch (error) {
            console.log("getAllModificationRequests error", error.message);
            this.setState({
                isLoading: false
            });
        }
    }

    onAcceptRejectModificationRequest = async (requestId, status) => {
        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        try {
            let request = {
                jobId: this.state.jobId,
                modificationRequestId: requestId,
                acceptRejectStatus: status
            };

            console.log("param", request)
            let response = await API.updateModificationRequest(request)
            this.setState({ isLoading: false });
            console.log("acceptRejectModificationRequest response", response)
            await screenProps.callback(response)
            if (response.status) {
                this.onCreate()
            }

        } catch (error) {
            console.log("acceptRejectModificationRequest error", error.message);
            this.setState({ isLoading: false });
        }
    }
}

