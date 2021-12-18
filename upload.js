const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path = require("path");
const directory = path.join(__dirname, 'uploads');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const [name, extension] = file.originalname.split('.')
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize }
}).array('files');

let upload = util.promisify(uploadFile);
let uploads = util.promisify(uploadFiles);

module.exports = {
  uploadFile: upload,
  uploadFiles: uploads
}

