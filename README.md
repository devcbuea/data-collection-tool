# Hello ,welcome to Developer Circle Buea Dataset collection platform server
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
  
  
  
