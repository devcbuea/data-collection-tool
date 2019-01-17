
const mongoose = require('mongoose'),
    MediaModel = mongoose.model('MediaSchema'),
    path = require('path'),
    md5 = require('md5'),
    fs = require('fs'),
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            //check if folder exist if it does create.
            let endpoint = 'uploads'
            let p = ""
            console.log("The is is ------------------------------------", req.user.id.trim())
            let arrayParams = [md5(req.user.id), req.params.otype, req.params.oid, req.params.ftype]
            arrayParams.forEach(function (el) {
                if (el === 'none') {
                    //do nothing
                } else {
                    endpoint += '/' + el
                    p = path.resolve(endpoint)
                    if (!fs.existsSync(p)) {
                        // Do something
                        fs.mkdirSync(p, 0777)
                    }
                }

            })

            cb(null, p)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    upload = multer({ storage: storage })
exports.upload = upload


exports.fileUpload = function (req, res, next) {
    return upload.any()
}
exports.getMedia = function (req, res, next) {
    // extranct relevant information from request
   
    MediaModel.findById(req.params.fid, function (err, data) {
        if (err) {
            res.status(500)
            res.send("Error")
        } else {
            let user_id = '' + data.user
            let endpoint = `uploads/${md5(user_id)}/${data.otype}/`
            switch (data.otype) {
                case 'product':
                    endpoint += `${data.ftype}/`
                    break
                default:
                    endpoint += `${data.oid}/${data.ftype}/`
                    break
            }
            let filename = path.resolve(endpoint + data.originalname)
            console.log(filename)
            fs.stat(filename, function (err, stat) {
                if (!err) {
                    let stream = fs.createReadStream(filename)
                    stream.pipe(res)
                }
            })

        }
    })
}
exports.addMedia = function (req, res, next) {
    let media = new MediaModel(req.files[0])
    media.user = req.user.id
    media.otype = req.params.otype
    media.oid = req.params.oid
    media.ftype = req.params.ftype
    media.save((err, file) => {
        if (err) {
            res.json({ "status": "error", "message": "COuld not upload picture" })
        } else {
            res.json({ "status": "success", data: [file], "success": true })
        }
    })
}