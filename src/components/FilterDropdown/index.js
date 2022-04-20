
import React, {Component} from 'react';
import {View, Modal, TouchableOpacity, Image, Dimensions} from 'react-native';
import Color from '../../utils/color'
import {fontXSmall16, fontSmall14} from '../../utils/theme';
import KMButton from '../../components/KMButton';
import Globals, {JobStatus, contains, findIndex} from "../../utils/Globals";
import styles from "./styles"
import CheckBox from "react-native-check-box";
import CustomIcon from "../CustomIcon";
import {getJobStatus} from '../../utils/GetUserStatus';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ScrollView} from 'react-native-gesture-handler';
const images = {
    TriangleImage: require('./../../../src/assets/Images/Triangle_Withshadow.png')
}
class FilterDropdown extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isOnGoing: false,
            isPending: false,
            isAccepted: false,
            isRejected: false,
            isOpenDispute: false,
            isResolvedDispute: false,
            selectedStatus: []
        };
    }

    onStatusChanged = (status) => {
        let statusArr = this.state.selectedStatus
        if (contains(statusArr, status)) {
            statusArr.splice(findIndex(statusArr, status), 1)
        } else {
            statusArr.push(status)
        }
        this.setState({
            selectedStatus: statusArr
        })
    }

    render() {
        const {selectedStatus} = this.state;
        const {visible, onClosePress, valuesArray, onApplyPress} = this.props;

        return (
            <Modal
                animationType="none"
                visible={visible}
                transparent={true}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{height: "100%", width: "100%", zIndex: -11111, position: "absolute"}}
                    onPress={onClosePress} />

                <View style={Globals.isBuilder ? styles.buliderFilter : styles.filterBox} >
                    <Image source={images.TriangleImage} style={styles.filterTriggle} />
                    <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: 80}}>
                        <View style={{marginTop: 16, marginBottom: 16, }}>
                            <View style={{}}>
                                {
                                    valuesArray.map((value, index) => {
                                        return <CheckBox
                                            style={styles.checkboxMain}
                                            onClick={() => this.onStatusChanged(value.status)}
                                            checkedImage={<CustomIcon name="checked-box" style={styles.checkIcon} />}
                                            unCheckedImage={<CustomIcon name="unchecked-box" style={styles.checkIcon} />}
                                            isChecked={contains(selectedStatus, index)}
                                            rightText={value.title}
                                            rightTextStyle={{color: Color.black, fontFamily: "Montserrat-Regular", fontSize: fontSmall14, lineHeight: 24, paddingLeft: 15}}
                                        />
                                    })
                                }
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 70, }}>
                                <KMButton
                                    title="Apply"
                                    style={styles.button}
                                    textStyle={{color: Color.WHITE, fontSize: fontXSmall16, fontFamily: 'Montserrat-Medium'}}
                                    onPress={() => onApplyPress(selectedStatus)}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </Modal >
        );
    }
}

FilterDropdown.defaultProps = {
    notification: true
}

export default FilterDropdown;
