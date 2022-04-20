
import AsyncStorage from '@react-native-community/async-storage';

export async function setStoredData(key, value) {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (error) {
        error
    }
}

export async function getStoredData(key) {
    try {
        return await AsyncStorage.getItem(key)
    } catch (error) {
        return null
    }
}