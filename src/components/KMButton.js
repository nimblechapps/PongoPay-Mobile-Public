import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import Color from './../utils/color';
import Label from './../components/Label'
import { fontLarge24, fontLarge22, fontNormal20, fontSmall18, fontXSmall16, fontSmall14, fontSmall12 } from '../utils/theme';
import PropTypes from 'prop-types';

class KMButton extends React.Component {

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

        return (
            <TouchableOpacity disabled={this.props.disabled} onPress={this.props.onPress} style={[styles.buttonStyle, this.props.style]}>
                {this.props.children}
                {this.props.title && <Label color={this.props.color} style={[stylesArray, this.props.textStyle]}>
                    {this.props.title}
                </Label>}
                {this.props.imageBack && <Image
                    style={{ width: 9, height: 8, alignSelf: 'center' }}
                    source={this.props.imageBack} />}
            </TouchableOpacity>
        );
    }
}


KMButton.defaultProps = {
    fontSize_24: false,
    fontSize_22: false,
    fontSize_20: false,
    fontSize_18: false,
    fontSize_16: false,
    fontSize_14: false,
    fontSize_12: false,
    Montserrat_Black: false,
    Montserrat_Bold: false,
    Montserrat_Light: false,
    Montserrat_Medium: false,
    Montserrat_SemiBold: false,
    Montserrat_Regular: false,
};

KMButton.propTypes = {
    fontSize_24: PropTypes.bool,
    fontSize_22: PropTypes.bool,
    fontSize_20: PropTypes.bool,
    fontSize_18: PropTypes.bool,
    fontSize_16: PropTypes.bool,
    fontSize_14: PropTypes.bool,
    fontSize_12: PropTypes.bool,
    Montserrat_Black: PropTypes.bool,
    Montserrat_Bold: PropTypes.bool,
    Montserrat_Light: PropTypes.bool,
    Montserrat_Medium: PropTypes.bool,
    Montserrat_SemiBold: PropTypes.bool,
    Montserrat_Regular: PropTypes.bool,
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: Color.GREEN_DARK,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default KMButton;
