# API Store

## TODO
populateDB.js

control content-type
Use express 4.x
test
Makefile
Sonar


## Overview

api-store is a storage API which enables you to run the [RAML API Designer](https://github.com/mulesoft/api-designer) locally (rather than use the APIHub cloud service) and still be able to manage and collaborate on your design.

## Requirements
The service is built with node.js, using express and mongodb.

### Installing Node.js
Go to [nodejs.org](http://nodejs.org), and click the Install button.

### Installing MongoDB
To install MongoDB on your specific platform, refer to the [MongoDB QuickStart](http://docs.mongodb.org/manual/installation/).

To start mongodb as background process:

`cd /usr/local/mongodb`  (mongodb installation directory)


`mongod --fork --logpath /var/log/mongodb.log`


### Installing MongoDB Node.js Driver
From the top-level directory (e.g. raml-store):

`npm install mongodb`

### Installing Express
From the top-level directory (e.g. api-store):

`npm install `
        
  
## Running the Service
From the top-level directory (e.g. api-store):

`node server`


## Testing the Service

`curl -i -X POST -H 'Content-Type: application/json' -d '{"name":"myfirstapi.raml","path":"/","type":"file","contents":"#%25RAML%200.8%0Atitle:%20%20%20DONE!!!"}' http://localhost:9999/files`

`curl -i -X GET http://localhost:9999/files`



## Integration with API-Designer
Follow instructions at [api-designer](https://github.com/mulesoft/api-designer) to install and run API-Designer (or use the fork here : https://github.com/fchantrel/api-designer).  

First you can play with the API Designer with the index.html but your RAML files will be saved in your local storage, if you want to use this API to store the RAML files in MongoDB just call index_store.html instead of index.html (for the moment only available on the forked repository).


## Acknowledgements
Thanks to Brian Mc who gave me the idea with this API https://github.com/brianmc/raml-store