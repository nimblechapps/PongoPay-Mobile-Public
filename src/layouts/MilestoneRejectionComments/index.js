/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, FlatList } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color';
import HeaderTitle from '../../components/Header/HeaderTitle';
import KMButton from '../../components/KMButton';
import GlobalStyles from '../../utils/GlobalStyles';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import pongopayFontConfige from '../../../selection.json';
const Icon = createIconSetFromIcoMoon(pongopayFontConfige);
const DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9];
import moment from 'moment';

import API from '../../API';
import ProgressHud from '../../components/ProgressHud';

export default class MilestoneRejectionComments extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={'Further Action Requested'} />,
    };
  };

  constructor(props) {
    super(props);
    const { params = {} } = props.navigation.state;
    this.state = {
      milestoneDetails: params.milestoneDetails,
      rejectionComments: [],
    };
  }

  async componentDidMount() {
    let { milestoneDetails } = this.state;
    this.setState({ isLoading: true });
    try {
      let request = {
        milestoneId: milestoneDetails._id,
      };

      //5e5ca10d9f640a10e3eb5436
      console.log('param', request);
      let response = await API.getAllRejectCommentRequest(request);
      this.setState({ isLoading: false });
      console.log('getAllRejectCommentRequest response', response);
      if (response.status) {
        this.setState({
          rejectionComments: response.data,
        });
      }
    } catch (error) {
      console.log('getAllRejectCommentRequest error', error.message);
      this.setState({ isLoading: false });
    }
  }

  renderListing({ item }) {
    console.log("Item===>", item.dRequestDate)
    return (
      <View
        style={{
          paddingRight: 16,
          paddingLeft: 16,
          paddingTop: 24,
          paddingBottom: 24,
          borderBottomWidth: 1,
          borderBottomColor: Color.WhiteGrey,
        }}>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
            Request Payment:
          </Label>
          <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>
            {item.dRequestDate
              ? moment(item.dRequestDate).format('DD-MM-YYYY')
              : '--'}
          </Label>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
            Payment Rejected:
          </Label>
          <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>
            {item.dRejectDate
              ? moment(item.dRejectDate).format('DD-MM-YYYY')
              : '--'}
          </Label>
        </View>
        <View>
          <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
            Comments:
          </Label>
          <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} mt={5}>
            {item.sComment}
          </Label>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={[styles.safeVStyle, this.state.rejectionComments.length == 0 && { justifyContent: "center", alignItems: "center" }]}>
          {this.state.rejectionComments.length > 0 ? <KeyboardAwareScrollView>
            <FlatList
              data={this.state.rejectionComments}
              renderItem={item => this.renderListing(item)}
            />
          </KeyboardAwareScrollView>
            : <Label Montserrat_Medium style={{ alignItems: "center", marginTop: 12, fontSize: 16, color: Color.BLACK }}>No further action to be taken found</Label>}
        </SafeAreaView>
        {this.state.isLoading && <ProgressHud />}
      </View >
    );
  }
}
