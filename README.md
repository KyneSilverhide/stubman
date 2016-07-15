# stubman
**This is a fork of the initial stubman project by Dorzey : https://github.com/dorzey/stubman**

Turns a Postman collection into a stub server. *WARNING* This is a work in progress; use at your own risk.

The only supported functionality is binding the path to either PUT/GET/DELETE/POST method and returning 200. More to follow.

The aim to to be able to take any Postman collection, generate a stub server from that collection, use that collection to run tests against the stub and get them to pass.

## Getting Started
Clone this GIT repository
```bash
$ git clone https://github.com/KyneSilverhide/stubman.git
```
Open new folder
```bash
$ cd stubman
```

Install Node dependencies
```bash
$ npm install
```

Run Stubman with a collection. With the `-c` flag you can run any collection file lying on your file-system. Refer [the collection documentation](http://www.getpostman.com/docs/collections) to learn how to use and download collections.

```bash
$ bin/stubman.js -c mycollection.json
```


## Release History / New features
* Supports additional parameters in the resources (?token=....&appId=...) by removing them from the final published URL
* Supports two hardcoded environment variables : {{ip}} and {{port}}
* Improved some tracing and logging
* Prevent crash with empty collection
* Ignore collections with no saved response

## License
Copyright (c) 2016 Aurélien Lansmanne
Licensed under the MIT license.
