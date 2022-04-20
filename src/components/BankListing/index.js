import React, {useEffect, useState} from 'react';
import {View, Modal, Image, FlatList, TouchableOpacity} from 'react-native';
import Color from '../../utils/color';
import {height, width} from '../../utils/dimensions';
import Label from '../Label';
import axios from 'axios';
import {SvgCssUri} from 'react-native-svg';

const BankListing = props => {
  let {show, onHide, onSelect, msg} = props;

  const [listing, setListing] = useState([]);

  useEffect(() => {
    async function fetchBank() {
      const res = await axios.get(
        'https://auth.truelayer.com/api/providers?clientId=pongopay-9dbb4b',
      );
      if (res.length > 0) {
        let final = res.filter(item => {
          return item.scopes.includes('direct_debits');
        });

        setListing(final);
        // console.log('====================================');
        // console.log(final);
        // console.log('====================================');
      }
    }

    fetchBank();
  }, [show]);

  return (
    <Modal animationType="none" transparent={true} visible={show}>
      <View
        activeOpacity={1}
        // onPress={() => onHide()}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Color.ModalBG,
        }}>
        <View
          style={{
            backgroundColor: Color.WHITE,
            width: 232,
            height: height - 100,
            width: width,
            borderTopEndRadius: 10,
            borderTopLeftRadius: 10,
            marginTop: 100,
          }}>
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: Color.WhiteGrey,
              alignItems: 'center',
            }}>
            <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
              {msg}
            </Label>
          </View>

          <FlatList
            data={listing}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  key={index.toString()}
                  onPress={() => {
                    props.onBankClick(item);
                  }}
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: Color.WhiteGrey,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {/* <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: 'center',
                      marginRight: 15,
                    }}
                    source={{uri: item.logo_url}}
                  /> */}
                  <View
                    style={{
                      width: 80,
                      height: 40,
                      marginRight: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <SvgCssUri width={60} height={20} uri={item.logo_url} />
                  </View>
                  <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey}>
                    {item.display_name}
                  </Label>
                </TouchableOpacity>
              );
            }}
          />
          {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => {
                // onHide()
                onConfirm();
              }}
              style={{
                width: '50%',
                paddingBottom: 16,
                paddingTop: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Label fontSize_14 Montserrat_Regular color={Color.LightBlue}>
                Yes
              </Label>
            </TouchableOpacity>
            <View
              style={{
                height: '100%',
                width: 1,
                backgroundColor: Color.WhiteGrey,
              }}
            />
            <TouchableOpacity
              onPress={onHide}
              style={{
                width: '50%',
                paddingBottom: 16,
                paddingTop: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Label fontSize_14 Montserrat_Regular color={Color.LightBlue}>
                No
              </Label>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </Modal>
  );
};

export default BankListing;
