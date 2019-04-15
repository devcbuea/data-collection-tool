/**
 * Initialize variables needed for authenctication tests- databases
 */
const chalk = require('chalk'),
      mongoose = require('mongoose'),
      log = console.log,
      default_user_id = mongoose.Types.ObjectId("507f191e810c19729de860ea"),
      banned_user_id = mongoose.Types.ObjectId("507f191e810c19729de860eb"),
      deleted_user_id = mongoose.Types.ObjectId("507f191e810c19729de860ec"),
      user_with_permission_user_id = mongoose.Types.ObjectId("507f191e810c19729de860ed"),
      user_with_permission_admin_id = mongoose.Types.ObjectId("507f191e810c19729de860ea")

let db = mongoose.connect('mongodb://localhost:27017/data-collection-tool-test', {useNewUrlParser: true})
db.then( connection => {
    require('../models/user.model')
    const UserModel = mongoose.model('User')
    // create default user
    log(chalk.green('Creating default user with name Jane Doe'))
    let userDefault = new UserModel({
        _id: default_user_id,
        first_name : 'Jane', 
        last_name : 'Doe',
        username : 'jane_doe',
        email : 'janedoe@test.com',
        password : 'janedoe',
        permission : 'user',
        banned : false,
        signed_in : new Date(),
        last_seen : new Date(),
        deleted : false, 
        photo : null,
        created : new Date()
    })
    // deault user
    userDefault.save(function(err, _user){
        if(err)
            // probably user already exits
            return log(chalk.yellow(err.message))
        try{
            // user was created
            return log(chalk.green('Default user ', _user.first_name, _user.last_name ))
        }catch(e){
            //
            return log(chalk.red(e))
        }
    })
}, err => {
    console.log(chalk.red('Connection to mongodb could not be established:'))
    console.log(chalk.red('message:', err.message))
})


