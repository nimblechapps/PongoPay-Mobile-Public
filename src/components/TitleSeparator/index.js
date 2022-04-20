import React, { useState } from 'react'
import { Text, View } from 'react-native'
import styles from './styles';

const TitleSeparator = props => {
    return (
        <View style={styles.separator}>
            <View style={styles.line}></View>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.line}></View>
        </View>

    )
}

TitleSeparator.defaultProps = {
}

export default TitleSeparator
