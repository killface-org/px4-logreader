/**
 * This module contains the definition objects for reading from the binary ArduPilot log files.
 *
 */

//These bytes mark the beginning of a log record
module.exports.HEAD_BYTE_1 = 0xA3;
module.exports.HEAD_BYTE_2 = 0x95;


//Message definition that describes other message definitions in the file.
module.exports.FORMAT_STRUCT = {
    type: 128,
    length: 89,
    name: 'FMT',
    format: 'BBnNZ',
    params: 'Type,Length,Name,Format,Params'
};

/*
 Format characters in the format string for binary log messages
 b   : int8_t
 B   : uint8_t
 h   : int16_t
 H   : uint16_t
 i   : int32_t
 I   : uint32_t
 f   : float
 n   : char[4]
 N   : char[16]
 Z   : char[64]
 c   : int16_t * 100
 C   : uint16_t * 100
 e   : int32_t * 100
 E   : uint32_t * 100
 L   : int32_t latitude/longitude
 M   : uint8_t flight mode

 q   : int64_t NodeJS can't quite handle these yet
 Q   : uint64_t NodeJS can't quite handle these yet
 */
module.exports.FORMAT_STRINGS = {
    'b': {
        size: 1,
        func: function (buf) {
            return buf.readInt8(0);
        }
    },
    'B': {
        size: 1,
        func: function (buf) {
            return buf.readUInt8(0);
        }
    },
    'h': {
        size: 2,
        func: function (buf) {
            return buf.readInt16LE(0);
        }
    },
    'H': {
        size: 2,
        func: function (buf) {
            return buf.readUInt16LE(0);
        }
    },
    'i': {
        size: 4,
        func: function (buf) {
            return buf.readInt32LE(0);
        }
    },
    'I': {
        size: 4,
        func: function (buf) {
            return buf.readUInt32LE(0);
        }
    },
    'f': {
        size: 4,
        func: function (buf) {
            return buf.readFloatLE(0);
        }
    },
    'n': {
        size: 4,
        func: function (buf) {
            return buf.toString().toString().replace(/\u0000/gi, '').trim();
        }
    },
    'N': {
        size: 16,
        func: function (buf) {
            return buf.toString().toString().replace(/\u0000/gi, '').trim();
        }
    },
    'Z': {
        size: 64,
        func: function (buf) {
            return buf.toString().toString().replace(/\u0000/gi, '').trim();
        }
    },
    'c': {
        size: 2,
        func: function (buf) {
            return buf.readInt16LE(0) * 100;
        }
    },
    'C': {
        size: 2,
        func: function (buf) {
            return buf.readUInt16LE(0) * 100;
        }
    },
    'e': {
        size: 4,
        func: function (buf) {
            return buf.readInt32LE(0) * 100;
        }
    },
    'E': {
        size: 4,
        func: function (buf) {
            return buf.readUInt32LE(0) * 100;
        }
    },
    'L': {
        size: 4,
        func: function (buf) {
            return buf.readInt32LE(0) / 10000000.00;
        }
    },
    'M': {
        size: 1,
        func: function (buf) {
            return buf.readUInt8(0);
        }
    },
    'q': {
        size: 8,
        func: function (buf) {
            return NaN;
        }
    },
    'Q': {
        size: 8,
        func: function (buf) {
            return NaN;
        }
    }
};