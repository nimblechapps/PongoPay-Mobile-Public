/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, View} from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color'
import styles from "./styles";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderTitle from '../../components/Header/HeaderTitle';
import HeaderRight from '../../components/Header/HeaderRight';
import KMButton from "../../components/KMButton"
import TextField from '../../components/TextField';
import InputMask from '../../components/InputMask';
import {fontXSmall16, screenWidth} from '../../utils/theme';
import {ErrorMessage} from '../../utils/message';
import Globals, {getAdminComission, getPmComission, getTwoDecimalString, MilestoneStatus} from "./../../utils/Globals";
import GlobalStyles from '../../utils/GlobalStyles';
import {Routes} from '../../utils/Routes';
import CustomIcon from "../../components/CustomIcon";
import ToastMessage from '../../components/toastmessage';
import ProgressHud from '../../components/ProgressHud';
import API from '../../API';
import ConfirmModal from '../../components/ConfirmModal';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {validateCharacter, validatePhone, validateEmail, validateDecimal} from '../../utils/validation';

export default class EditMilestone extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (
                <HeaderLeft
                    iconName="close"
                    onPress={() => {
                        navigation.goBack();
                    }}
                    iconStyle={{
                        color: Color.LightBlue
                    }}
                />
            ),
            headerTitle: () => <HeaderTitle title={"Edit Payment Stage"} />,
            headerRight: (
                <HeaderRight
                    buttonTitle="Delete"
                    buttonStyle={{color: Color.Red}}
                    onPress={navigation.getParam("onDeleteClick")}
                />
            ),
        }
    };

    constructor(props) {
        super(props)
        const {params = {}} = props.navigation.state;
        this.state = {
            isLoading: false,
            fromPage: params.from || "",
            milestone: params.milestone,
            jobDetails: params.jobDetails || {},
            jobAmount: params.jobAmount,
            milestonePendingAmount: params.milestonePendingAmount,
            milestoneAccepted: params.milestoneAccepted ? params.milestoneAccepted : false,
            isShowToast: false,
            milestoneTitle: {
                value: params.milestone.sMilestoneTitle,
                message: "",
                isValid: true,
            },
            milestoneAmount: {
                value: params.milestone.nMilestoneAmount + "",
                message: "",
                isValid: true,
            },
            milestoneDesc: {
                value: params.milestone.sMilestoneDesc,
                message: "",
                isValid: true,
            },
            updateNote: {
                value: "",
                message: "",
                isValid: false,
            },
            expectedDate: {
                value: new Date(params.milestone.expectedCompletionDate),
                message: "",
                isValid: true,
                dateObj: new Date(params.milestone.expectedCompletionDate)
            },
            plans: [],
            showConfirmModal: false,
            adminComission: '0',
            builderAmount: '0',
            pmComission: '0',
            clientComission: '0',
        }
    }

    async getSubscriptionPlans() {
        try {
            let response = await API.getSubscriptionPlans();
            this.setState({isLoading: false});
            console.log('subscription plan response', response);
            if (response.status) {
                this.setState({
                    plans: response.data,
                });
            }
        } catch (error) {

        }
    }

    componentDidMount = () => {
        this.props.navigation.setParams({
            onDeleteClick: this.onDeleteClick
        });
        let {milestone} = this.state
        if (milestone) {
            this.setState({
                adminComission: getTwoDecimalString(milestone.nAdminComission),
                builderAmount: getTwoDecimalString(milestone.amountPaidToBuilder),
                clientAmount: getTwoDecimalString(milestone.nMilestoneAmount),
                pmComission: getTwoDecimalString(milestone.nPropertyManagerComission),
                createdByPm: milestone.nPropertyManagerComission != -1
            })
        }
    }

    onDeleteClick = () => {
        this.setState({
            showConfirmModal: true,
            confirmMsg: 'Are you sure you want to remove this Payment Stage?',
            confirmFnc: () => this.onDeleteMilestone(),
            hideFnc: () => this.setState({showConfirmModal: false})
        })
    }

    isSubmitDisable() {
        if (this.state.milestoneAccepted) {
            return !this.state.milestoneTitle.isValid || !this.state.milestoneAmount.isValid || !this.state.updateNote.isValid || !this.state.expectedDate.isValid
        } else {
            return !this.state.milestoneTitle.isValid || !this.state.milestoneAmount.isValid || !this.state.expectedDate.isValid

        }
    }

    render() {
        const {navigate} = this.props.navigation;
        const {isLoading, createdByPm, milestoneTitle, milestoneAmount, milestoneDesc, updateNote, milestone, expectedDate} = this.state;

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{paddingLeft: 15, paddingRight: 15, paddingTop: 24, paddingBottom: 16, }}>
                            <TextField
                                LabelTitle='Title*'
                                placeholder='Title'
                                onChangeText={this.onMilestoneTitleChange}
                                value={milestoneTitle.value}
                                autoFocus={true}
                                returnKeyType={"next"}
                                onSubmitEditing={() => this.AmountInput.refs.AmountRef.focus()}
                            >
                                {
                                    milestoneTitle.message !== "" &&
                                    <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                        <CustomIcon name={"warning"} style={{color: Color.Red, fontSize: fontXSmall16, alignItems: "center"}} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{paddingLeft: 10, }}>{milestoneTitle.message}</Label>
                                    </View>
                                }
                            </TextField>
                            <View style={{zIndex: -1}}>
                                <TextField
                                    type={'custom'}
                                    options={{mask: '9999999999999999999999'}}
                                    LabelTitle='Amount*'
                                    placeholder='Amount'
                                    keyboardType={"numeric"}
                                    returnKeyType="done"
                                    onFocus={this.getSubscriptionPlans.bind(this)}
                                    onChangeText={this.onMilestoneAmountChange}
                                    value={milestoneAmount.value}
                                    ref={ref => this.AmountInput = ref}
                                    reference='AmountRef'
                                    returnKeyType={"next"}
                                >
                                    {
                                        milestoneAmount.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{color: Color.Red, fontSize: fontXSmall16, alignItems: "center"}} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{paddingLeft: 10, }}>{milestoneAmount.message}</Label>
                                        </View>
                                    }
                                </TextField>
                            </View>
                            <View style={styles.labelCss}>
                                <Label
                                    fontSize_14
                                    Montserrat_Medium
                                    color={Color.DarkGrey}
                                    style={{paddingRight: 8}}>Charge to Client:</Label>
                                <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                                    £ {this.state.clientAmount}
                                </Label>
                            </View>
                            <View style={styles.labelCss}>
                                <Label
                                    fontSize_14
                                    Montserrat_Medium
                                    color={Color.DarkGrey}
                                    style={{paddingRight: 8}}>Service Fee:</Label>
                                <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                                    £ {this.state.adminComission}
                                </Label>
                            </View>
                            {this.state.createdByPm && <View style={styles.labelCss}>
                                <Label
                                    fontSize_14
                                    Montserrat_Bold
                                    color={Color.DarkGrey}
                                    style={{paddingRight: 8}}>Property Manager Commission : </Label>
                                <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                                    £ {this.state.pmComission}
                                </Label>
                            </View>}
                            <View style={{backgroundColor: Color.GreyLightColor, height: 1, top: 5}} ></View>
                            <View style={styles.labelCss}>
                                <Label
                                    fontSize_14
                                    Montserrat_Bold
                                    color={Color.DarkGrey}
                                    style={{paddingRight: 8}}>Amount You’ll Receive :</Label>
                                <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                                    £ {this.state.builderAmount}
                                </Label>
                            </View>
                            <View style={{backgroundColor: Color.GreyLightColor, height: 1, marginBottom: 25}} ></View>
                            <View style={{zIndex: -11}}>
                                <Label fontSize_16 color={Color.DarkGrey} mb={10}>Expected Completion Date* </Label>
                                <DatePicker
                                    style={{
                                        width: Globals.isIpad ? 400 : screenWidth - 30,
                                        marginBottom: 20,
                                    }}
                                    date={expectedDate.value}
                                    mode="date"
                                    placeholder="DD-MM-YYYY"
                                    format="DD-MM-YYYY"
                                    minDate={new Date()}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            display: 'none',
                                        },
                                        dateText: {
                                            fontSize: fontXSmall16,
                                            color: Color.BLACK,
                                            fontFamily: 'Montserrat-Regular',
                                        },
                                        placeholderText: {
                                            fontFamily: 'Montserrat-Regular',
                                            fontSize: fontXSmall16,
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderRadius: 4,
                                            height: 48,
                                            alignItems: 'flex-start',
                                            paddingLeft: 15,
                                            paddingRight: 15,
                                            borderColor: Color.LightGrey,
                                            fontFamily: 'Montserrat-Regular',
                                            fontSize: fontXSmall16,
                                        },
                                    }}
                                    onDateChange={(date, dateObj) => {
                                        console.log('date', date);
                                        let {expectedDate} = this.state
                                        if (!date) {
                                            expectedDate = {
                                                value: '',
                                                message: ErrorMessage.dateOfBirthRequired,
                                                isValid: false,
                                            };
                                        } else {
                                            expectedDate = {
                                                value: moment(dateObj).format("DD-MM-YYYY"),
                                                message: '',
                                                isValid: true,
                                                dateObj: dateObj
                                            };
                                        }
                                        this.setState({
                                            expectedDate
                                        }, () => {
                                            console.log("state Date", moment(expectedDate.dateObj).format('YYYY-MM-DD'))

                                        });
                                    }}
                                />

                                {expectedDate.message != '' && (
                                    <View
                                        style={
                                            Globals.isIpad
                                                ? GlobalStyles.errorTxtPad
                                                : GlobalStyles.errorTxt
                                        }>
                                        <CustomIcon
                                            name={'warning'}
                                            style={{
                                                color: Color.Red,
                                                fontSize: fontXSmall16,
                                                alignItems: 'center',
                                            }}
                                        />
                                        <Label
                                            fontSize_14
                                            Montserrat_Regular
                                            color={Color.DarkGrey}
                                            style={{paddingLeft: 10, paddingRight: 10}}>
                                            {expectedDate.message}
                                        </Label>
                                    </View>
                                )}
                            </View>

                            <View style={{zIndex: -11}}>
                                <TextField
                                    multiline
                                    LabelTitle='Description of Work'
                                    placeholder='Write a brief description of the milestone'
                                    customStyle={{height: 96, paddingTop: 10, paddingBottom: 10, }}
                                    onChangeText={this.onMilestoneDescriptionChange}
                                    value={milestoneDesc.value}
                                    ref={ref => this.descriptionInput = ref}
                                    reference='descriptionRef'
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => this.UpdateNoteInput.refs.UpdateNoteRef.focus()}

                                />
                            </View>
                            {this.state.milestoneAccepted && <View style={{zIndex: -111}}>
                                <TextField
                                    multiline
                                    LabelTitle='Update Note*'
                                    placeholder='Write a brief description of the update note'
                                    customStyle={{height: 96, paddingTop: 10, paddingBottom: 10, }}
                                    onChangeText={this.onUpdateNoteChange}
                                    value={updateNote.value}
                                    ref={ref => this.UpdateNoteInput = ref}
                                    reference='UpdateNoteRef'
                                    returnKeyType={"done"}
                                >
                                    {
                                        updateNote.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{color: Color.Red, fontSize: fontXSmall16, alignItems: "center"}} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{paddingLeft: 10, }}>{updateNote.message}</Label>
                                        </View>
                                    }
                                </TextField>
                            </View>}
                        </View>
                    </KeyboardAwareScrollView>
                    <ToastMessage
                        message="Payment Stage has been deleted successfully"
                        mainViewCustom={{alignItems: 'center'}}
                        isVisible={this.state.isShowToast} />
                    {isLoading && <ProgressHud />}
                </SafeAreaView>
                <KMButton
                    fontSize_16 Montserrat_Medium
                    color={Color.BLACK}
                    title="UPDATE"
                    textStyle={{padding: 0}}
                    style={[GlobalStyles.bottomButtonStyle, {backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow}]}
                    onPress={() => {
                        this.setState({
                            showConfirmModal: true,
                            confirmMsg: 'Are you sure you want to update the Payment Stage amount?',
                            confirmFnc: () => this.onUpdatetMilestone(),
                            hideFnc: () => this.setState({showConfirmModal: false})
                        })
                    }}
                    disabled={this.isSubmitDisable()}
                />
                <ConfirmModal show={this.state.showConfirmModal}
                    onHide={() => this.setState({showConfirmModal: false})}
                    onConfirm={() => {
                        this.setState({showConfirmModal: false})
                        this.state.confirmFnc()
                    }}
                    msg={this.state.confirmMsg} />

            </View >
        );
    }

    onDeleteMilestone = async () => {
        const {screenProps} = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({isLoading: true});

        try {
            let request = {
                milestoneId: this.state.milestone._id,
            };

            console.log("params", request)
            let response = await API.deleteMilestone(request)
            this.setState({isLoading: false});
            console.log("deleteMilestone response", response.data)
            screenProps.callback(response)
            if (response.status) {
                //this.props.navigation.navigate(Routes.Milestone_Detail, { milestoneDetails: response.data })
                this.props.navigation.goBack()
            }
        } catch (error) {
            console.log("deleteMilestone error", error.message);
            this.setState({isLoading: false});
        }
    }

    onMilestoneTitleChange = (text) => {
        const milestoneTitle = this.state.milestoneTitle
        milestoneTitle.value = text

        if (milestoneTitle.value.length == 0 || milestoneTitle.value == "") {
            milestoneTitle.message = ErrorMessage.milestoneTitleRequired
            milestoneTitle.isValid = false
        } else {
            milestoneTitle.message = ""
            milestoneTitle.isValid = true
        }
        this.setState({
            milestoneTitle
        })
    }

    onMilestoneAmountChange = (text) => {
        const milestoneAmount = this.state.milestoneAmount
        milestoneAmount.value = text.trim()

        if (milestoneAmount.value.length == 0 || milestoneAmount.value == "") {
            milestoneAmount.message = ErrorMessage.milestoneAmountRequired
            milestoneAmount.isValid = false
        }
        //  if (milestoneAmount.value > this.state.milestone.nMilestoneAmount + this.state.milestonePendingAmount) {

        //     milestoneAmount.message = ErrorMessage.milestoneAmountExceed
        //     milestoneAmount.isValid = false
        // }
        else if (!validateDecimal(milestoneAmount.value)) {
            milestoneAmount.message = "Invalid value"
            milestoneAmount.isValid = false
        }
        else {
            milestoneAmount.message = ""
            milestoneAmount.isValid = true
        }
        let adminComission = getAdminComission(milestoneAmount.value, this.state.plans)
        let {pmComission, jobDetails, createdByPm} = this.state
        if (jobDetails?.PropertyManager) {
            let comission = jobDetails.PropertyManager.nCommission || 0
            pmComission = getPmComission(milestoneAmount.value, comission)
        }
        this.setState({
            milestoneAmount,
            adminComission: getTwoDecimalString(adminComission),
            pmComission: getTwoDecimalString(pmComission),
            builderAmount: getTwoDecimalString((parseFloat(milestoneAmount.value) - parseFloat(adminComission) - parseFloat(pmComission))),
            clientAmount: getTwoDecimalString((parseFloat(milestoneAmount.value)))
        });
        this.setState({
            milestoneAmount
        })
    }

    onMilestoneDescriptionChange = (text) => {
        const milestoneDesc = this.state.milestoneDesc
        milestoneDesc.value = text

        this.setState({
            milestoneDesc
        })
    }

    onUpdateNoteChange = (text) => {
        const updateNote = this.state.updateNote
        updateNote.value = text

        if (updateNote.value.length == 0 || updateNote.value == "") {
            updateNote.message = ErrorMessage.updateNoteRequired
            updateNote.isValid = false
        } else {
            updateNote.message = ""
            updateNote.isValid = true
        }
        this.setState({
            updateNote
        })
    }

    onUpdatetMilestone = async () => {
        console.log("onUpdatetMilestone")
        const {screenProps} = this.props;
        if (!screenProps.isConnected) {
            return
        }

        this.setState({isLoading: true});

        const {milestone, milestoneTitle, milestoneAmount, milestoneDesc, updateNote, expectedDate, adminComission,
            builderAmount,
            pmComission, } = this.state;
        let date = moment(expectedDate.dateObj).format('YYYY-MM-DD')
        console.log("Date", date)

        try {
            let request = {
                milestoneId: milestone._id,
                milestoneTitle: milestoneTitle.value,
                milestoneAmount: milestoneAmount.value,
                updateNote: updateNote.value,
                expectedCompletionDate: date,
                adminComission,
                builderAmount,
                pmComission,
            };

            if (milestoneDesc.value && milestoneDesc.value != "") {
                request["milestoneDesc"] = milestoneDesc.value
            }

            console.log("params", request)
            let response = await API.updateMilestones(request)
            this.setState({isLoading: false});
            console.log("updatetMilestone response", response.data)
            screenProps.callback(response)
            if (response.status) {
                console.log("From", this.state.fromPage)
                if (this.state.fromPage != "" && this.state.fromPage == "MilestonDetail") {
                    this.props.navigation.goBack()
                    // this.props.navigation.replace(Routes.Milestone_Detail,{milestoneDetails : response.data})
                } else {
                    this.props.navigation.goBack()
                }

            }
        } catch (error) {
            console.log("updatetMilestone error", error.message);
            this.setState({isLoading: false});
        }
    }
}

