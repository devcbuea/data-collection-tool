
const NodeGeocoder = require('node-geocoder'),
    config = require('../../config/env/default'),
    mongoose = require('mongoose'),
    MediaModel  = mongoose.model('MediaSchema'),
    path = require('path'),
    md5 = require('md5'),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    request = require('request'),
    notificationConfig = require('../../config/env/default').notification,
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            //check if folder exist if it does create.
            let endpoint = 'uploads';
            let p =  "";
            [md5(req.user.id), req.params.otype, req.params.oid, req.params.ftype].forEach(function(el){
                    if(el === 'none'){
                        //do nothing
                    }else {
                        endpoint += '/' +el;
                        p =  path.resolve(endpoint);
                        if (!fs.existsSync(p)) {
                                // Do something
                            fs.mkdirSync(p, 0777);
                         }
                    }

            });
            
            cb(null, p);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    upload = multer({ storage: storage });
exports.upload = upload;
    exports.location =  {
        getAddress(details){
            return new Promise((resolve, reject) => {
                let options = {
                    provider: 'google',
                    httpAdapter: 'https', // Default
                    apiKey: config.google.geocoding.apiKey,
                    formatter: null         // 'gpx', 'string', ...
                  };
                let geocoder = NodeGeocoder(options);
                geocoder.reverse({lat:details.lat, lon:details.lon}, (err, res) => {
                    if(!err){
                        details.address1 = res[0].formattedAddress;
                        details.city = res[0].city;
                        details.state = res[0].administrativeLevels.level1long;
                        details.street = res[0].streetName;
                        details.street_number = res[0].streetNumber;
                        details.country = res[0].country;
                        details.ccode = res[0].countryCode;
                        resolve(details); 
                    }else{
                        reject(err);
                    }
                    
                 });
            });
        }
    };

  exports.fileUpload = function(req, res, next){
       return upload.any();
  };
  exports.getMedia = function(req, res, next){
        // extranct relevant information from request
        let endpoint = `uploads/${md5(req.user.id)}/${req.params.otype}/`;
        switch(req.params.otype){
            case 'product':
                endpoint += `${req.params.ftype}/`;
                break;
            default:
                endpoint += `${req.params.oid}/${req.params.ftype}/`;
                break;
        }
        MediaModel.findById(req.params.fid, function(err, data){
            if(err || !data){
                res.status(500);
                res.send("Error");
            }else{
                //read the file and send content
                //check if file 
                let filename = path.resolve(endpoint + data.originalname);
                fs.stat(filename, function(err, stat){
                    if(!err){
                        let stream = fs.createReadStream(filename);
                        stream.pipe(res);
                    }
                });

            }
        });
    }
exports.sendMail = function (from, to, subject, message, attachment) {
    let transporter = nodemailer.createTransport(notificationConfig.mail.transporter);
    let mailOptions = {
        from: from ? `"[Tchizer Services]" ${from}`: `"[Tchizer Services]" ${notificationConfig.mail.senderEmail}`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        /*   text: 'Hello world?', // plain text body */
        html: message// html body
    };
    if (attachment) {
        if (typeof (attachment) === 'string') {
            mailOptions.attachments = [{
                path: attachment
            }]
        } else if (typeof (attachment) == 'object') {
            mailOptions.attachments = [attachment];
        }
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });

}
exports.sendSMS = function (dataString) {
    request({
        method: 'POST',
        url: 'https://rest.nexmo.com/sms/json',
        body: dataString,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dataString)
        },
        json: false

    }, function (err, response, body) {
        console.log("this is the response", response);
        if (err) {
            console.log("An error occured ", err);
        } else {
            console.log("[Message Success]: ", body);
        }
    });
}
