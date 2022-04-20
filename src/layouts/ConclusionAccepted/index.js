/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color'
import HeaderTitle from '../../components/Header/HeaderTitle';
import KMButton from "../../components/KMButton";
import styles from "./styles"
import { Routes } from '../../utils/Routes';
import ToastMessage from '../../components/toastmessage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fontXSmall16 } from '../../utils/theme';
import CustomIcon from "../../components/CustomIcon";
import moment from 'moment';
import Globals, { PAYMENT_TYPE, isValidValue, getKycRoute } from '../../utils/Globals';
import API from '../../API';
import ProgressHud from '../../components/ProgressHud';
import PaymentView from '../../components/PaymentView';
import Mangopay from '../../utils/mangopay';
import ConfirmModal from '../../components/ConfirmModal';
import {requestStoragePermission} from '../../utils/Files';
import pubnubService from '../../utils/pubnubService';
import RNHTMLtoPDF from 'react-native-html-to-pdf';


const DISPUTE_STATUS = {
    0: 'In Favour of Tradesperson',
    1: 'In Favour of Client',
    2: 'Arbitration'
}
const RESPONSE_STATUS = {
    0: 'No Response',
    1: 'Accepted',
    2: 'Rejected'
}

const PaymentStatus = {
    processing: 0,
    success: 1,
    failed: 2
}

export default class ConclusionAccepted extends Component {
    static navigationOptions = ({ }) => {
        return {
            headerTitle: () => <HeaderTitle title={"Conclusion"} />,
        }
    };

    constructor(props) {
        super(props)
        const { params = {} } = props.navigation.state;
        this.state = {
            isShowToast: false,
            milestoneDetails: params.milestoneDetails,
            nextML: params.nextML || {},
            isLastMilestone: params.milestoneDetails.isLastMilestone || false,
            disputeDetails: params.milestoneDetails.DisputeMilestone[0],
            paymentProceesing: false,
            paymentStatus: PaymentStatus.processing,
            showConfirm: false,
            jobDetails: params.jobDetails,
            messages: [],
            spaceId : params.jobDetails && params.jobDetails.chatDetail && params.jobDetails.chatDetail.spaceId || ""
        }
    }

    componentDidMount(){
      this.getPreviousMessages()
    }

    getPreviousMessages = () => {
        this.setState({ isLoading: false })
        let { spaceId } = this.state;
        let self = this;
        pubnubService.getMessages(spaceId, messagesRes => {
        if (messagesRes) {
            self.setState({
                messages : messagesRes
            } , () =>{
                console.log("=== Messages ==", this.state.messages)
            })
         }
        });
    };
    getInnerHTML = (msg) => {
        switch (msg.message.messageType) {
        case 'text':
            return (
            `<div>
                <p>[${msg.message.sender.name}, ${moment(msg.message.date).format('DD-MM-YYYY hh:mm a')}]: ${msg.message.text}</p><br />
            </div>`
            )
        case 'image':
            return (
            `<div>
                <p>{[${msg.message.sender.name}, ${moment(msg.message.date).format('DD-MM-YYYY hh:mm a')}]:</p >
                <img style={{ height: 70, width: 70 }} src=${msg.message.image} /><br/>
                <a style={{ color: 'blue' }} href=${msg.message.image} target="_blank">${msg.message.image}</a>
            </div > `
            )
        case 'file':
            //
            return (
            `<div>
                <p>[${msg.message.sender.name}, ${moment(msg.message.date).format('DD-MM-YYYY hh:mm a')}]: </p>
                <img src={"https://res.cloudinary.com/nimble-chapps/image/upload/v1592998025/PongoPay/uwwl4armh5eseyanrlnz.png"} /><br/>
                <a style={{ color: 'blue' }} href=${msg.message.image} download>${msg.message.image}</a>
            </div >`
            )
        default:
            return ''
        }
    }
    createPDF = async () => {
        let { jobDetails } = this.state
        let fileName = 'PongoPay_' + jobDetails.sJobTitle.replace(/ /g, '_')
        this.setState({ isLoading: true })
        let self = this
        requestStoragePermission(async (allowed) => {
        if (allowed) {
            let { messages } = this.state
            console.log('path================>', allowed);

            messages = messages.sort((a, b) => a.createdAt - b.createdAt)
            let html = ''
            for (let i = 0; i < messages.length; i++) {
            let msg = messages[i]
            html += this.getInnerHTML(msg)
            }
            let options = {
            html: html,
            fileName: fileName,
            directory: 'Documents',
            };

            let file = await RNHTMLtoPDF.convert(options)
            console.log('path================>', file.filePath);
            self.setState({ isLoading: false })
            let { screenProps } = this.props;
            if (!screenProps.isConnected) {
            return;
            }
            screenProps.callback({ status: true, msg: 'Your chat has been downloaded successfully.' });
        } else {
            // alert('Please on storage permission from setting');
            screenProps.callback({ status: false, msg: 'Please on storage permission from setting' });
        }
        })

    }
    getInitials() {
        this.setState({
            isLoading: false,
            paymentProceesing: false,
            paymentStatus: PaymentStatus.processing
        })
    }
    isActive() {
        let active = false
        let { disputeDetails } = this.state

        if (Globals.isBuilder) {
            if (disputeDetails.hasOwnProperty('nDecisionAcceptanceByBuilder')) {
                active = disputeDetails.nDecisionAcceptanceByBuilder === 0 && disputeDetails.nResultStatus != undefined
            }
        } else {
            if (disputeDetails.hasOwnProperty('nDecisionAcceptanceByClient')) {
                active = disputeDetails.nDecisionAcceptanceByClient === 0 && disputeDetails.nResultStatus != undefined
            }
        }
        return active
    }

    async onFinalAcceptRejctConclusion(status, paymentType, cardId) {
        this.setState({ isLoading: true });
        try {
            let request = {
                milestoneId: this.state.milestoneDetails._id,
                status: status
            };

            let isPayment = this.isPayment
            this.isPayment() && this.setState({ paymentProceesing: true, milestoneTitle: this.state.milestoneDetails.sMilestoneTitle, escrow: false });

            // if (paymentType) {
            //     this.setState({ paymentProceesing: true });
            //     request['paymentType'] = paymentType
            //     if (paymentType === PAYMENT_TYPE.CARD) {
            //         request['cardId'] = cardId
            //     }
            // }
            console.log("param", request)

            let response = await API.acceptRejectDecision(request)
            this.setState({ isLoading: false });
            console.log("acceptRejectDecision response", response)
            this.handleResponse(status, response)

        } catch (error) {
            console.log("acceptRejectDecision error", error.message);
            this.setState({ isLoading: false });
        }
    }

    checkForVerification = async (status) => {
        let { disputeDetails } = this.state
        if (disputeDetails.nSplitAmountForClient <= 0) {
            await this.onFinalAcceptRejctConclusion(status)
        } else {
            const { screenProps } = this.props;
            if (!screenProps.isConnected) {
                return
            }
            if (!screenProps.isVerified) {
                const { navigate } = this.props.navigation;
                let routeName = await getKycRoute('bank', this.state.user)
                navigate(routeName)
            } else {
                this.onFinalAcceptRejctConclusion(status)
            }
        }
    }

    async onAcceptRejectConclusion(status) {
        let { milestoneDetails } = this.state
        let message = `Are you sure you want to accept the decision for Payment Stage ${milestoneDetails.sMilestoneTitle}?`
        if (Globals.isClient && status === 1) {
            message = `Are you sure you want to accept the decision and release payment for Payment Stage ${milestoneDetails.sMilestoneTitle}?`
        } else if (Globals.isBuilder && status === 1) {
            message = `Are you sure you want to accept the decision for Payment Stage ${milestoneDetails.sMilestoneTitle}?`
        } else {
            message = `Are you sure you want to reject the decision for Payment Stage ${milestoneDetails.sMilestoneTitle}?`
        }
        this.setState({
            showConfirm: true,
            confirmMsg: message,
            confirmFnc: () => this.checkForVerification(status),
            hideFnc: () => this.setState({ showConfirm: false })
        })
        // if (Globals.isClient && !this.state.isLastMilestone && status === 1 && this.isPayment()) {
        //     this.setState({
        //         showConfirm: true,
        //         confirmMsg: `Are you sure you want to accept the decision and release payment for Payment Stage${milestone.sMilestoneTitle}?`,
        //         confirmFnc: () => this.onFinalAcceptRejctConclusion(status),
        //         hideFnc: () => this.setState({ showConfirm: false })
        //     })

        // this.props.navigation.push(Routes.CardView, {
        //     onGoBack: async (paymentType, paymentDetails) => {
        //         this.setState({ paymentProceesing: true });
        //         let response = { status: true }

        //         if (paymentType === PAYMENT_TYPE.CARD) {
        //             paymentDetails.cardId ? (response['cardId'] = paymentDetails.cardId) : (response = await Mangopay.registerCard(paymentDetails))
        //         } else if (paymentType === PAYMENT_TYPE.BANK) {
        //             response['mandateId'] = undefined// paymentDetails.mandateId)
        //         }
        //         if (response.status) {
        //             setTimeout(() => {
        //                 this.onFinalAcceptRejctConclusion(status, paymentType, paymentType === PAYMENT_TYPE.CARD ? response.cardId : response.mandateId)
        //             }, 2000);
        //         } else {
        //             setTimeout(() => {
        //                 this.setState({ isLoading: false, failedMessage: response.msg, paymentStatus: response.status ? PaymentStatus.success : PaymentStatus.failed });
        //                 setTimeout(() => {
        //                     this.getInitials()
        //                 }, 2000);
        //             }, 1000)
        //         }
        //     }
        // });
        //     } else {
        //     this.onFinalAcceptRejctConclusion(status)
        // }
    }

    handleResponse = (status, response) => {
        let { disputeDetails } = this.state
        if (status === 2 || !response.status) {
            if (response?.data?.SecureModeRedirectURL) {
                this.handleSecurePayment(response?.data?.SecureModeRedirectURL, async () => await this.onFinalAcceptRejctConclusion(1, PAYMENT_TYPE.CARD))
            }
            this.setState({ paymentProceesing: false })
            const { screenProps } = this.props;
            if (!screenProps.isConnected) {
                return
            }
            screenProps.callback(response)
        } else {
            if (this.isPayment()) {
                setTimeout(() => {
                    // if (response.nextMilestone && response.nextMilestone ?.payment_escrow_detail ?.paymentType == "BANK") {
                    //     // let extraNote = `Please deposit £${response.nextMilestone ?.nMilestoneAmount} into bank account number ${response.nextMilestone ?.payment_escrow_detail ?.bankDetails ?.IBAN} and sort code ${response.nextMilestone ?.payment_escrow_detail ?.bankDetails ?.BIC} with reference number ${response.data ?.payment_escrow_detail ?.transaction_ref}`
                    //     this.setState({ disputeDetails: response.data, isLoading: false, nextMilestone: response.nextMilestone, failedMessage: response.msg, paymentStatus: response.status ? PaymentStatus.success : PaymentStatus.failed });
                    // } else {
                    //     if (response ?.data ?.SecureModeRedirectURL) {
                    //         this.handleSecurePayment(response ?.data ?.SecureModeRedirectURL, async () => await this.onFinalAcceptRejctConclusion(1, PAYMENT_TYPE.CARD))
                    //     } else {
                    //         this.setState({ isLoading: false, failedMessage: response.msg, paymentStatus: response.status ? PaymentStatus.success : PaymentStatus.failed });
                    //         setTimeout(() => {
                    //             this.setState({
                    //                 disputeDetails: response.data,
                    //                 paymentProceesing: false,
                    //                 paymentStatus: PaymentStatus.processing
                    //             })
                    //         }, 2000);
                    //     }
                    // }
                    this.setState({ isLoading: false, failedMessage: response.msg, paymentStatus: response.status ? PaymentStatus.success : PaymentStatus.failed });
                    setTimeout(() => {
                        this.getInitials()
                    }, 2000);
                }, 2000)
            } else {
                this.setState({ isLoading: false })
                const { screenProps } = this.props;
                if (!screenProps.isConnected) {
                    return
                }
                screenProps.callback(response)
            }
        }

        if (response.status) {
            this.setState({
                disputeDetails: response.data
            })
        }
    }

    isPayment() {
        let { disputeDetails, isLastMilestone } = this.state
        // if (isLastMilestone) {
        //     return false
        // }
        if (Globals.isClient && disputeDetails.nDecisionAcceptanceByBuilder === 1) {
            return true
        }
        // if (disputeDetails.nResultStatus === 2) {
        //     return false
        // }

        return false
    }

    handleSecurePayment = (SecureModeRedirectURL, func) => {
        if (isValidValue(SecureModeRedirectURL)) {
            this.setState({
                openUrl: SecureModeRedirectURL,
                onVerificationSuccess: func
            })
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        let { openUrl, milestoneDetails, nextML, disputeDetails, paymentProceesing, paymentStatus, failedMessage, jobTitle } = this.state
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingBottom: 24, paddingTop: 24, paddingLeft: 16, paddingRight: 16, }}>
                            <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Payment Stage Amount:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ {milestoneDetails.nMilestoneAmount}</Label>
                            </View>
                            {/* <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Dispute Status:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>Dispute Started</Label>
                            </View> */}
                            <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Employee Conclusion:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{DISPUTE_STATUS[disputeDetails.nResultStatus]}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Announced On:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{moment(disputeDetails.dResultAnnounceAt).format('DD-MM-YYYY')}</Label>
                            </View>
                            <View style={{ paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Conclusion Statement: </Label>
                            </View>
                            <View style={{ paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={{ lineHeight: 20, }}>{disputeDetails.sResultStatement}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Split Amount of Tradesperson:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ {disputeDetails.nSplitAmountForBuilder || 0}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Split Amount of Client:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ {disputeDetails.nSplitAmountForClient || 0}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Builder’s Response:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.Red} ml={5}>{RESPONSE_STATUS[disputeDetails.nDecisionAcceptanceByBuilder]}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5, }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Client’s Response:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.LightBlue} ml={5}>{RESPONSE_STATUS[disputeDetails.nDecisionAcceptanceByClient]}</Label>
                            </View>

                            {this.isActive() && <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 40, }}>
                                <KMButton
                                    fontSize_14 Montserrat_Medium
                                    color={Color.WHITE}
                                    title="Accept"
                                    textStyle={{ padding: 0 }}
                                    style={{ backgroundColor: Color.LightBlue, borderRadius: 4, width: "48%", alignItems: 'center', justifyContent: 'center', height: 48, }}
                                    onPress={() => {
                                        this.onAcceptRejectConclusion(1)
                                        //  navigate(Routes.Conclusion_Accepted)
                                    }}
                                />
                                <KMButton
                                    fontSize_16 Montserrat_Medium
                                    color={Color.LightBlue}
                                    title="Reject"
                                    textStyle={{ padding: 0 }}
                                    style={{ backgroundColor: Color.WHITE, borderColor: Color.LightBlue, borderWidth: 1, borderRadius: 4, width: "48%", alignItems: 'center', justifyContent: 'center', height: 48, }}
                                    onPress={() => {
                                        this.onAcceptRejectConclusion(2)
                                    }}
                                />
                            </View>}
                            {this.state.spaceId !== "" && <TouchableOpacity onPress={() => this.createPDF()} style={{ flexDirection: "row", alignItems: "center", marginTop: 40, }}>
                                <CustomIcon name={"download"} style={{ fontSize: fontXSmall16, marginRight: 8 }} color={Color.LightBlue} />
                                <Label fontSize_14 Montserrat_Medium color={Color.LightBlue}>Download Evidence</Label>
                            </TouchableOpacity>}

                        </View>

                    </KeyboardAwareScrollView>
                    <ToastMessage
                        message="Dispute result has been accepted by you!"
                        isVisible={this.state.isShowToast}
                    />
                    <ToastMessage
                        message="Dispute result has been rejected by you!"
                        isVisible={this.state.isShowToastRejected}
                    />
                </SafeAreaView>
                <PaymentView
                    escrow={this.state.escrow}
                    paymentProceesing={paymentProceesing}
                    paymentStatus={paymentStatus}
                    failedMessage={failedMessage}
                    jobTitle={this.state.milestoneTitle}
                    nextMilestone={this.state.nextMilestone}
                    openUrl={openUrl}
                    onVerificationSuccess={() => {
                        this.setState({ openUrl: '' })
                        this.state.onVerificationSuccess()
                    }}
                    onClose={() => {
                        this.setState({
                            paymentProceesing: false,
                            paymentStatus: PaymentStatus.processing
                        })
                    }} >
                </PaymentView>
                <ConfirmModal show={this.state.showConfirm}
                    onHide={this.state.hideFnc}
                    onConfirm={() => {
                        this.setState({ showConfirm: false })
                        this.state.confirmFnc()
                    }}
                    msg={this.state.confirmMsg} />
                {this.state.isLoading && <ProgressHud />}
            </View>
        );
    }
}

