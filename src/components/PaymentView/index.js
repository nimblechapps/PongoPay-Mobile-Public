import React, { Component } from 'react';
import { View, Modal, Image, Text, Platform, TouchableOpacity, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

import Color from '../../utils/color';
import styles from './styles';
import KMButton from '../KMButton';
import {
  isValidValue,
  getBankAccountFromIBAN,
  getSortcodeFromIBAN,
  hasNotchScreen,
} from '../../utils/Globals';
import ProgressHud from '../ProgressHud';
import PaymentDetailModal from '../PaymentDetailModal';

const PaymentStatus = {
  processing: 0,
  success: 1,
  failed: 2,
};

class PaymentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasNotchScreen: hasNotchScreen(),
      injectScript: '',
    };
  }

  _onNavigationStateChange(webViewState) {
    if (webViewState.url.includes('pongopay')) {
      this.setState({
        injectScript: `(function() {
                    window.postMessage = function(data) {
                        window.ReactNativeWebView.postMessage(data);
                    };
                    })()`,
      });

      this.setState({ isLoading: true });
      let truelayerUrl = this.props.openUrl.includes('truelayer');

      console.log('webViewState ===>', webViewState.url);
      console.log('truelayerUrl ===>', truelayerUrl);
      console.log('truelayerUrl ===>', true);
      console.log('truelayerUrl ===>', truelayerUrl === true);

      if (truelayerUrl) {
        console.log('webViewState success ===>', webViewState.url);
        if (webViewState.url.includes('success')) {
          setTimeout(() => {
            this.props.onVerificationSuccess &&
              this.props.onVerificationSuccess();
          }, 5000);
        }
        // else {
        //     setTimeout(() => {
        //         this.props.onVerificationSuccess && this.props.onVerificationSuccess()
        //     }, 5000);
        // }
      } else {
        this.props.onVerificationSuccess && this.props.onVerificationSuccess();
      }
    }
  }

  handleOnShouldStartLoadWithRequestAndroid = event => {
    console.log('handleOnShouldStartLoadWithRequestAndroid ===> ', event.props);
    return true;
  };

  render() {
    let { isLoading } = this.state;
    let {
      bankwireModal,
      openUrl,
      nextMilestone,
      paymentProceesing,
      paymentStatus,
      failedMessage,
      jobTitle,
      escrow,
      onVerificationSuccess,
      onClose,
    } = this.props;
    let image = function () {
      if (paymentStatus === PaymentStatus.success) {
        return require('../../assets/Images/PaymentDone.png');
      } else if (paymentStatus === PaymentStatus.failed) {
        return require('../../assets/Images/paymentFailed.png');
      } else {
        return require('../../assets/Images/PaymentProcessing.png');
      }
    };

    let text = function () {
      if (paymentStatus === PaymentStatus.success) {
        return bankwireModal ? (
          // <View>
          //     <Text style={[styles.payment_txt, styles.payment_txt_bold]}>Deposit Your Payment!</Text>
          //     <Text style={[styles.payment_txt, { marginBottom: 20 }]}>Please deposit<Text style={styles.payment_txt_bold}> £{nextMilestone ?.nMilestoneAmount} </Text>
          //         into bank account number<Text style={styles.payment_txt_bold}> {getBankAccountFromIBAN(nextMilestone ?.payment_escrow_detail ?.bankDetails ?.IBAN)} </Text>
          //         and sort code<Text style={styles.payment_txt_bold}> {getSortcodeFromIBAN(nextMilestone ?.payment_escrow_detail ?.bankDetails ?.IBAN)} </Text>
          //         with reference number<Text style={styles.payment_txt_bold}> {nextMilestone ?.payment_escrow_detail ?.transaction_ref}</Text>
          //     </Text>
          //     <KMButton
          //         fontSize_14 Montserrat_Medium
          //         color={Color.WHITE}
          //         title="OK"
          //         textStyle={{ padding: 0 }}
          //         style={{ backgroundColor: Color.LightBlue, borderRadius: 4, alignItems: 'center', justifyContent: 'center', height: 48, }}
          //         onPress={() => onClose()}
          //     />
          // </View>
          <PaymentDetailModal
            milestoneStatus={nextMilestone?.nMilestoneStatus}
            milestoneAmount={nextMilestone?.nMilestoneAmount}
            paymentDetails={nextMilestone?.payment_escrow_detail}
            show={bankwireModal}
            onClose={() => onClose()}
          />
        ) : (
          <View>
            <Text style={[styles.payment_txt, styles.payment_txt_bold]}>
              Payment Done!
            </Text>
          </View>
        );
      } else if (paymentStatus === PaymentStatus.failed) {
        return (
          <View>
            <Text style={[styles.payment_txt, styles.payment_txt_bold]}>
              Payment Failed!
            </Text>
            <Text style={[styles.payment_txt, { marginTop: 10 }]}>
              {failedMessage}
            </Text>
          </View>
        );
      } else {
        return escrow ? (
          <Text style={styles.payment_txt}>
            You are about to transfer funds to the{'\n'}
            <Text style={styles.payment_txt_bold}>
              PongoPay Safe Deposit Box{'\n'}
            </Text>
            <Text style={styles.payment_txt}>
             {'\n'} This may take a few moments
            </Text>
          </Text>
        ) : (
          <Text style={styles.payment_txt}>
            Release Payment for Payment Stage
            <Text style={styles.payment_txt_bold}> {`${jobTitle}`} </Text> is in
            process
          </Text>
        );
      }
    };

    return (
      <Modal
        animationType="fade"
        visible={paymentProceesing}
        transparent={false}>
        {isValidValue(openUrl) ? (
          <WebView
            style={{
              height: '100%',
              width: '100%',
              marginTop: hasNotchScreen ? 29 : 0,
            }}
            useWebKit={true}
            source={{ uri: openUrl }}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            javaScriptCanOpenWindowsAutomatically={true}
            startInLoadingState={true}
            mixedContentMode={'compatibility'}
            injectedJavaScript={this.state.injectScript}
            renderLoading={() => {
              return isLoading ? <ProgressHud /> : null;
            }}
            onLoadStart={this._onLoadStart.bind(this)}
            onLoadEnd={this._onLoadEnd.bind(this)}
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            thirdPartyCookiesEnabled={true}
            domStorageEnabled={true}
            // onShouldStartLoadWithRequest={this.handleOnShouldStartLoadWithRequestAndroid}
            onError={event => {
              console.log('onError', event);
            }}
            onHttpError={event => {
              console.log('onHttpError', event);
            }}
            onRenderProcessGone={event => {
              console.log('onRenderProcessGone', event);
            }}
            onMessage={event => {
              if (Platform.OS == 'android') {
                if (event.nativeEvent.data === 'Payment Process Complete') {
                  this.setState({
                    injectScript: '',
                  });
                  setTimeout(() => {
                    this.props.onVerificationSuccess &&
                      this.props.onVerificationSuccess();
                  }, 5000);
                }
              }
            }}
          />
        ) : (
          <SafeAreaView style={styles.payment_main}>
            {/* {!isValidValue(openUrl) && <TouchableOpacity
              onPress={() => {
                this.props.onClose()
              }} style={{ position: "absolute", top: 10, right: 20 }}>
              <Text style={[styles.payment_txt, styles.payment_txt_bold]}>
                close
                </Text>
            </TouchableOpacity>} */}
            <Image source={image()} />
            {text()}
          </SafeAreaView>
        )}
      </Modal>
    );
  }

  _onLoadStart(e) {
    let url = e.nativeEvent.url;
    console.log('_onLoadStart', url);
    this.setState({ isLoading: true });
  }

  _onLoadEnd(e) {
    let url = e.nativeEvent.url;
    console.log('_onLoadEnd', url);
    this.setState({ isLoading: false });
  }
}

PaymentView.defaultProps = {
  escrow: true,
  jobTitle: '',
  onClose: () => { },
};

export default PaymentView;
