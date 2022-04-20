import DeviceInfo from 'react-native-device-info';
import {setStoredData, getStoredData} from './store';
import {Routes} from './Routes';
import countryData from '../../countries.json';
import moment from 'moment';
import {Buffer} from 'buffer';

import {hasNotch} from 'react-native-device-info';

export default (Globals = {
  merchant_comission: 2.5,
  isIpad: DeviceInfo.isTablet(),
  termsServiceUrl: 'http://pongopay.com/termsandconditions/',
  privacyPolicyUrl: 'https://pongopay.com/termsandconditions/#privacyandcookiepolicy',
  trueLayerTermsOfServiceUrl: 'https://truelayer.com/enduser_tos',
  trueLayerPrivacyPolicyUrl: 'https://truelayer.com/privacy',
  contactUsUrl: 'http://pongopay.com/lets-talk/',
  financialInfoUrl: 'http://pongopay.com/projects/',
  companyHouseUrl:
    'https://beta.companieshouse.gov.uk/?_ga=2.223035673.364931122.1596548760-925141348.1593440330',
  // Global Value
  countryCode: '+44',
  userId: '',
  isProfileCompleted: true,
  isBuilder: false,
  isClient: false,
  countryIso: 'GB',
  countryName: 'United Kingdom',
  nationalityName: 'British, UK',

  // Date Formate
  kDatePickerFormat: 'DD-MM-YYYY',
  // ModiRequestDatePickerFormat: "MMM DD, YYYY",
  ModiRequestDatePickerFormat: 'DD-MM-YYYY',

  // Storage Key
  kUserData: 'userData',
  kToken: 'token',
  kProfileComplete: 'profileComplete',
  kChannels: 'channels',
  timerValue: 0,
});

export const Users = {
  BUILDER: 'UR004',
  CLIENT: 'UR005',
};

export const messageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
};

export const issuesType = {
  PROGRESS: 1,
  ISSUES: 2,
};
export const PaymentStatus = {
  PENDING: 0,
  ESCROW: 1,
  COMPLETE: 2,
  FAILED: 3,
  PAYMENT_REQUESTED: 4,
};
export const MilestoneStatus = {
  PENDING: 0,
  ACCEPTED: 1,
  ON_GOING: 2,
  WORK_REVIEW_REQUEST: 3, /* when builder requests payment */
  COMPLETED: 4,
  REJECT_WITHOUT_DISPUTE: 5,
  DISPUTE: 6,
  RESOLVED_DISPUTE: 7,
  PAYMENT_PROCESSING: 8 /* when payment is done but is not accepted/rejected by mangopay  */,
  PAYMENT_REJECTED: 9 /* when payment is done but rejected by mangopay  */,
  AWAITING_PAYMENT: 10 /* when job is accepted but escrow payment pending */,
  CARD_PAYMENT_FAILED: 11 /* when job is accepted but card payment failed */,
};
export const JobStatus = {
  PENDING: 0,
  REQUESTED: 1,
  AWAITING_RESPONSE: 2,
  ACCEPTED: 3,
  ON_GOING: 4,
  REJECTED: 5,
  OPEN_DISPUTE: 6,
  COMPLETED: 7,
  RESOLVED_DISPUTE: 8,
  DORMANT: 9,
  CANCELLED: 10,
  IN_ARBITRATION: 11,
  CANCELLATION_REQUEST_BY_BUILDER: 12,
  CANCELLATION_REQUEST_BY_CLIENT: 13,
  CANCELLATION_REQUEST_ACCEPTED: 14,
  PAYMENT_PROCESSING: 15 /* when payment is done bt is not accepted/rejected by mangopay  */,
  PAYMENT_REJECTED: 16 /* when payment is done bt rejected by mangopay  */,
  REJECTED_BY_BUILDER: 17 /* when payment is done bt rejected by mangopay  */,
  INCOMPLETE_JOB: 18 /* when job is accepted by builder bt has not added job amount */,
  MODIFICATION_REQUESTED: 19 /* when job is accepted by builder bt has not added job amount */,
  ON_HOLD: 20 /** when payment failed */,
  
  READY_TO_SUBMIT: 22, /** when payment failed */
  FURTHER_ACTION: 25,
};

export const TIME_IN_MS = {
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000
};

// export const Accounts = {
//   SOLE_TRADER: "sole_trader",
//   INCORPORATE_BUSINESS: "incorporate_business",
//   INDIVIUAL: 'individual'
// }
export const Accounts = {
  SOLE_TRADER: 'SOLETRADER',
  BUSINESS: 'BUSINESS',
  NATURAL: 'NATURAL',
};

export const PAYMENT_TYPE = {
  CARD: 'CARD',
  BANK: 'BANK',
};

export const PAYMENT_STATUS = {
  PENDING: 0,
  ESCROW: 1,
  COMPLETE: 2,
  FAILED: 3,
};

export const ErrorResponse = {
  status: false,
  msg: 'Something went wrong!',
};

export const constant = {
  PONGOPAY_SERVICE_EMAIL: 'pongopayInfo@mailinator.com',
  ADMIN: '5e0ac21d9018fc042d39c3d2',

  kUploadContract: '+ Upload Contract',
  kUploadContractFileMassage: 'Files can be uploaded in pdf of jpg format',
  kAddMilestones: '+ Add Milestones',
  kAddMilestonesMassage:
    'Enter milestones of your job to receive partial payment for completed work.',
};

export const isValidValue = value => {
  if (typeof value == 'undefined' || value == null || value == '') {
    return false;
  }
  return true;
};

export const isValidIntValue = value => {
  if (typeof value == 'undefined' || value == null) {
    return false;
  }
  return true;
};

export function getValidNumber(value) {
  if (typeof value !== 'number') {
    value = parseInt(value);
  }

  if (Number.isNaN(value)) {
    return 0;
  }
  return value;
}

export const afterSuccessLogin = async (props, result, isFirstTimeUser) => {
  let navigate = props.navigation.navigate;
  Globals.userId = result._id;
  Globals.countryCode = result.nCountryCode;
  Globals.isBuilder = result._UserRoleId == Users.BUILDER ? true : false;
  Globals.isClient = result._UserRoleId == Users.CLIENT ? true : false;
  Globals.isProfileCompleted = result.isProfileCompleted;
  let isBusiness = result.sAccountType?.toLowerCase() == 'business';

  if (isFirstTimeUser) {
    navigate(isBusiness ? Routes.LegalInformation : Routes.Contact_Information);
  } else {
    // if (!result.isProfileCompleted) {
    //   props.screenProps.onRefreshUser(true)
    //   console.log("if profile not completed but not seen tutorials", result.isProfileCompleted)
    //   navigate(Routes.Personal_Information, { fromProfilePage: false })
    //   // navigate(Routes.BusinessUBO1, { fromProfilePage: false })

    // }
    // else
    if (Globals.isClient && !Globals.isProfileCompleted) {
      navigate(Routes.Personal_Information, {fromProfilePage: false});
    } else if (!result.seenTutorial) {
      props.screenProps.onRefreshUser(true);
      console.log(
        'if profile completed but not seen tutorials',
        result.isProfileCompleted,
      );
      navigate(Routes.TutorialScreen);
    } else {
      console.log(
        'if profile completed and seen tutorials..!!',
        result.isProfileCompleted,
      );
      props.screenProps.onRefreshUser(false);
      navigate(Routes.Job_Listing);
    }
  }
};

export function contains(arr, value) {
  return arr.some(a => a === value);
}

export function findIndex(arr, value) {
  return arr.findIndex(a => a === value);
}

export const clearUserData = async () => {
  await setStoredData(Globals.kUserData, '');
  await setStoredData(Globals.kToken, '');
  await setStoredData(Globals.kChannels, '');
};

export const trimString = str => {
  return str.replace(/^\s+|\s+$/g, '');
};

export const getCountryFromIso = isoString => {
  let country = countryData.filter(c => c.iso2 === isoString?.toLowerCase());
  console.log('Country', country);
  return country.length > 0 ? country[0].name : '';
};

export const getNationalityFromIso = isoString => {
  let country = countryData.filter(c => c.iso2 === isoString?.toLowerCase());
  console.log('Country', country);
  return country.length > 0 ? country[0].nationality : '';
};

export const timer = (fromDate, forDays, type = 'days') => {
  let timerString = '';
  let today = new Date();
  let finalDate = moment(new Date(fromDate)).add(forDays, type);
  const diffTime = Math.abs(finalDate - today);
  let seconds = parseInt(Math.floor(diffTime / 1000));
  let minutes = parseInt(Math.floor(seconds / 60));
  let hours = parseInt(Math.floor(minutes / 60));
  let days = parseInt(Math.floor(hours / 24));
  if (days !== 0 || hours !== 0 || minutes !== 0 || seconds !== 0) {
    timerString = `${days} days`;
    if (days === 0) {
      timerString = `${hours} hours`;
    }
    if (hours === 0) {
      timerString = `${minutes} minutes`;
    }
    if (minutes === 0) {
      timerString = `${seconds} seconds`;
    }
  }
  return timerString;
};

export const encodeString = string => {
  const encoded_string = Buffer.from(string).toString('base64');
  return encoded_string;
};

export function getFormDataObj(obj) {
  let formData = new FormData();
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      const element = obj[i];
      formData.append(i, element);
    }
  }
  return formData;
}

export function getAdminComission(amount, subscriptionPlans) {
  if (typeof amount != 'number') {
    amount = Number(amount);
  }
  if (Number.isNaN(amount)) {
    return 0;
  }
  let plan = subscriptionPlans.filter(
    p => p.minAmount <= amount && p.maxAmount >= amount,
  );
  // return ((amount * this.Globals.merchant_comission) / 100)
  return plan.length > 0 ? (amount * Number(plan[0].commission)) / 100 : 0;
}

export function getPmComission(amount, comission) {
  if (typeof amount != 'number') {
    amount = Number(amount);
  }
  if (Number.isNaN(amount) || amount <= 0) {
    return 0;
  }
  return (amount * parseFloat(comission)) / 100;
}

export function getTwoDecimalString(value) {
  if (typeof value != 'number') {
    value = parseFloat(value);
  }
  if (Number.isNaN(value) || value <= 0) {
    return '0';
  }
  return value.toFixed(2).toString();
}

export function _calculateAge(birthDate) {
  let diff = moment().diff(moment(birthDate, 'MM-DD-YYYY'), 'years');
  if (Number.isNaN(diff) || diff <= 0) {
    return 0;
  }
  return diff;
}

export function getAddress(addObj) {
  if (!addObj) {
    return '--';
  }
  let address = '';
  for (const key in addObj) {
    if (addObj.hasOwnProperty(key)) {
      const element = addObj[key];
      if (element !== '') {
        if (key.toLowerCase().includes('country')) {
          address += ', ' + getCountryFromIso(element);
        } else if (address === '') {
          address += element;
        } else {
          address += ', ' + element;
        }
      }
    }
  }
  return address;
}

export async function getKycRoute(type, user) {
  if (!user) {
    user = JSON.parse(await getStoredData(Globals.kUserData));
  }  
  let isBusiness =
    user.sAccountType?.toLowerCase() == 'business' ? true : false;
  let routeName = Routes.Financial_Information;

  if (type === 'bank') {
    if (isBusiness && !user?.oLegalRepresentativeDetail?.address) {
      routeName = Routes.LegalInformation;
    } else if (!isBusiness && !user?.oAddress) {
      routeName = Routes.Contact_Information;
    }
  }

  if(type === 'register') routeName = Routes.Contact_Information;
  return routeName;
}

export function getBankAccountFromIBAN(iban) {
  let bankAccount = iban ? iban.substr(iban.length - 8) : '';
  return bankAccount;
}

export function getSortcodeFromIBAN(iban) {
  let bankAccount = iban ? iban.substr(iban.length - 14) : '';
  let sortCode = bankAccount.substr(0, 6);
  return sortCode;
}

export function bytesToMb(bytes) {
  return bytes / 1000000;
}

export function getRandomString(chars) {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, chars);
}

export function hasNotchScreen() {
  return DeviceInfo.hasNotch();
}

export function nextPayoutDateTime (date){
  date= new Date(date);
  let finalDate = new Date(date.getTime() +  TIME_IN_MS.DAY);
  let hour = date.getHours();
  if(hour<9){
    finalDate.setHours(9,0,0,0);
    return finalDate;
  }else if(hour<16){
    finalDate.setHours(16,0,0,0);
    return finalDate;
  }
  else{
    finalDate = new Date(date.getTime() +  2 * TIME_IN_MS.DAY);
    finalDate.setHours(9,0,0,0);
    return finalDate;
  }
}

export const dateDiff = (toDate) => {
  let timerString = '';
  let today = new Date();
  let finalDate = new Date(toDate);
  const diffTime = Math.abs(finalDate - today);
  let seconds = parseInt(Math.floor(diffTime / 1000));
  let minutes = parseInt(Math.floor(seconds / 60));
  let hours = parseInt(Math.floor(minutes / 60));
  let days = parseInt(Math.floor(hours / 24));
  if (days !== 0 || hours !== 0 || minutes !== 0 || seconds !== 0) {
    timerString = `${days} days`;
    if(days === 1) timerString = '1 day';
    if (days === 0) {
      timerString = `${hours} hours`;
      if(hours === 1) timerString = '1 hour';
    }
    if (hours === 0) {
      timerString = `${minutes} minutes`;
      if(minutes === 1) timerString = '1 minute';
    }
    if (minutes === 0) {
      timerString = `${seconds} seconds`;
      if(seconds === 1) timerString = '1 second';
    }
  }
  return timerString;
};