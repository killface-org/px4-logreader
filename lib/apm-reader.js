var fs = require('fs');
var apm = require('./apm-funcs.js');

function readTypesFromFile(fileName) {
    var fileBuf = fs.readFileSync(fileName);
    return apm.extractMessageTypes(fileBuf);
}

function readMessagesFromFile(fileName, msgFormat) {
    var fileBuf = fs.readFileSync(fileName);
    var msgTypes = apm.extractMessageTypes(fileBuf);
    if (msgTypes[msgFormat] !== undefined) {
        return apm.extractMessages(fileBuf, msgTypes[msgFormat]);
    } else {
        return null;
    }
}

module.exports.readTypesFromFile = readTypesFromFile;
module.exports.readMessagesFromFile = readMessagesFromFile;
