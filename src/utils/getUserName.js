import { isValidValue } from "./Globals";
import LocalImages from "./LocalImages";

export const getUserName = (user) => {
    let userName = "-"
    if (isValidValue(user) && isValidValue(user.sFirstName) && isValidValue(user.sLastName)) {
        userName = user.sFirstName + " " + user.sLastName
    }
    else if (isValidValue(user) && isValidValue(user.sFirstName)) {
        userName = user.sFirstName
    }
    else if (isValidValue(user) && isValidValue(user.sLastName)) {
        userName = user.sLastName
    }
    return userName;
}

export const getUserEmail = (user) => {
    let userEmail = "-"
    if (isValidValue(user) && isValidValue(user.sEmail)) {
        userEmail = user.sEmail
    }
    return userEmail;
}

export const getUserPhoneNo = (user) => {
    let userPhoneNo = "-"
    if (isValidValue(user) && isValidValue(user.nCountryCode) && isValidValue(user.nPhoneNumber)) {
        userPhoneNo = "+"+user.nCountryCode + " "+ user.nPhoneNumber
    }
    else if (isValidValue(user) && isValidValue(user.nPhoneNumber)) {
        userPhoneNo = user.nPhoneNumber
    }
    return userPhoneNo;
}

export const getUserPhoto = (user) => {
    let userPhoto = LocalImages.Client_User
    if (isValidValue(user) && isValidValue(user.sProfilePic)) {
        userPhoto = { uri: user.sProfilePic }
    }
    return userPhoto;
}

