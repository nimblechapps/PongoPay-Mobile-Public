import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, Clipboard, Image } from 'react-native';
import { WebView } from 'react-native-webview';

import moment from 'moment';
import Color from '../../utils/color'
import Label from '../Label';
import KMButton from '../KMButton';
import { getBankAccountFromIBAN, getSortcodeFromIBAN, isValidValue, JobStatus, MilestoneStatus } from '../../utils/Globals';
import { ErrorMessage } from '../../utils/message';
import Mangopay from '../../utils/mangopay';

let copy = require('../../assets/Images/copy-outline.png')

const PaymentDetailModal = (props) => {
    let [refCopied, setRefCopied] = useState(false)
    let [warning, showWarning] = useState(false)
    let [bankingUrl, setBankingUrl] = useState(undefined)

    let { paymentDetails, milestoneAmount, milestoneStatus } = props

    const copyText = async (text) => {
        await Clipboard.setString(text)
    }

    const onDone = async () => {
        refCopied ? props.onClose() : showWarning(true)
    }
    const _onNavigationStateChange = (webViewState) => {
        if (webViewState.url.includes('pongopay')) {
            setTimeout(() => {
                setBankingUrl(undefined)
                props.onClose()
            }, 7000)
        }
    }

    return (
        <View >
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.show}
            >
                {isValidValue(bankingUrl) ?
                    <WebView style={{ height: '100%', width: '100%' }}
                        useWebKit={true}
                        source={{ uri: bankingUrl }}
                        scalesPageToFit={true}
                        startInLoadingState={true}
                        // renderLoading={() => { return isLoading ? <ProgressHud /> : null }}
                        // onLoadStart={this._onLoadStart.bind(this)}
                        // onLoadEnd={this._onLoadEnd.bind(this)}
                        onNavigationStateChange={(state) => _onNavigationStateChange(state)}
                    />
                    :
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            props.onClose();
                        }}
                        style={{ height: "100%", alignItems: "center", justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                        <View style={styles.modalContainer}>
                            {paymentDetails &&
                                <View>
                                    <Label style={{ textAlign: 'center', marginTop: 10 }} Montserrat_Bold fontSize_18 color={Color.BLACK} ml={4}>Bank Transfer Details</Label>
                                    {milestoneStatus === MilestoneStatus.COMPLETED ?
                                        <Label style={{ textAlign: 'center', marginBottom: 10, marginTop: 10 }} Montserrat_Medium fontSize_14 color={Color.LightGrey} ml={4}>{ErrorMessage.bankUsagePaidWarning}</Label>
                                        :
                                        <Label style={{ textAlign: 'center', marginBottom: 10, marginTop: 10 }}>Please deposit your payment! Please deposit<Label style={styles.payment_txt_bold}> £{milestoneAmount} </Label>
                                        into bank account number<Label style={styles.payment_txt_bold}> {getBankAccountFromIBAN(paymentDetails?.bankDetails?.IBAN)} </Label>
                                        and sort code<Label style={styles.payment_txt_bold}> {getSortcodeFromIBAN(paymentDetails?.bankDetails?.IBAN)} </Label>
                                        with reference number<Label style={styles.payment_txt_bold}> {paymentDetails?.transaction_ref}</Label>
                                        </Label>}
                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingTop: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey }}>
                                            <View>
                                                <Label style={{ marginBottom: 10, marginTop: 10 }} Montserrat_Medium fontSize_14 color={Color.LightGrey} ml={4}>Benificiary</Label>
                                                <Label style={{ marginBottom: 10 }} Montserrat_Bold fontSize_14 color='black' ml={4}>MangoPay</Label>
                                            </View>
                                            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {
                                                copyText('MangoPay')
                                            }}>
                                                <Image style={{ resizeMode: 'contain', height: 20, width: 20 }} source={copy} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingTop: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey }}>
                                            <View>
                                                <Label style={{ marginBottom: 10, marginTop: 10 }} Montserrat_Medium fontSize_14 color={Color.LightGrey} ml={4}>Unique Deposit Box Reference</Label>
                                                <Label style={{ marginBottom: 10 }} Montserrat_Bold fontSize_14 color='black' ml={4}>{paymentDetails?.transaction_ref}</Label>
                                            </View>
                                            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {
                                                setRefCopied(true)
                                                copyText(paymentDetails?.transaction_ref)
                                            }}>
                                                <Image style={{ resizeMode: 'contain', height: 20, width: 20 }} source={copy} />

                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingTop: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey }}>
                                            <View>
                                                <Label style={{ marginBottom: 10, marginTop: 10 }} Montserrat_Medium fontSize_14 color={Color.LightGrey} ml={4}>Bank Account No.</Label>
                                                <Label style={{ marginBottom: 10 }} Montserrat_Bold fontSize_14 color='black' ml={4}>{getBankAccountFromIBAN(paymentDetails?.bankDetails?.IBAN)}</Label>
                                            </View>
                                            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {
                                               //copyText(paymentDetails?.bankDetails?.IBAN)
                                               copyText(getBankAccountFromIBAN(paymentDetails?.bankDetails?.IBAN))
                                            } }>
                                                <Image style={{ resizeMode: 'contain', height: 20, width: 20 }} source={copy} />

                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingTop: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey }}>
                                            <View>
                                                <Label style={{ marginBottom: 10, marginTop: 10 }} Montserrat_Medium fontSize_14 color={Color.LightGrey} ml={4}>Sort Code</Label>
                                                <Label style={{ marginBottom: 10 }} Montserrat_Bold fontSize_14 color='black' ml={4}>{getSortcodeFromIBAN(paymentDetails.bankDetails?.IBAN)}</Label>
                                            </View>
                                            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {
                                                //copyText(paymentDetails.bankDetails?.BIC)
                                                copyText(getSortcodeFromIBAN(paymentDetails.bankDetails?.IBAN))
                                            } }>
                                                <Image style={{ resizeMode: 'contain', height: 20, width: 20 }} source={copy} />

                                            </TouchableOpacity>
                                        </View>

                                        <KMButton
                                            onPress={onDone}
                                            fontSize_16 Montserrat_Medium
                                            color={Color.WHITE} title="Done"
                                            style={{ borderRadius: 20, height: 40, alignSelf: 'center', width: '60%', backgroundColor: Color.LightBlue, marginVertical: 25 }}
                                        />
                                        <Label style={{ textAlign: 'center', marginBottom: 10, }} Montserrat_Medium fontSize_14 color={Color.LightGrey} ml={4}>Don't forget to copy your unique reference number or your money won't reach Deposit Box</Label>
                                    </View>
                                    <Modal animationType="slide"
                                        transparent={true}
                                        visible={props.show && warning}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => {
                                                props.onClose();
                                            }}
                                            style={{ height: "100%", alignItems: "center", justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                                            <View style={[styles.modalContainer, { width: '100%' }]}>
                                                <View style={{ marginHorizontal: 20 }} >
                                                    <Label style={{ textAlign: 'center', marginTop: 10 }} Montserrat_Bold fontSize_16 color={Color.BLACK} ml={4}>Unique reference not copied</Label>
                                                    <Label style={{ textAlign: 'left', marginBottom: 10, marginTop: 10, }} Montserrat_Medium fontSize_14 color='black' ml={4}>Wait - It looks like you didn't copy your unique reference, you must use this or your cash won't reach your account.</Label>
                                                    <Label style={{ textAlign: 'left', marginBottom: 10, marginTop: 10 }} Montserrat_Medium fontSize_14 color='black' ml={4}>If you copied it manually, ignore this.</Label>
                                                    <TouchableOpacity onPress={() => {
                                                        props.onClose()
                                                        showWarning(false)
                                                    }} style={{ margin: 20 }}>
                                                        <Label style={{ textAlign: 'center' }} fontSize_16 color={Color.DarkBlue} Montserrat_Medium>OK</Label>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Modal>
                                </View>}
                        </View>
                    </TouchableOpacity>
                }
            </Modal>
        </View >
    )
}

const styles = StyleSheet.create({
    labelView: {
        flexDirection: "row",
        marginVertical: 5,
        marginHorizontal: 10,
        flexWrap: 'wrap'
    },
    modalContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: Color.WHITE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10
    },
    payment_txt_bold: {
        fontFamily: 'Montserrat-SemiBold',
        color: Color.BLACK,
    },
});


export default PaymentDetailModal