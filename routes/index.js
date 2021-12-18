const express = require('express');
const path = require('path');
const directory = path.join(__dirname, '..', 'uploads');
const fs = require('fs')
const DOMAIN = process.env.DOMAIN;
const PORT = process.env.PORT;
const BASEURL = 'http://' + DOMAIN + ':' + PORT + '/' + 'files/'
const { uploadFile, uploadFiles } = require('../upload.js');

const router = express.Router();


// Function to handle single upload
const upload = async (req, res) => {
  try {
    console.log('Trying to upload')
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).json({ message: 'Please Upload  a  File' });
    }
    console.log(req.file)
    res.status(200).json({ message: 'Uploaded Successfully', err: false, fileName: req.file.filename });
  }

  catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Coluld not upload the file' })
  }
}

// Function to handle multile upload
const uploads = async (req, res, next) => {
  try {
    console.log('Trying to upload')
    await uploadFiles(req, res, next);

    if (req.files == undefined) {
      return res.status(400).json({ message: 'Please Upload  a  File' });
    }
    console.log(req.files)
    res.status(200).json({ message: 'Uploaded Successfully', err: false, fileName: req.files });
  }

  catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Coluld not upload the file' })
  }
}


// Handle fetch list
const getFileList = (req, res, next) => {

  fs.readdir(directory, (err, files) => {
    if (err) res.status(500).json({ message: 'Unable to scan files' });

    let filesInfo = [];
    files.forEach((file) => {
      filesInfo.push({
        name: file,
        directory: BASEURL + file
      })
    });
    res.status(200).json({ result: filesInfo });
  });
};


// Handle Downlaod
const download = (req, res) => {
  const fileName = req.params.name;
  res.download(directory + '/' + fileName, (err) => {
    if (err) {
      res.status(500).json({ message: 'Could not download file' });
    }
  });
}



router.post('/upload', upload)
router.post('/uploads', uploads)
router.get('/files', getFileList);
router.get('/files/:name', download)


module.exports = router;
