/*
 * stubman
 * http://stubman.dorzey.net
 *
 * Copyright (c) 2014 Paul Doran
 * Licensed under the MIT license.
 */

var Runtime = function () {

    var bodyParser = require('body-parser');
    var express = require('express');
    var Stubman = require('../../stubman');

    var STUBMAN_PORT = 3000;

    var app = express();
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    var self = {};

    self._setHeaders = function (res, headers) {
        headers.forEach(
            function (header) {
                res.set(header.key, header.value);
            }
        );
    };

    self._findMatchingResponse = function (req, responses) {
        var matchingResponse = {};
        var body = JSON.stringify(req.body);
        responses.forEach(
            function (response) {
                if (body === "{}" || body === "[]") {
                    console.log("B");
                    if (response.method === Stubman.Enums.HttpMethods.GET || response.data === "" || response.data.length === 0) {
                        matchingResponse = response.responses[0];
                    }
                } else {
                    if (response.data === body) {
                        matchingResponse = response.responses[0];
                    }
                }
            }
        );
        return matchingResponse;
    };

    self._configureGetResponse = function (responses, url) {
        var getResponses = responses;
        app.get(url, function (req, res) {
            var response = self._findMatchingResponse(req, getResponses);
            console.log("Responding to URL " + url + " with response " + response.name);
            self._setHeaders(res, response.headers);
            res.send(response.responseCode.code, response.text);
        });
    };

    self._configurePutResponses = function (responses, url) {
        var putResponses = responses;
        app.put(url, function (req, res) {
            var response = self._findMatchingResponse(req, putResponses);
            console.log("Responding to URL " + url + " with response " + response.name);
            self._setHeaders(res, response.headers);
            res.send(response.responseCode.code, response.text);
        });
    };

    self._configurePostResponses = function (responses, url) {
        var postResponses = responses;
        app.post(url, function (req, res) {
            var response = self._findMatchingResponse(req, postResponses);
            console.log("Responding to URL " + url + " with response " + response.name);
            self._setHeaders(res, response.headers);
            res.send(response.responseCode.code, response.text);
        });
    };

    self._configureDeleteResponses = function (responses, url) {
        var deleteResponses = responses;
        app.delete(url, function (req, res) {
            var response = self._findMatchingResponse(req, deleteResponses);
            console.log("Responding to URL " + url + " with response " + response.name);
            self._setHeaders(res, response.headers);
            res.send(response.responseCode.code, response.text);
        });
    };

    self._removeParametersFrom = function (url) {
        var firstQuestionMark = url.indexOf('?');
        return firstQuestionMark > 0 ? url.substring(0, firstQuestionMark) : url;
    };

    self.buildServer = function (requestsGroupedByUrl) {
        for (var url in requestsGroupedByUrl) {
            for (var method in requestsGroupedByUrl[url]) {
                var responses = requestsGroupedByUrl[url][method];

                if(responses[0].responses) {
                    console.log("Registering [" + method + "] method with path " + url);
                } else {
                    console.log("** Ignoring [" + method + "] method with path " + url + " because there are no sample response defined");
                }

                var staticURL = self._removeParametersFrom(url);
                switch (method) {
                    case Stubman.Enums.HttpMethods.GET:
                        self._configureGetResponse(responses, staticURL);
                        break;
                    case Stubman.Enums.HttpMethods.PUT:
                        self._configurePutResponses(responses, staticURL);
                        break;
                    case Stubman.Enums.HttpMethods.POST:
                        self._configurePostResponses(responses, staticURL);
                        break;
                    case Stubman.Enums.HttpMethods.DELETE:
                        self._configureDeleteResponses(responses, staticURL);
                        break;

                }
            }
        }
        var server = app.listen(STUBMAN_PORT, function () {
            console.log('Listening on port %d', server.address().port);
        });
    };

    return self;
};

module.exports = Runtime;