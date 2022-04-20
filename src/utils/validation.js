
// Email Validation
export const validateEmail = (email) => {
    let regex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
    return email.match(regex);
}

// Name Validation
export const validateCharacter = (name) => {
    var regex = /^[a-zA-Z0-9 ]+$/
    return regex.test(name)
}

// new Name Validation
export const validateName = (name) => {
    var regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð `'-]+$/
    return regex.test(name)
}

// Phone Validation
export const validatePhone = (phone) => {
    let regex = /^(\+\d{1,3}[- ]?)?\d{10,13}$/
    let length = phone.length <= 13
    return regex.test(phone) && length
}
export const validateDecimal = (amount) => {
    let regex = /^(\d*\.)?\d+$/

    // let length = amount.length <= 0
    return regex.test(amount) && amount > 0
}

export const validateAccountNumber = (account) => {
    var regex = /^[a-zA-Z0-9]+$/
    let length = account.length <= 16
    return regex.test(account) && length
}

// sort code
export const validateSortcode = (sort) => {
    var regex = /^[0-9]+$/
    let length = sort.length <= 6
    return regex.test(sort) && length
}
// postal code
export const validatePostalcode = (postal) => {
    var regex = /^[a-zA-Z0-9_ ]+$/
    let length = postal.length <= 8
    return regex.test(postal) && length
}
// Phone Validation
export const validateOtp = (otp) => {
    var regex = /^[0-9]+$/
    let length = otp.length == 6
    return regex.test(otp) && length
}