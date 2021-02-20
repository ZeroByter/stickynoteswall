exports.validateNoteName = name => {
    return name.substr(0, 14)
}

exports.validateNoteMessage = message => {
    return message.substr(0, 48)
}