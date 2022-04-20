
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Color from '../../utils/color'
import Label from '../Label';
import { fontXSmall16, fontSmall14 } from './../../utils/theme';
import styles from "./styles";
import CustomIcon from "../CustomIcon";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import countryData from "../../../countries.json";

import { Dropdown } from 'react-native-material-dropdown';

const DropDownCustom = (props) => {

    const [isOpen, setOpen] = useState(props.isOpen);
    const [selected, setSelected] = useState(props.value);
    let { labelTitle, Title, options, onOptionChange, type, disabled, drodDownPropsTxt } = props

    if (type == 'country' || type == 'nationality') {
        options = countryData
    }

    useEffect(() => {
        setSelected(props.value);
    }, [props])

    const getValues = (item) => {
        if (type == 'country') {
            return item.name
        } else if (type == 'nationality') {
            return item.nationality
        } else {
            return item
        }
    }
    return (
        //   <SearchBar placeholder="Search "
        //   boxStyleCustom={{ height: 40, marginBottom: 5, marginTop: 8 }}
        // />
        <View style={styles.mainDrop}>
            {props.isNewTitle ? <Label fontSize_20 Montserrat_Light color={Color.DarkGrey} style={styles.mainLabel}>
                {labelTitle}
            </Label> :
                <Label fontSize_16 Montserrat_Light color={Color.DarkGrey} style={styles.mainLabel}>
                    {labelTitle}
                </Label>}

            <Dropdown
                disabled={disabled}
                label=''
                labelFontSize={25}
                fontSize={fontXSmall16}
                dropdownOffset={{ top: Platform.OS === 'android' ? 97 : 60, left: 15.5 }}
                baseColor={Color.DarkGrey}
                pickerStyle={{ width: '92%', maxHeight: 120, borderColor: 'transparent', borderWidth: 1, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 0 }}
                itemTextStyle={{ fontSize: fontSmall14, fontFamily: "Montserrat-Regular" }}
                selectedItemColor={Color.DarkGrey}
                itemColor={Color.DarkGrey}
                rippleOpacity={-0}
                data={options}
                containerStyle={[styles.dropDownContainer, props.dropDownPropsContainer]}
                valueExtractor={(item) => getValues(item)}
                renderBase={props => (
                    <View style={styles.dropDownBaseView}>
                        <Text style={[styles.dropDownText, drodDownPropsTxt]}>
                            {selected ? selected : Title}
                        </Text>
                        <View style={styles.dropDownArrow}>
                            <CustomIcon name={"arrowdown"} color={Color.LightGrey} style={{ fontSize: fontXSmall16 }} />
                        </View>
                    </View>
                )}
                onChangeText={(value, index) => {
                    setSelected(value);
                    onOptionChange && onOptionChange(options[index]);
                }}
            />
        </View>

    );

}

DropDownCustom.defaultProps = {
    options: [],
    type: '',
    value: '',
    disabled: false,
    isOpen: false
}



export default DropDownCustom;
