import API from '../API';
import {getStoredData} from './store';
import {MANGOPAY} from '../API/urls';
import TrueLayer from './TrueLayer';
import {getRandomString} from './Globals';

export default class Mangopay {
  static async registerCard(cardDetails) {
    let status = true;
    let msg = '';
    let cardId = undefined;
    let customer_id = JSON.parse(await getStoredData(Globals.kUserData))
      .customer_id;

    let cardRequest = {
      UserId: customer_id,
      Currency: 'GBP',
    };
    let CardRegUrl = MANGOPAY.URL + 'CardRegistrations';
    try {
      let cardInfo = await API.registerCardMangopay(CardRegUrl, cardRequest);

      let card = {
        data: cardInfo.PreregistrationData,
        accessKeyRef: cardInfo.AccessKey,
        cardNumber: cardDetails.number.replace(/ /g, ''),
        cardExpirationDate: cardDetails.expiry.replace('/', ''),
        cardCvx: cardDetails.cvc,
        returnURL: '',
      };
      //console.log('Mangopay update card request======>', card)
      try {
        let cardToken = await API.getCardToken(
          cardInfo.CardRegistrationURL,
          card,
        );

        if (cardToken.includes('data')) {
          let tokenRequest = {
            RegistrationData: cardToken.toString(),
          };
          try {
            let cardUrl = `${MANGOPAY.URL}cardregistrations/${cardInfo.Id}`;
            let updateCard = await API.updateCard(cardUrl, tokenRequest);
            console.log('Mangopay update card response======>', updateCard);
            if (updateCard.hasOwnProperty('Id')) {
              cardId = updateCard.CardId;
            } else {
              status = false;
              msg = 'Error while getting card Id';
            }
          } catch (error) {
            console.log('Mangopay updateCard error======>', error);
            status = false;
            msg = 'Error while getting token for card';
          }
        } else {
          status = false;
          msg = this.getCardError(cardToken);
        }
      } catch (error) {
        console.log('Mangopay getCardToken error======>', error);
        status = false;
        msg = 'Error while getting token for card';
      }
    } catch (error) {
      console.log('Mangopay registerCardMangopay error======>', error);
      status = false;
      msg = 'Error while register a card';
    }

    return {
      status,
      msg,
      cardId,
    };
  }

  static async getCardsOfUser() {
    let card = [];
    let customer_id = JSON.parse(await getStoredData(Globals.kUserData))
      .customer_id;
    try {
      let cardUrl = `${MANGOPAY.URL}/users/${customer_id}/cards/`;
      let cards = await API.getCard(cardUrl);
      console.log('Mangopay cards response======>', cards);
      card = cards;
    } catch (error) {
      console.log('Mangopay cards error======>', error);
      status = false;
      msg = 'Error while getting card';
    }
    return card;
  }

  static async getBankAccountOfUser() {
    let bankAccounts = [];
    let user = JSON.parse(await getStoredData(Globals.kUserData));
    let mandate_id = user.mandate_id ? user.mandate_id : undefined;
    try {
      let Url = `${MANGOPAY.URL}/users/${user.customer_id}/bankaccounts/`;
      let bankAccount = await API.getBankAccount(Url);
      console.log('Mangopay bankAccount response======>', bankAccount);
      bankAccounts = bankAccount;
    } catch (error) {
      console.log('Mangopay bankAccount error======>', error);
      status = false;
      msg = 'Error while getting bankAccount';
    }
    return {
      bankAccounts,
      mandate_id,
    };
  }

  getCardError(cardToken) {
    if (cardToken.includes('09101')) {
      return 'Username/Password is incorrect';
    } else {
      return 'maximum trial complete';
    }
    //handle all errors from mangopay
  }

  static async banking(amount, benificiary) {

    console.log("-------- THIS IS CALLED ---------");

    let banking_url = undefined;
    let token = await TrueLayer.generateTrueLayerToken();
    let authToken = `${token.token_type} ${token.access_token}`;
    if (authToken) {
      let param = {
        amount: amount * 100,
        currency: 'GBP',
        beneficiary_name: benificiary.name,
        beneficiary_reference: benificiary.reference,
        beneficiary_sort_code: benificiary.sort_code,
        beneficiary_account_number: benificiary.account_number,
        remitter_reference: getRandomString(8),
        redirect_uri: 'https://staging-pongopay.herokuapp.com/mandateconfirm',
        webhook_uri:
          'https://api-pongopay.herokuapp.com/api/v1/truelayer/webhook',
      };
      let payment = await TrueLayer.singleImmediatePayment(param, authToken);
      if (payment && payment.results.length > 0) {
        banking_url = payment.results[0].auth_uri;
      }
    }
    return banking_url;
  }
}
