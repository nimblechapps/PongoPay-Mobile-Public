
import React from 'react';
import { Text } from 'react-native';
import Color from '../utils/color';
import { fontLarge24, fontLarge22, fontNormal20, fontSmall18, fontXSmall16, fontSmall14, fontSmall12 } from '../utils/theme';
import PropTypes from 'prop-types';

class Label extends React.Component {

    onClick = () => {
        if (this.props.onPress)
            this.props.onPress();
    };

    render() {
        let stylesArray = [];
        if (this.props.fontSize_24)
            stylesArray.push({ fontSize: fontLarge24 });
        else if (this.props.fontSize_22)
            stylesArray.push({ fontSize: fontLarge22 });
        else if (this.props.fontSize_20)
            stylesArray.push({ fontSize: fontNormal20 });
        else if (this.props.fontSize_18)
            stylesArray.push({ fontSize: fontSmall18 });
        else if (this.props.fontSize_16)
            stylesArray.push({ fontSize: fontXSmall16 });
        else if (this.props.fontSize_14)
            stylesArray.push({ fontSize: fontSmall14 });
        else if (this.props.fontSize_12)
            stylesArray.push({ fontSize: fontSmall12 });
        else
            stylesArray.push({ fontSize: fontSmall14 });


        if (this.props.Montserrat_Black)
            stylesArray.push({ fontFamily: "Montserrat-Black" });
        else if (this.props.Montserrat_Bold)
            stylesArray.push({ fontFamily: "Montserrat-Bold" });
        else if (this.props.Montserrat_Light)
            stylesArray.push({ fontFamily: "Montserrat-Light" });
        else if (this.props.Montserrat_Medium)
            stylesArray.push({ fontFamily: "Montserrat-Medium" });
        else if (this.props.Montserrat_SemiBold)
            stylesArray.push({ fontFamily: "Montserrat-SemiBold" });
        else if (this.props.Montserrat_Regular)
            stylesArray.push({ fontFamily: "Montserrat-Regular" });
        else
            stylesArray.push({ fontFamily: "Montserrat-Regular" });


        if (this.props.weight500)
            stylesArray.push({ fontWeight: "500" });
        else if (this.props.weight400)
            stylesArray.push({ fontWeight: "400" });
        if (this.props.weight300)
            stylesArray.push({ fontWeight: "300" });
        else if (this.props.normal)
            stylesArray.push({ fontWeight: "normal" });

        if (this.props.uppercase) {
            stylesArray.push({ textTransform: 'uppercase' });
        }

        stylesArray.push({
            color: this.props.color,
            marginTop: this.props.mt,
            marginBottom: this.props.mb,
            marginLeft: this.props.ml,
            marginRight: this.props.mr,
            textAlign: this.props.align,
            textDecorationLine: this.props.textDecorationLine
        });

        stylesArray.push(this.props.style);


        return (
            <Text
                numberOfLines={this.props.singleLine ? 1 : this.props.numberOfLines}
                style={stylesArray}
                onPress={this.props.onPress ? this.onClick : null}
                ellipsizeMode={this.props.ellipsizeMode}>
                {this.props.children}
            </Text>
        );
    }
}

Label.defaultProps = {
    fontSize_24: false,
    fontSize_22: false,
    fontSize_20: false,
    fontSize_18: false,
    fontSize_16: false,
    fontSize_14: false,
    fontSize_12: false,
    bold: false,
    bolder: false,
    lighter: false,
    light: false,
    singleLine: false,
    color: Color.GREY_DARK,
    Montserrat_Black: false,
    Montserrat_Bold: false,
    Montserrat_Light: false,
    Montserrat_Medium: false,
    Montserrat_SemiBold: false,
    Montserrat_Regular: false,
    mt: 0,
    mb: 0,
    ml: 0,
    mr: 0,
    textDecorationLine: 'none',
    style: {}
};

Label.propTypes = {
    fontSize_24: PropTypes.bool,
    fontSize_22: PropTypes.bool,
    fontSize_20: PropTypes.bool,
    fontSize_18: PropTypes.bool,
    fontSize_16: PropTypes.bool,
    fontSize_14: PropTypes.bool,
    fontSize_12: PropTypes.bool,
    bold: PropTypes.bool,
    bolder: PropTypes.bool,
    light: PropTypes.bool,
    lighter: PropTypes.bool,
    color: PropTypes.string,
    Montserrat_Black: PropTypes.bool,
    Montserrat_Bold: PropTypes.bool,
    Montserrat_Light: PropTypes.bool,
    Montserrat_Medium: PropTypes.bool,
    Montserrat_SemiBold: PropTypes.bool,
    Montserrat_Regular: PropTypes.bool,
    singleLine: PropTypes.bool,
    mt: PropTypes.number,
    mb: PropTypes.number,
    ml: PropTypes.number,
    mr: PropTypes.number,
    align: PropTypes.string,
    style: PropTypes.object
};

export default Label;
