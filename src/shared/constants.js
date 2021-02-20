exports.maxNameLength = 14
exports.validateNoteName = name => {
    return name.substr(0, this.maxNameLength)
}

exports.maxMessageLength = 64
exports.validateNoteMessage = message => {
    return message.substr(0, this.maxMessageLength)
}