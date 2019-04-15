# Hello ,welcome to Developer Circle Buea Dataset collection platform server
## About Project
The project is a data collection tool, it will allow for users to create data profiles. A data profile is defined to be the type of data to be collected in some sense a data object , a description of this data and properties (fields) that will need to be collected. People contribute data to a data profile. Essentially in the community we will create different data profiles for the type of data we want to collect. The creator of a data profile can limit those who can contribute to a data profile, every data associated to a data profile is public and can be exported in the supported formats json, cvs, xls, xml ,sql and any format. The platform will has a [web](https://github.com/devcbuea/dt-collect-web-client) and [mobile client](https://github.com/devcbuea/dt-collect-mobile-client)  and a backend which is this repo. The server  an api service that will be consumed by the mobile and web clients. The mobile client will essentially support just the data collection component of the project. The web client shall support all the components of the project including an administration console.

## Application Structure

```bash
.
├── core ---- core folder start and manage applications
│   ├── assets
│   │   ├── default.js --- configuration for asset paths
│   │   └── test.js --- configuaration for tests paths
│   ├── config.js --- initializes app 
│   ├── env
│   │   └── default.js -- enviroment configuiration
│   ├── lib
│   │   ├── app.js ---  configures  app
│   │   ├── express.js --- express config
│   │   ├── mongoose.js --- mongo config
│   │   └── socket.io.js --- sockets config
│   └── sslcerts --- ssl certificates
├── modules ------- all application modules go into this folder eg.
│   └── authentication --- Every module developed must contain these base folder
│       ├── controller --- handles routes,recommended file naming <controller_name>.controller.js
│       ├── middleware  --- route enterceptors, nameing <midleware>.middleware.js
│       ├── model ---------- contains two type of files, mongo schema and class files
│       │   └── user.model.js --- mongo model ,naming <schema>.model.js, class <class>.class.js
|       |__ tests
|           |__ e2e --- end to end tests folder [
|           |__ authentication.test.js ---
│       └── routes --- rest api endpoints
│           └── authentication.route.js --- naming <route>.route.js 
├── package.json --- package file
├── README.md
|__ init-tests.js ---- Initialise test objects eg database objects
|__ data-collection-tool.postman_collection.json ----- Postman file for testing api endpoints
├── server.js --- entry point of server
```
## Installation
### Install and run mongo
Follow the instructions to install mongo for your specific Os [here](https://docs.mongodb.com/manual/installation/)
### Install git
Follow the instructions to install git for your specific Os [here](https://git-scm.com/downloads)
### Install node
Follow the instructions to install node for your specific Os [here](https://nodejs.org/en/download/)
### Install yarn
Follow the instructions to install node for your specific Os [here](https://yarnpkg.com/)
### open git bash or from terminal and clone repo
```bash
  git clone https://github.com/devcbuea/data-collection-tool.git <repo_name>
 ```
 ### run
 ```bash
    cd repo_name
 ```
 ```bash
    yarn install # install packages
 ```
 ```bash
    yarn start # start application
 ```
 ### visit your browser
    http://localhost:3000/
    
 ## Questions
 If you have questions, you can post them in the [Developer Circle Buea Group](https://www.facebook.com/groups/DevCBuea/)
 or create an issue with label Question on the repo
 ## TODO
 Will be updated before hackathon
  
  
  
