const express = require('express');
const path = require('path');
const directory = path.join(__dirname, '..', 'uploads');
const fs = require('fs')
const DOMAIN = process.env.DOMAIN;
const PORT = process.env.PORT;
const BASEURL = 'http://' + DOMAIN + ':' + PORT + '/' + 'files/'
const { uploadFile, uploadFiles } = require('../upload.js');

const router = express.Router();

const image_hw = { height: 0, width: 0 };
let coordinates = {}
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
const getFileList = (req, res,) => {
  try {
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
  }
  catch (err) {
    res.status(500).json({ message: 'Error in getting the file list' });
  }
};


// Handle Downlaod
const download = (req, res) => {
  try {
    const fileName = req.params.name;
    res.download(directory + '/' + fileName, (err) => {
      if (err) {
        res.status(500).json({ message: 'Could not download file' });
      }
    });
  }
  catch (err) {
    res.status(500).json({ message: 'Could not download file' });
  }
}


// Handle Height Width
const height_width = (req, res) => {
  try {
    let height = req.query.height;
    let width = req.query.width;
    if (height != undefined && width != undefined) {
      image_hw.height = height;
      image_hw.width = width;
      res.send('Ok')
    }

    else {
      res.json(image_hw)
    }
  }
  catch (err) {
    res.status(500).json({ message: 'Error getting dimensions' });
  }
}

// Handle Coordinate & Text Data 
const codata = (req, res) => {
  try {
    coordinates = req.body;
    console.log(coordinates)
    res.send('Ok')
  }
  catch (err) {
    res.status(500).json({ message: 'Error Saving the data points' });
  }
}

const get_codata = (req, res) => {

  try {
    res.json(coordinates)
  }
  catch (err) {
    res.status(500).json({ message: 'Error getting Coordinate data' });
  }
}

router.post('/upload', upload);
router.post('/uploads', uploads);
router.post('/codata', codata);
router.get('/codata', get_codata);
router.get('/files', getFileList);
router.get('/files/:name', download);
router.get('/hw', height_width);


module.exports = router;
