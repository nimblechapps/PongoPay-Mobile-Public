import React from 'react';
import {View, Modal, TouchableOpacity} from 'react-native';
import Color from '../../utils/color';
import Label from '../Label';
// import styles from "./styles";

const ConfirmModal = props => {
  let {show, onHide, onConfirm, msg} = props;
  return (
    <Modal animationType="none" transparent={true} visible={show}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onHide()}
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Color.ModalBG,
        }}>
        <View
          style={{backgroundColor: Color.WHITE, borderRadius: 8, width: 232}}>
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: Color.WhiteGrey,
            }}>
            <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey}>
              {msg}
            </Label>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ConfirmModal;
