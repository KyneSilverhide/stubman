/*
 * stubman
 * http://stubman.dorzey.net
 *
 * Copyright (c) 2014 Paul Doran
 * Licensed under the MIT license.
 */

var Helpers = function () {

    var fs = require('fs');
    var url = require('url');

    var self = {};

    self._addRequestToMethodList = function (requestsGroupedByMethod, request) {
        if (requestsGroupedByMethod[request.method] === undefined) {
            requestsGroupedByMethod[request.method] = [request];
        } else {
            requestsGroupedByMethod[request.method].push(request);
        }
    };

    self.parseCollection = function (path) {
        try {
            var data = fs.readFileSync(path, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            console.log("Unable to open or parse Postman collection at path '" + path + "'");
        }
    };

    self._removeEnvironmentVariables = function (url) {
        return url.replace('{{ip}}', 'localhost').replace('{{port}}', 3000);
    };

    self.groupRequestsByUrl = function (collectionData) {
        var requestsGroupedByUrl = {};
        collectionData.requests.forEach(
            function (request) {
                var postProcessedURL = self._removeEnvironmentVariables(request.url);
                var path = url.parse(postProcessedURL).path;
                if (requestsGroupedByUrl[path] === undefined) {
                    requestsGroupedByUrl[path] = {};
                }
                self._addRequestToMethodList(requestsGroupedByUrl[path], request);
            }
        );
        return requestsGroupedByUrl;
    };


    return self;
};

module.exports = Helpers;