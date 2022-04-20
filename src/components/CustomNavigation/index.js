import React, { Component } from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import Color from '../../utils/color'
import Label from '../Label';
import { fontLarge24 } from '../../utils/theme';
import styles from "./styles"
import Globals from "./../../utils/Globals"
import CustomIcon from "../CustomIcon";
import { isIphoneX } from './../../utils/isIphone-x'

const HEADER_SIZE = isIphoneX() ? 100 : 70;

class CustomNavigation extends Component {

    componentDidMount() {
        console.log("*** Component Did Mount ***");
    }

    render() {
        const { navigate } = this.props.navigation;
        // console.log("navigationSubTitle", this.props.navigationSubTitle);
        return (
            <SafeAreaView forceInset={{ top: 'always' }} style={[styles.containerStyle, { height: (Globals.isIpad ? 80 : HEADER_SIZE) }]}>
                <View style={styles.navigationInsideStyle}>
                    <View style={{ height: (Globals.isIpad ? 45 : 35), justifyContent: "center", }}>
                        <TouchableOpacity onPress={() => navigate('SidebarMenu')} style={{ alignItems: "center" }}>
                            <CustomIcon name={"burger_menu"} style={{ color: Color.BLACK, fontSize: fontLarge24, alignSelf: "center" }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: "center", }}>
                        <Label singleLine={true} color={Color.BLACK} fontSize_16 Montserrat_Medium >{this.props.navigationTitle}</Label>
                    </View>

                    <View style={{ height: (Globals.isIpad ? 50 : 40) }}>
                        {this.props.isEdit &&
                            <TouchableOpacity
                                onPress={this.props.onPress}
                                style={{
                                    height: (Globals.isIpad ? 50 : 40),
                                    justifyContent: "center"
                                }} >
                                <Label singleLine={true} fontSize_16 Montserrat_Medium color={Color.LightBlue}>Edit</Label>
                            </TouchableOpacity>
                        }
                        {this.props.isCancel &&
                            <TouchableOpacity
                                onPress={this.props.onPress}
                                style={{
                                    height: (Globals.isIpad ? 50 : 40),
                                    justifyContent: "center",
                                }}>
                                <Label singleLine={true} fontSize_16 Montserrat_Medium color={Color.LightBlue}>Cancel</Label>
                            </TouchableOpacity>
                        }
                        {this.props.isFilter &&
                            <TouchableOpacity
                                style={{
                                    height: (Globals.isIpad ? 50 : 40),
                                    justifyContent: "center"
                                }}
                                onPress={this.props.onPress}>
                                <CustomIcon name={"mobile_filter"} style={{ color: Color.LightBlue, fontSize: fontLarge24, alignSelf: "center" }} />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                {this.props.children}
            </SafeAreaView>
        );
    }
}

CustomNavigation.defaultProps = {
    notification: true,
    isEdit: false,
    isFilter: false,
    isCancel: false
}

export default CustomNavigation;
