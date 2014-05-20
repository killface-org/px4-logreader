/*
 This module contains common functions for working with the ArduPilot log files.

 */

var DEFS = require('./apm-defs.js');

/**
 * Extracts the values from the buffer using the types defined in FORMAT_STRINGS
 * @param valBuf The buffer to extract the values from (excluding the header bytes)
 * @param fmtStr The format string to use to parse the values (i.e. 'BBnNZ')
 * @returns {Array} The values extracted from the buffer pushed to an array.
 */
function extractValues(valBuf, fmtStr) {
    var result = [];
    var pos = 0;

    for (var i = 0; i < fmtStr.length; i++) {
        var fmtVal = fmtStr[i];
        var fmtDef = DEFS.FORMAT_STRINGS[fmtVal];
        var tmpBuf = valBuf.slice(pos, fmtDef.size + pos);
        pos = pos + fmtDef.size;
        result.push(fmtDef.func(tmpBuf));
    }

    return result;
}

/**
 * Simple function to build an object from a params and values.
 * @param paramNames Parameter names to map the values from using a comma as the separator (i.e. 'Type,Name,Etc')
 * @param paramValues And array of values to map to the corresponding parameter names (i.e. ['1,'FMT',1.2])
 * @returns {{}} A json object with the params mapped to attributes (attribute names are lower cased)
 */
function buildMessageObject(paramNames, paramValues) {
    var result = {};
    var names = paramNames.split(',');

    for (var i = 0; i < names.length; i++) {
        result[names[i].toLowerCase()] = paramValues[i];
    }

    return result;
}

/**
 * Searches and extracts the messages from a buffer using the message structure definition
 * @param fileBuf The file buffer to extract from
 * @param msgDef The message definition to use
 * @returns {Array} An array of json objects (one for each message)
 */
function extractMessages(fileBuf, msgDef) {
    var results = [];
    for (var i = 0; i < fileBuf.length; i++) {
        if (
            (fileBuf[i] === DEFS.HEAD_BYTE_1) &&
            (fileBuf[i + 1] === DEFS.HEAD_BYTE_2) &&
            (fileBuf[i + 2] === msgDef.type)
            ) {

            var tmpBuf = fileBuf.slice(i, i + msgDef.length);
            var tmpBufValues = extractValues(tmpBuf.slice(3), msgDef.format);
            var msg = buildMessageObject(msgDef.params, tmpBufValues);
            results.push(msg);
        }
    }
    return results;
}

/**
 * Extracts the message type from a buffer, uses the built in FORMAT_STRUCT message def
 * @param fileBuf The file buffer to extract from
 * @returns {*} A JSON object with attributes using the generic message name, that contains the message structure definition.
 */
function extractMessageTypes(fileBuf) {
    var result = {};
    var msgTypes = extractMessages(fileBuf, DEFS.FORMAT_STRUCT);

    for (var i = 0; i < msgTypes.length; i++) {
        var itemResult = msgTypes[i];
        result[itemResult.name] = itemResult;
    }

    return result;
}

module.exports.extractMessages = extractMessages;
module.exports.extractMessageTypes = extractMessageTypes;
