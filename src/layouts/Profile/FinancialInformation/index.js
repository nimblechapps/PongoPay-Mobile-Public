/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity, Dimensions, Image, Text, Linking } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Label from '../../../components/Label';
import Color from '../../../utils/color'
import styles from "./styles"
import Globals, { isValidIntValue, Users, isValidValue, Accounts, afterSuccessLogin, bytesToMb } from "../../../utils/Globals";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateAccountNumber, validateSortcode } from '../../../utils/validation';
import { ErrorMessage } from '../../../utils/message';
import { fontXSmall16 } from '../../../utils/theme';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import HeaderRight from '../../../components/Header/HeaderRight';
import TextField from '../../../components/TextField';
import KMButton from '../../../components/KMButton';
import ToastMessage from '../../../components/toastmessage';
import GlobalStyles from '../../../utils/GlobalStyles';
import { getStoredData, setStoredData } from '../../../utils/store';
import ProgressHud from '../../../components/ProgressHud';
import ImageTag from "../../../assets/Images/image_man.png"
import API from '../../../API';
import { Routes } from '../../../utils/Routes';
import CustomIcon from "../../../components/CustomIcon";
import { fontNormal20 } from '../../../utils/theme';
import {
    showDocumentPicker,
    showImagePickerView,
} from '../../../utils/DocumentPicker';
import CheckBox from "react-native-check-box";

import InputMask from '../../../components/InputMask';
import Mangopay from '../../../utils/mangopay';
import ToolTip from '../../../components/Tooltip';
import color from '../../../utils/color';
import { getKycStatus } from '../../../utils/GetUserStatus';

const options = {
    title: 'Select Image',
    maxWidth: 1000,
    maxHeight: 1000,
    customButtons: [
        { name: 'Choose from files', title: 'Choose from files', mediaType: 'image' },
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },

};
export default class FinancialInformation extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderLeft
                iconName="left-arrow"
                onPress={() => {
                    navigation.goBack();
                }}
            />,
            headerTitle: () => <HeaderTitle title={'Edit Profile'} />,
            headerRight: (
                <HeaderRight
                    buttonTitle={Globals.isProfileCompleted ? "" : 'Log out'}
                    onPress={() => {
                        !Globals.isProfileCompleted && navigation.push(Routes.Login)
                    }}
                />
            ),
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isShowToast: false,
            bankAccNo: {
                value: "",
                message: "",
                isValid: false,
            },
            commission: {
                value: "",
                message: "",
                isValid: false,
            },
            sortCode: {
                value: "",
                message: "",
                isValid: false,
            },
            address2: "",
            countryCode: Globals.countryCode,
            isTermsAccepted: false,
            idProof: "",
            RegistrationProof: "",
            articlesOfAssociation: "",
            idProofObj: {
                image: '',
                path: ''
            },
            registrationProofObj: {
                image: '',
                path: ''
            },
            articlesProofObj: {
                image: '',
                path: ''
            },
            isBusiness: false,
            isKycCompleted: () => { }
        }
    }

    async componentDidMount() {
        this.getUserData()
    }


    getUserData = () => {
        getStoredData(Globals.kUserData).then(async (value) => {
            let result = JSON.parse(value)
            console.log("FinancialInformation UserData", result.sAccountType)
            if (result) {
                let { bankAccNo, sortCode } = this.state
                let isProfileCompleted = result.isProfileCompleted
                let identity_proof = result.kyc_status ? result.kyc_status.identity_proof : undefined
                let articals_of_association = result.kyc_status ? result.kyc_status.articals_of_association : undefined
                let registration_proof = result.kyc_status ? result.kyc_status.registration_proof : undefined

                let response = await Mangopay.getBankAccountOfUser()
                let bankDetails = response.bankAccounts.filter((b) => (b.Active == true && b.AccountNumber))

                if (bankDetails.length > 0) {
                    let isAccountNumber = bankDetails[0]?.AccountNumber
                    bankAccNo['value'] = isAccountNumber ? bankDetails[0]?.AccountNumber : bankDetails[0].IBAN
                    sortCode['value'] = isAccountNumber ? bankDetails[0]?.SortCode : bankDetails[0].BIC
                    // bankAccNo['value'] = result.nBankAccNo || ''
                    // sortCode['value'] = result.sSortCode || ''
                }
                // bankAccNo['value'] = result.nBankAccNo || ''
                // sortCode['value'] = result.sSortCode || ''

                let isKycCompleted = () => {
                    let status = false
                    if (result.kyc_status) {
                        status = result.kyc_status.identity_proof !== undefined
                        // result.sAccountType.toUpperCase() === Accounts.NATURAL && (status = result.kyc_status.identity_proof !== undefined)
                        // result.sAccountType.toUpperCase() === Accounts.SOLE_TRADER && (status = result.kyc_status.identity_proof !== undefined && result.kyc_status.registration_proof !== undefined)
                        // result.sAccountType.toUpperCase() === Accounts.BUSINESS && (status = result.kyc_status.identity_proof !== undefined && result.kyc_status.articals_of_association != undefined && result.kyc_status.registration_proof !== undefined)
                    }
                    return status
                }

                // let isKycApproved = getKycStatus(result.kyc_status.identity_proof) === "Approved"
                let isKycApproved = result.kyc_status ? getKycStatus(result.kyc_status.identity_proof) === "Approved" : ''

                let isBusiness = result.sAccountType?.toLowerCase() == 'business' ? true : false
                this.setState({
                    bankAccNo: bankAccNo,
                    sortCode: sortCode,
                    sAccountType: result.sAccountType,
                    identity_proof,
                    articals_of_association,
                    registration_proof,
                    isProfileCompleted,
                    isKycCompleted,
                    isKycApproved,
                    isTermsAccepted: isProfileCompleted,
                    isBusiness
                })
            }
        })
    }
    onSelectImage = (type) => {
        showImagePickerView(options, response => {


            if (response && response.customButton && response.customButton == 'Choose from files') {
                showDocumentPicker(false, (error, response) => {
                    if (parseFloat(bytesToMb(response.size)) < 7.00) {
                        this.handleChooseFile(response, type);
                    } else {
                        alert('The file should not be greater than 7 mb.')
                    }
                });
            } else {
                if (!response.didCancel && !response.error && !response.customButton) {

                    if (parseFloat(bytesToMb(response.fileSize)) < 7.00) {
                        this.handleChooseFile(response, type);
                    } else {
                        alert('The file should not be greater than 7 mb.')
                    }
                }
            }



            // if (parseFloat(bytesToMb(response.fileSize)) < 7.00) {
            //     if (response.customButton == 'Choose from files') {
            //         showDocumentPicker(false, (error, response) => {
            //             if (error) {
            //                 return;
            //             }
            //             this.handleChooseFile(response, type);
            //         });
            //     } else {
            //         if (!response.didCancel && !response.error && !response.customButton) {
            //             this.handleChooseFile(response, type);
            //         }
            //     }
            // } else {
            //     alert('The file should not be greater than 7 mb.')
            // }

        });
    };


    async handleChooseFile(response, type) {
        if (type == "idProof") {
            const idProofObj = this.state.idProofObj;
            const source = { uri: response.uri, mime: response.type };
            idProofObj.image = source;
            idProofObj.path = response.uri;
            this.setState({
                idProofObj,
                idProof: response.uri
            })


        } else if (type == "RegistrationProof") {
            const registrationProofObj = this.state.registrationProofObj;
            const source = { uri: response.uri, mime: response.type };
            registrationProofObj.image = source;
            registrationProofObj.path = response.uri;
            this.setState({
                registrationProofObj,
                RegistrationProof: response.uri
            })



        } else if (type == "articlesOfAssociation") {
            const articlesProofObj = this.state.articlesProofObj;
            const source = { uri: response.uri, mime: response.type };
            articlesProofObj.image = source;
            articlesProofObj.path = response.uri;
            this.setState({
                articlesProofObj,
                articlesOfAssociation: response.uri
            })

        } else if (type == "certificateOfIncorporation") {
            const registrationProofObj = this.state.registrationProofObj;
            const articlesProofObj = this.state.articlesProofObj;
            const source = { uri: response.uri, mime: response.type };
            articlesProofObj.image = source;
            articlesProofObj.path = response.uri;
            registrationProofObj.image = source;
            registrationProofObj.path = response.uri;
            this.setState({
                articlesProofObj,
                articlesOfAssociation: response.uri,
                registrationProofObj,
                RegistrationProof: response.uri
            });

        }
    }

    onTooltipClick = (ref) => {
        let state = this.state
        state[ref] = !this.state[ref]
        this.setState(state)
    }

    render() {
        const { isBusiness, isLoading, bankAccNo, commission, sortCode, isTermsAccepted, sAccountType, identity_proof, articals_of_association, registration_proof } = this.state;
        console.log(this.state.RegistrationProof, '===RegistrationProof')
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={styles.informationDetails}>
                            <View style={{ flexDirection: 'row' }}>
                                <Label fontSize_16 Montserrat_Medium color={Color.BLACK} style={{ paddingRight: 10 }}>Financial Information</Label>
                                <ToolTip
                                    toolTip={this.state.toolTip}
                                    onClickPress={() => this.setState({ toolTip: !this.state.toolTip })}
                                    placement={'bottom'}
                                    renderView={() => {
                                        return (
                                            <View>
                                                <Text style={{ marginBottom: 7 }} >{!Globals.isBuilder ? 'This is the account that refunds will be transfered to in the event that work has not been completed as agreed.' : 'This is the account that funds will be transferred into one the work is complete.'}</Text>
                                                <TouchableOpacity onPress={() => Linking.openURL(Globals.financialInfoUrl)}>
                                                    <Text style={{ color: color.LightBlue, }} >Click here<Text style={{ color: 'black' }} > to find out more about how we protect your personal and financial data.</Text></Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }}
                                />
                            </View>

                            <View style={styles.borderLine}></View>
                            <View style={{ width: (Globals.isIpad ? 400 : "100%") }}>
                                <View style={{ zIndex: -1 }}>
                                    <TextField
                                        placeholder='Enter Bank Account No.'
                                        LabelTitle='Bank Account No.*'
                                        onChangeText={this.onBankAccNoChange}
                                        value={bankAccNo.value}
                                        autoFocus={true}
                                        keyboardType={"phone-pad"}
                                        returnKeyType={"done"}>
                                        {bankAccNo.message !== "" &&
                                            <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{bankAccNo.message}</Label>
                                            </View>
                                        }

                                    </TextField>
                                </View>

                                <View style={{ zIndex: -11 }}>
                                    <InputMask
                                        type={'custom'}
                                        options={{ mask: '9999999999999' }}
                                        placeholder='Enter Sort Code'
                                        LabelTitle='Sort Code*'
                                        onChangeText={this.onSortCodeChange}
                                        value={sortCode.value}
                                        keyboardType={"phone-pad"}
                                        returnKeyType={"done"}
                                        customStyle={{ width: "100%", height: 48 }}
                                        // isCountryCode={true}
                                        reference={ref => this.phone = ref}
                                    // countryCode={countryCode}
                                    // onSelectCountry={() => this.setState({ countryCode: this.phone.getValue() })}
                                    >
                                        {sortCode.message !== "" &&
                                            <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{sortCode.message}</Label>
                                            </View>
                                        }
                                    </InputMask>
                                    {/* <TextField
                                        placeholder='Enter BIC'
                                        LabelTitle='BIC*'
                                        onChangeText={this.onSortCodeChange}
                                        value={sortCode.value}>
                                        {sortCode.message !== "" &&
                                            <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{sortCode.message}</Label>
                                            </View>
                                        }

                                    </TextField> */}
                                </View>

                                {/* PP-12 <View style={[styles.uploadSection, { zIndex: -111 }]}>
                                    <Label>{`${!Globals.isProfileCompleted ? 'Upload' : ''} Your passport or driving licence ${identity_proof ? ` : ${getKycStatus(identity_proof)}` : ''}`}</Label>
                                    {identity_proof == undefined && <TouchableOpacity
                                        style={{ paddingLeft: 15 }}
                                        onPress={() => this.onSelectImage("idProof")}>
                                        <CustomIcon
                                            name={'add-image'}
                                            style={{ fontSize: fontNormal20, color: Color.LightBlue }}
                                        />
                                    </TouchableOpacity>}
                                </View> */}

                                <View style={[styles.uploadSection, { zIndex: -111 }]}>
                                    <Label style={{ flex: 1 }}>{`${!Globals.isProfileCompleted ? 'Upload' : ''} Your passport or driving licence ${identity_proof ? ` : ${getKycStatus(identity_proof)}` : ''}`}</Label>
                                    {!this.state.isKycApproved &&
                                        <TouchableOpacity
                                            style={{ paddingLeft: 15 }}
                                            onPress={() => this.onSelectImage("idProof")}>
                                            <CustomIcon
                                                name={'add-image'}
                                                style={{ fontSize: fontNormal20, color: Color.LightBlue }}
                                            />
                                        </TouchableOpacity>
                                    }
                                </View>

                                {/* PP-12 <View style={styles.mainSection}>
                                    {this.state.idProof != "" ?
                                        <View >
                                            {this.state.idProofObj.image.mime.includes('image') ?
                                                <View style={styles.imageSection}>
                                                    <Image source={this.state.idProof != "" ? { uri: this.state.idProof } : require("../../../assets/Images/building_issues.png")} style={styles.uploadImage} resizeMode='contain'></Image>
                                                </View>
                                                :
                                                <View style={styles.imageSectionPDF}>
                                                    <Image source={this.state.idProofObj.image.mime.includes('image') ? { uri: this.state.idProof } : require("../../../assets/Images/pdf.png")} style={styles.uploadPdfImage} resizeMode='contain'></Image>
                                                </View>
                                            }
                                        </View>
                                        : identity_proof == undefined && <View style={styles.uploadImagePlaceholder}>
                                            <Image source={require("../../../assets/Images/picturemessage.png")} style={styles.uploadImageIcon}></Image>
                                        </View>}
                                </View> */}

                                <View style={styles.mainSection}>
                                    {this.state.idProof != "" ?
                                        <View >
                                            {this.state.idProofObj.image.mime.includes('image') ?
                                                <View style={styles.imageSection}>
                                                    <Image source={this.state.idProof != "" ? { uri: this.state.idProof } : require("../../../assets/Images/building_issues.png")} style={styles.uploadImage} resizeMode='contain'></Image>
                                                </View>
                                                :
                                                <View style={styles.imageSectionPDF}>
                                                    <Image source={this.state.idProofObj.image.mime.includes('image') ? { uri: this.state.idProof } : require("../../../assets/Images/pdf.png")} style={styles.uploadPdfImage} resizeMode='contain'></Image>
                                                </View>
                                            }
                                        </View>
                                        : !this.state.isKycApproved && <View style={styles.uploadImagePlaceholder}>
                                            <Image source={require("../../../assets/Images/picturemessage.png")} style={styles.uploadImageIcon}></Image>
                                        </View>}
                                </View>

                                {
                                    //HEREHEREHERE
                                    isBusiness && <View style={[styles.uploadSection, { zIndex: -111 }]}>
                                        <Label>{`${!Globals.isProfileCompleted ? 'Upload' : ''} Certificate of Incorporation ${articals_of_association ? ` : ${getKycStatus(articals_of_association)}` : ''}`}</Label>
                                        <ToolTip
                                            onClickPress={() => this.onTooltipClick('AOA')}
                                            toolTip={this.state['AOA']}
                                            renderView={() => {
                                                return (
                                                    <TouchableOpacity onPress={() => Linking.openURL(Globals.companyHouseUrl)}>
                                                        <Text style={{ marginBottom: 7 }} >You can find this information on the companies house website <Text style={{ color: color.LightBlue, }} >here</Text></Text>
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                        {articals_of_association == undefined && <TouchableOpacity
                                            style={{ paddingLeft: 15 }}
                                            onPress={() => this.onSelectImage("certificateOfIncorporation")}>
                                            <CustomIcon
                                                name={'add-image'}
                                                style={{ fontSize: fontNormal20, color: Color.LightBlue }}
                                            />
                                        </TouchableOpacity>}
                                    </View>
                                }
                                {isBusiness &&
                                    <View style={styles.mainSection}>
                                        {this.state.articlesOfAssociation !== "" ? <View>
                                            {this.state.articlesProofObj.image.mime.includes('image') ?
                                                <View style={styles.imageSection}>
                                                    <Image source={this.state.articlesOfAssociation !== "" ? { uri: this.state.articlesOfAssociation } : require("../../../assets/Images/building_issues.png")} style={styles.uploadImage}></Image>
                                                </View>
                                                :
                                                <View style={styles.imageSection}>
                                                    <Image source={this.state.articlesProofObj.image.mime.includes('image') ? { uri: this.state.articlesOfAssociation } : require("../../../assets/Images/pdf.png")} style={styles.uploadPdfImage}></Image>
                                                </View>
                                            }
                                        </View> : articals_of_association == undefined && <View style={styles.uploadImagePlaceholder}>
                                            <Image source={require("../../../assets/Images/picturemessage.png")} style={styles.uploadImageIcon}></Image>
                                        </View>
                                        }
                                    </View>
                                }

                                {/* {isBusiness && <View style={[styles.uploadSection, { zIndex: -111 }]}>
                                    <Label>{`${!Globals.isProfileCompleted ? 'Upload' : ''} Articles of Association ${articals_of_association ? ` : ${getKycStatus(articals_of_association)}` : ''}`}</Label>
                                    <ToolTip
                                        onClickPress={() => this.onTooltipClick('AOA')}
                                        toolTip={this.state['AOA']}
                                        renderView={() => {
                                            return (
                                                <TouchableOpacity onPress={() => Linking.openURL(Globals.companyHouseUrl)}>
                                                    <Text style={{ marginBottom: 7 }} >You can find this information on the companies house website <Text style={{ color: color.LightBlue, }} >here</Text></Text>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                    {articals_of_association == undefined && <TouchableOpacity
                                        style={{ paddingLeft: 15 }}
                                        onPress={() => this.onSelectImage("articlesOfAssociation")}>
                                        <CustomIcon
                                            name={'add-image'}
                                            style={{ fontSize: fontNormal20, color: Color.LightBlue }}
                                        />
                                    </TouchableOpacity>}
                                </View>
                                } */}
                                {/* {isBusiness &&
                                    <View style={styles.mainSection}>
                                        {this.state.articlesOfAssociation !== "" ? <View>
                                            {this.state.articlesProofObj.image.mime.includes('image') ?
                                                <View style={styles.imageSection}>
                                                    <Image source={this.state.articlesOfAssociation !== "" ? { uri: this.state.articlesOfAssociation } : require("../../../assets/Images/building_issues.png")} style={styles.uploadImage}></Image>
                                                </View>
                                                :
                                                <View style={styles.imageSection}>
                                                    <Image source={this.state.articlesProofObj.image.mime.includes('image') ? { uri: this.state.articlesOfAssociation } : require("../../../assets/Images/pdf.png")} style={styles.uploadPdfImage}></Image>
                                                </View>
                                            }
                                        </View> : articals_of_association == undefined && <View style={styles.uploadImagePlaceholder}>
                                            <Image source={require("../../../assets/Images/picturemessage.png")} style={styles.uploadImageIcon}></Image>
                                        </View>
                                        }
                                    </View>
                                }
                                {isBusiness && <View style={styles.uploadSection}>
                                    <Label>{`${!Globals.isProfileCompleted ? 'Upload' : ''} Registration Proof ${registration_proof ? ` : ${getKycStatus(registration_proof)}` : ''}`}</Label>
                                    <ToolTip
                                        onClickPress={() => this.onTooltipClick('RP')}
                                        toolTip={this.state['RP']}
                                        renderView={() => {
                                            return (
                                                <TouchableOpacity onPress={() => Linking.openURL(Globals.companyHouseUrl)}>
                                                    <Text style={{ marginBottom: 7 }} >You can find this information on the companies house website <Text style={{ color: color.LightBlue, }} >here</Text></Text>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                    {registration_proof == undefined && <TouchableOpacity
                                        style={{ paddingLeft: 15 }}
                                        onPress={() => this.onSelectImage("RegistrationProof")}>
                                        <CustomIcon
                                            name={'add-image'}
                                            style={{ fontSize: fontNormal20, color: Color.LightBlue }}
                                        />
                                    </TouchableOpacity>}
                                </View>
                                } */}

                                {/* {isBusiness &&
                                    <View style={styles.mainSection}>
                                        {this.state.RegistrationProof != "" ? <View>
                                            {this.state.registrationProofObj.image.mime.includes('image') ?
                                                <View style={styles.imageSection}>
                                                    <Image source={this.state.RegistrationProof != "" ? { uri: this.state.RegistrationProof } : require("../../../assets/Images/building_issues.png")} style={styles.uploadImage}></Image>
                                                </View>
                                                :
                                                <View style={styles.imageSection}>
                                                    <Image source={this.state.registrationProofObj.image.mime.includes('image') ? { uri: this.state.RegistrationProof } : require("../../../assets/Images/pdf.png")} style={styles.uploadPdfImage}></Image>
                                                </View>
                                            }
                                        </View>
                                            : registration_proof == undefined && <View style={styles.uploadImagePlaceholder}>
                                                <Image source={require("../../../assets/Images/picturemessage.png")} style={styles.uploadImageIcon}></Image>
                                            </View>
                                        }
                                    </View>
                                } */}

                                {!this.state.isKycCompleted() && <CheckBox
                                    style={{ marginTop: 40, }}
                                    onClick={() => { this.setState({ isTermsAccepted: !isTermsAccepted }) }}
                                    checkedImage={<CustomIcon style={styles.checkedIcon} name="check" />}
                                    unCheckedImage={<View style={styles.checkIcon}></View>}
                                    isChecked={isTermsAccepted}
                                    rightText={"I accept contract Terms & Conditions."}
                                    rightTextStyle={{ color: Color.DarkGrey, fontFamily: "Montserrat-Regular", fontSize: fontXSmall16, lineHeight: 24, }}
                                />
                                }

                            </View>
                            {/* <View style={styles.uploadSection}>
                                <Label>{`${!Globals.isProfileCompleted ? 'Upload' : ''} Identity Proof ${identity_proof ? ` : ${identity_proof}` : ''}`}</Label>
                                {!Globals.isProfileCompleted && <TouchableOpacity
                                    style={{ paddingLeft: 15 }}
                                    onPress={() => this.onSelectImage("idProof")}>
                                    <CustomIcon
                                        name={'add-image'}
                                        style={{ fontSize: fontNormal20, color: Color.LightBlue }}
                                    />
                                </TouchableOpacity>}
                            </View>
                            <View style={styles.mainSection}>
                                {!Globals.isProfileCompleted && <KeyboardAwareScrollView scrollEnabled={true} enableOnAndroid={false} showsVerticalScrollIndicator={false}>
                                    <View style={styles.imageSection}>
                                        <Image source={this.state.idProof != "" ? { uri: this.state.idProof } : require("../../../assets/Images/building_issues.png")} style={styles.uploadImage}></Image>
                                    </View>
                                </KeyboardAwareScrollView>}
                            </View> */}



                            {/* {Globals.isBuilder && <View style={styles.uploadSection}>
                                <Label>{`${!Globals.isProfileCompleted ? 'Upload' : ''} Registration Proof ${articals_of_association ? ` : ${articals_of_association}` : ''}`}</Label>
                                {!Globals.isProfileCompleted && <TouchableOpacity
                                    style={{ paddingLeft: 15 }}
                                    onPress={() => this.onSelectImage("RegistrationProof")}>
                                    <CustomIcon
                                        name={'add-image'}
                                        style={{ fontSize: fontNormal20, color: Color.LightBlue }}
                                    />
                                </TouchableOpacity>}
                            </View>
                            }
                            {Globals.isBuilder && <View style={styles.mainSection}>
                                {!Globals.isProfileCompleted && <View>
                                    <View style={styles.imageSection}>
                                        <Image source={this.state.RegistrationProof ? { uri: this.state.RegistrationProof } : require("../../../assets/Images/building_issues.png")} style={styles.uploadImage}></Image>
                                    </View>
                                    <View style={styles.imageSection}>
                                        <Image source={this.state.idProof != "" ? { uri: this.state.RegistrationProof } : require("../../../assets/Images/pdf.png")} style={styles.uploadPdfImage}></Image>
                                    </View>
                                </View>}
                            </View>
                            } */}
                            <KMButton
                                fontSize_16 Montserrat_Medium
                                color={Color.BLACK}
                                title={"UPDATE"}
                                textStyle={{ padding: 0 }}
                                style={{ backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow, marginTop: 20, marginBottom: 40, width: (Globals.isIpad ? 400 : "100%"), alignItems: 'center', justifyContent: 'center', height: 48, zIndex: -1 }}
                                disabled={this.isSubmitDisable()}
                                onPress={this.onUpdateClick}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                    <ToastMessage message={this.state.message} isVisible={this.state.isShowToast} />
                </SafeAreaView>
                {isLoading && <ProgressHud />}
                <NavigationEvents onWillFocus={this.getUserData} />
            </View >
        );
    }

    onBankAccNoChange = (text) => {
        const bankAccNo = this.state.bankAccNo
        bankAccNo.value = text.trim()

        // if (bankAccNo.value.length == 0 || bankAccNo.value == "") {
        //     bankAccNo.message = ErrorMessage.accountRequired
        //     bankAccNo.isValid = false
        // } else
        if (!validateAccountNumber(bankAccNo.value)) {
            bankAccNo.message = ErrorMessage.accountInvalid
            bankAccNo.isValid = false
        } else {
            bankAccNo.message = ""
            bankAccNo.isValid = true
        }
        this.setState({
            bankAccNo
        })
    }

    onSortCodeChange = (text) => {
        const sortCode = this.state.sortCode
        sortCode.value = text.trim()

        // if (sortCode.value.length == 0 || sortCode.value == "") {
        //     sortCode.message = ErrorMessage.sortcodeRequired
        //     sortCode.isValid = false
        // } else 
        if (!validateSortcode(sortCode.value)) {
            sortCode.message = ErrorMessage.sortcodeInvalid
            sortCode.isValid = false
        } else {
            sortCode.message = ""
            sortCode.isValid = true
        }
        this.setState({
            sortCode
        })
    }

    isSubmitDisable() {
        /* client feedback 06/07/2020 */
        // if (Globals.isBuilder) {
        //     return !this.state.bankAccNo.isValid || !this.state.sortCode.isValid || !this.state.isTermsAccepted
        // if (this.state.identity_proof && this.state.articals_of_association && this.state.registration_proof) {
        //     return !this.state.bankAccNo.isValid || !this.state.sortCode.isValid
        // } else {
        //     return this.state.sAccountType == "BUSINESS" ?
        //         this.state.idProof == "" || this.state.RegistrationProof == "" || this.state.articlesOfAssociation == "" || !this.state.bankAccNo.isValid || !this.state.sortCode.isValid || !this.state.isTermsAccepted :
        //         this.state.idProof == "" || this.state.RegistrationProof == "" || !this.state.bankAccNo.isValid || !this.state.sortCode.isValid || !this.state.isTermsAccepted
        // }

        // }
        // else if (!Globals.isBuilder) {

        // if (this.state.identity_proof) {
        //     return !this.state.isTermsAccepted
        // } else {
        //     return this.state.idProof == "" || !this.state.isTermsAccepted
        // }
        return !this.state.isTermsAccepted
        // }


        // if (!Globals.isProfileCompleted) {
        //     return !this.state.bankAccNo.isValid || !this.state.sortCode.isValid || !this.state.isTermsAccepted
        // } else {
        //     return !this.state.bankAccNo.isValid || !this.state.sortCode.isValid
        // }
    }


    getAccountType = async () => {
        let userData = JSON.parse(await getStoredData(Globals.kUserData))
        if (Globals.isClient) {
            return Accounts.INDIVIUAL
        } else {
            return userData.sAccountType
        }
    }

    onUpdateClick = async () => {
        console.log("OnUIpdate click")
        // let userData = JSON.parse(await getStoredData(Globals.kUserData))
        // let isSoleTrader = userData.sAccountType == Accounts.SOLE_TRADER

        if (!this.props.screenProps.isConnected) {
            return
        }

        let { isBusiness, bankAccNo, sortCode, idProofObj, registrationProofObj, articlesProofObj } = this.state
        this.setState({ isLoading: true });

        try {
            let request = new FormData();
            request.append("userId", Globals.userId);
            request.append("isTermsAccepted", this.state.isTermsAccepted);
            request.append("isLastStep", JSON.stringify(true));
            sortCode.value && sortCode.value != '' && request.append("sSortCode", sortCode.value);
            bankAccNo.value && bankAccNo.value != '' && request.append("nBankAccNo", bankAccNo.value);
            let idProof = {};

            if (isBusiness) {
                if (registrationProofObj.path != '') {
                    let registration = {};
                    registration.uri = registrationProofObj.path;
                    registration.type = "image/jpg";
                    registration.name = 'idProof.jpg';
                    request.append("registration_proof", registration);
                }

                if (articlesProofObj.path != '') {
                    let articles = {}
                    articles.uri = articlesProofObj.path;
                    articles.type = "image/jpg";
                    articles.name = 'idProof.jpg';
                    request.append("articals_of_association", articles);
                }
                if (idProofObj.path != '') {
                    idProof.uri = idProofObj.path;
                    idProof.type = "image/jpg";
                    idProof.name = 'idProof.jpg';
                    request.append("identity_proof", idProof);
                }
            } else {
                if (idProofObj.path != '') {
                    idProof.uri = idProofObj.path;
                    idProof.type = "image/jpg";
                    idProof.name = 'idProof.jpg';
                    request.append("identity_proof", idProof);
                }
            }

            let response = isBusiness ? await API.editProfileBusiness(request) : await API.editProfileIndividual(request)
            console.log("response", response)
            this.setState({ isLoading: false });
            const { screenProps } = this.props;
            if (!screenProps.isConnected) {
                return
            }
            if (response.status) {
                this.setState({
                    isShowToast: true,
                    message: response.msg
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            isShowToast: false
                        })
                    }, 5000)

                });
                // await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                Globals.userId = response.data._id
                Globals.countryCode = response.data.nCountryCode
                Globals.isBuilder = (response.data._UserRoleId == Users.BUILDER) ? true : false
                Globals.isClient = (response.data._UserRoleId == Users.CLIENT) ? true : false
                await this._navigateToDashboard(response.data)
                screenProps.onRefreshUser()
            } else {
                screenProps.callback(response)
            }
        } catch (error) {
            console.log("editProfile error", error.message);
            this.setState({ isLoading: false });
        }
    }
    async _navigateToDashboard(newUser) {
        console.log("New USer", newUser)

        let userData = JSON.parse(await getStoredData(Globals.kUserData))
        await setStoredData(Globals.kUserData, JSON.stringify(newUser))

        console.log("New USer", userData)

        // if (userData.sAccountType.toLowerCase() === 'business') {
        //     this.props.navigation.navigate(Routes.uboPersonDetails)
        // } else {
        if (userData.isProfileCompleted) {
            console.log("inside is profile completed", Globals.isProfileCompleted)
            this.props.navigation.navigate(Routes.My_Profile)
        } else {
            afterSuccessLogin(this.props, newUser)
        }
        // }

        Globals.isProfileCompleted = newUser.isProfileCompleted

    }
}

