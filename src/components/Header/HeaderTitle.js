
import React from 'react';
import { View } from "react-native";
import Label from '../Label.js';
import GlobalStyles from '../../utils/GlobalStyles.js';

class HeaderTitle extends React.Component {
    render() {
        const { title } = this.props;
        return (
            <View style={GlobalStyles.headerTitleViewStyle}>
                <Label
                    fontSize_20
                    Montserrat_Light
                    color={Color.BLACK}>
                    {title}
                </Label>
            </View>
        );
    }
}

export default HeaderTitle;