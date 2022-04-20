import API from '../API';
import {getStoredData} from './store';

/** Developer@nbchps.com */
// const TRUEVALUE = {
//   AUTH_URL: "https://auth.truelayer-sandbox.com/",
//   URL: "https://pay-api.truelayer-sandbox.com/",
//   CLIENT_ID: "sandbox-pongopay-0e62ff",
//   CLIENT_SECRET: "6ca6b5e6-9009-41c8-9c1c-da7ebe60317a"
// }

/** SANDBOX / zudu */
// const TRUEVALUE = {
//   AUTH_URL: 'https://auth.truelayer-sandbox.com/',
//   URL: 'https://pay-api.truelayer-sandbox.com/',
//   CLIENT_ID: 'sandbox-pongopay-4c2e7e',
//   CLIENT_SECRET: '06a16651-4d97-4702-b7cc-c2d5a01587f9',
// };

// ** Live */
const TRUEVALUE = {
  AUTH_URL: 'https://auth.truelayer.com/',
  URL: 'https://pay-api.truelayer.com/',
  CLIENT_ID: 'pongopay-9dbb4b',
  CLIENT_SECRET: '71e37fff-f6fc-4c3f-8256-9c909a7f5905',
};

const endpoint = {
  authToken: TRUEVALUE.AUTH_URL + 'connect/token',
  payment: TRUEVALUE.URL + 'single-immediate-payments',
};

export default class {
  static async generateTrueLayerToken() {
    let params = {
      client_id: TRUEVALUE.CLIENT_ID,
      client_secret: TRUEVALUE.CLIENT_SECRET,
      scope: 'payments',
      grant_type: 'client_credentials',
    };
    try {
      let response = await API.generateTrueLayerToken(
        endpoint.authToken,
        params,
      );
      console.log('generateTrueLayerToken response===', response);
      return response;
    } catch (error) {
      console.log('generateTrueLayerToken error===', error);
      return undefined;
    }
  }

  static async singleImmediatePayment(params, authToken) {
    try {
      let response = await API.singleImmediatePayment(
        endpoint.payment,
        params,
        authToken,
      );
      console.log('singleImmediatePayment response===', response);
      return response;
    } catch (error) {
      console.log('singleImmediatePayment error===', error);
      return undefined;
    }
  }
}
