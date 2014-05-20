#! /usr/bin/env node
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2), {boolean: ['l', 'c', 'j']});
var LogReader = require('./lib/apm-reader.js');


//This seems over complicated....
if (argv._.length === 1 && fs.existsSync(argv._[0])) {
    if (argv['l'] === true) {
        listMessageTypes();
    }
    else if (argv['t'] !== undefined) {
        if (argv['j']) {
            outputJSON();
        } else {
            outputCSV();
        }
    } else {
        showHelp();
    }
} else {
    if (argv._.length === 0) {
        showHelp();
    } else {
        console.log('File does not exist:%s', argv._[0]);
    }
}

function showHelp() {
    console.log('Usage: px4-logreader %filename%');
    console.log('Options:');
    console.log('   -l  list format types');
    console.log('   -c  output CSV (default');
    console.log('   -j  output json');
    console.log('   -t  type to extract (i.e. IMS,CURR');
}

function listMessageTypes() {
    var msgFormats = LogReader.readTypesFromFile(argv._[0]);
    var keys = Object.keys(msgFormats);
    for (var i = 0; i < keys.length; i++) {
        console.log('%s: %s', keys[i], msgFormats[keys[i]].params);

    }
}

function outputJSON() {
    var messages = LogReader.readMessagesFromFile(argv._[0], argv['t']);
    console.log(JSON.stringify(messages, null, '\t'));
}

function outputCSV() {
    var messages = LogReader.readMessagesFromFile(argv._[0], argv['t']);
    var keys = Object.keys(messages[0]);
    console.log(keys.join(','));
    for (var i = 0; i < messages.length; i++) {
        var values = [];
        for (var k = 0; k < keys.length; k++) {
            values.push(messages[i][keys[k]]);

        }
        console.log(values.join(','));
    }
}
