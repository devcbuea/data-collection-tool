/**
 * @file run test init files
 */
const glob = require('glob')
const { spawn } = require( 'child_process' )
const inits = glob.sync('./modules/**/tests/init.js')
inits.forEach((el) => {
    // To keep console colors use 'inherit'
    // This causes an initial error, using a try/catch block we handle the error in the catch
    node = spawn( 'node', [el] , {stdio: "inherit"})

    try{
        node.stdout.on( 'data', data => {
            console.log(data.toString('utf8'))
        } );
    
        node.stderr.on( 'data', data => {
            console.log(data.toString('utf8'))
        } );
    
        node.on( 'close', code => {
            console.log(code.toString('utf8'))
        } );
    }catch(e){
        // do nothing
    }
     
})
