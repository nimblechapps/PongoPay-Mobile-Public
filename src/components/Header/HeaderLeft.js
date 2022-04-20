
import React from 'react';
import { TouchableOpacity } from "react-native";
import GlobalStyles from '../../utils/GlobalStyles';
import CustomIcon from "../CustomIcon";

const HeaderLeft = ({ onPress, iconName, iconStyle }) => (
    <TouchableOpacity
        style={GlobalStyles.viewLeftStyle}
        onPress={onPress}>
        <CustomIcon
            name={iconName}
            style={[GlobalStyles.iconLeftStyle, iconStyle]}
        />
    </TouchableOpacity>
);

export default HeaderLeft