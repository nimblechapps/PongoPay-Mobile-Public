
import React from 'react';
import { TouchableOpacity } from "react-native";
import GlobalStyles from '../../utils/GlobalStyles.js';
import Label from '../Label.js';
import color from '../../utils/color.js';
import CustomIcon from "../CustomIcon";

const HeaderRight = ({ onPress, iconName, iconStyle, buttonTitle, disable, buttonColor, buttonStyle }) => (
    <TouchableOpacity
        disabled={disable}
        style={GlobalStyles.viewRightStyle}
        onPress={onPress}>
        {
            (iconName || !buttonTitle) ?
                <CustomIcon name={iconName} style={[GlobalStyles.iconRightStyle, iconStyle]} />
                :
                <Label
                    fontSize_16
                    Montserrat_Medium
                    color={[color.LightBlue, buttonColor]}
                    style={buttonStyle} >
                    {buttonTitle}
                </Label>
        }

    </TouchableOpacity>
);

HeaderRight.defaultProps = {
    disable: false
}

export default HeaderRight