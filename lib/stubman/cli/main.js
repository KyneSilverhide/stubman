/*
 * stubman
 * http://stubman.dorzey.net
 *
 * Copyright (c) 2014 Paul Doran
 * Licensed under the MIT license.
 */

var Main = function () {

    var program = require('commander');
    var Runtime = require('../../stubman').Server.Runtime();
    var Helpers = require('../../stubman').Server.Helpers();

    var self = {};

    self._parseArguments = function () {
        program
            .version('0.0.2')
            .option('-c, --collection [file]', 'Specify a Postman collection as a JSON [file]')
            .parse(process.argv);
    };

    self.start = function () {
        self._parseArguments();

        if (!program.collection) {
            console.log("Missing parameter '-c' '--collection' [file]")
        } else {
            var collectionData = Helpers.parseCollection(process.cwd() + "/" + program.collection);
            if (collectionData) {
                var requestsGroupedByUrl = Helpers.groupRequestsByUrl(collectionData);
                Runtime.buildServer(requestsGroupedByUrl);
            }
        }
    };

    return self;
};

module.exports = Main;

