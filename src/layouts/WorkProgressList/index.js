/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity, FlatList } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color'
import styles from "./styles";
import HeaderTitle from '../../components/Header/HeaderTitle';
import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderRight from '../../components/Header/HeaderRight';
import { fontXSmall16 } from '../../utils/theme';
import { Routes } from '../../utils/Routes';
import KMButton from "../../components/KMButton";
import GlobalStyles from '../../utils/GlobalStyles';

import CustomIcon from "../../components/CustomIcon";
import { NavigationEvents, ThemeColors } from 'react-navigation';
import API from '../../API';
import ProgressHud from '../../components/ProgressHud';

import moment from 'moment';
import Globals, { MilestoneStatus } from '../../utils/Globals';

export default class WorkProgressList extends Component {

    static navigationOptions = ({ navigation }) => {
        if (Globals.isBuilder) {
            return {
                headerTitle: () => <HeaderTitle title={navigation.getParam('getTitle') || ""} />
            }
        } else {
            return {
                headerTitle: () => <HeaderTitle title={navigation.getParam('getTitle') || ""} />
            }
        }
    }


    // static navigationOptions = ({ navigation }) => {
    //     if (Globals.isBuilder) {
    //         return {
    //             headerLeft: (
    //                 <HeaderLeft
    //                     iconName="left-arrow"
    //                     onPress={() => {
    //                         navigation.navigate(Routes.Milestone_Detail);
    //                     }}
    //                 />
    //             ),
    //             headerTitle: () => <HeaderTitle title={navigation.getParam('getTitle')} />,
    //             // headerRight: (
    //             //     <HeaderRight
    //             //         buttonTitle="Add"
    //             //         onPress={navigation.getParam('onAddClick')
    //             //         }
    //             //     />
    //             // ),
    //         }
    //     } else {
    //         return {
    //             headerTitle: () => <HeaderTitle title={navigation.getParam('getTitle')} />,
    //         }

    //     }
    // };

    constructor(props) {
        super(props);
        const { params = {} } = props.navigation.state;
        this.state = {
            isLoading: false,
            workProgress: [],
            milestoneId: params.milestoneId,
            jobId: params.jobId,
            type: params.type,
            jobDetails: params.jobDetails,
            milestoneDetails: params.milestone
        }
        console.log("JOB", params.milestone)
    }
    componentDidMount() {
        this.props.navigation.setParams({
            onAddClick: this.onAddClick,
            getTitle: this.state.type == 1 ? "Work Progress" : "Building Issues"

        });

    }

    onAddClick = () => {
        // this.props.navigation.navigate(Routes.Chat_View, { jobDetails: this.state.jobDetails })
        this.props.navigation.navigate(Routes.Work_Progress_Upload, { milestoneId: this.state.milestoneId, jobId: this.state.jobId })
    }

    onCreate = () => {
        this.getWorkProgress();
    }
    getWorkProgress = async () => {
        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        try {
            let request = {
                milestoneId: this.state.milestoneId,
                type: this.state.type,

            };

            let response = await API.getWorkProgressList(request)
            this.setState({ isLoading: false });
            // console.log("getAllMilestone response", response.data)
            if (response.status) {
                this.setState({
                    workProgress: response.data
                }, () => {
                    console.log("milestonse", this.state.workProgress)

                })
            }
        } catch (error) {
            console.log("getAllMilestone error", error.message);
            this.setState({ isLoading: false });
        }
    }

    renderListing({ item }) {
        const { navigate } = this.props.navigation;
        const { isLoading } = this.state;

        console.log("MilestoneStatus", this.state.milestoneDetails.nMilestoneStatus)

        return (
            <View style={{ borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, }}>
                <TouchableOpacity
                    onPress={() => {
                        item.nType == 1 ?
                            navigate(Routes.Work_Progress_Detail, { workProgress: item, jobDetails: this.state.jobDetails, milestoneDetails: this.state.milestoneDetails })
                            :
                            navigate(Routes.Building_Issues, { buildingIssues: item, jobDetails: this.state.jobDetails, milestoneDetails: this.state.milestoneDetails })

                    }}
                    style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 24, paddingTop: 24, flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                    <View>
                        <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>{item.sTitle}</Label>
                        <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey}>{
                            moment(item.dCreatedAt).format('DD-MM-YYYY')}</Label>
                    </View>
                    <CustomIcon name={"right_arrow"} style={{ fontSize: fontXSmall16, color: Color.BLACK }} />
                </TouchableOpacity>



            </View >
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {/* [GlobalStyles.bottomButtonStyle, { backgroundColor: Color.Yellow }] */}
                <SafeAreaView style={[styles.safeVStyle, this.state.workProgress.length == 0 && { justifyContent: "center", alignItems: "center" }]}>
                    {this.state.workProgress.length == 0 ? <Label Montserrat_Medium style={{ alignItems: "center", marginTop: 12, fontSize: 16, color: Color.BLACK }}> {this.state.type == 0 ? "No building issues added" : "No work progress added"}</Label>
                        :
                        <FlatList
                            data={this.state.workProgress}
                            renderItem={item => this.renderListing(item)}
                        />
                    }
                </SafeAreaView>
                {(Globals.isBuilder && this.state.type == 1 && this.state.milestoneDetails.nMilestoneStatus !== 4) && <KMButton
                    fontSize_16 Montserrat_Medium
                    color={Color.BLACK}
                    title={"ADD WORK PROGRESS"}
                    textStyle={{ padding: 0 }}
                    style={[GlobalStyles.bottomButtonStyle, { backgroundColor: Color.Yellow }]}
                    onPress={() => {
                        console.log("isShowToast")
                        this.props.navigation.navigate(Routes.Work_Progress_Upload, { milestoneId: this.state.milestoneId, jobId: this.state.jobId })
                        // this.setState({ isShowToast: true })
                    }}

                />
                }
                {(Globals.isClient && this.state.type == 0 && this.state.milestoneDetails.nMilestoneStatus !== 4) && <KMButton
                    fontSize_16 Montserrat_Medium
                    color={Color.BLACK}
                    title={"ADD BUILDING ISSUE"}
                    textStyle={{ padding: 0 }}
                    style={[GlobalStyles.bottomButtonStyle, { backgroundColor: Color.Yellow }]}
                    onPress={() => {
                        console.log("isShowToast")
                        this.props.navigation.navigate(Routes.Work_Progress_Upload, { milestoneId: this.state.milestoneId, jobId: this.state.jobId })
                        // this.setState({ isShowToast: true })
                    }}

                />
                }
                {this.state.isLoading && <ProgressHud />}
                <NavigationEvents onWillFocus={this.onCreate} />
            </View>
        );
    }
}

