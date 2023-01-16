const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Router } = require('express')
// const { User } = require("../models/userInfo")

const uploading = Router()

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    // limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('imgUploader');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|webp|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
  
  
  const videoStorage = multer.diskStorage({
    destination: './public/uploads/videos',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

   // Init Upload
   const uploadVideo = multer({
    storage: videoStorage,
    // limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkVideoFileType(file, cb);
    }
  }).single('videoUploader');

  function checkVideoFileType(file, cb){
    // Allowed ext
    const filetypes = /mp4|mov|avi|wmv|mkv|webm/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
//   // EJS
//   app.set('view engine', 'ejs');
  
  // Public Folder
//   app.use(express.static('./public'));
  
//   app.get('/', (req, res) => res.render('index'));
  
uploading.post('/:userId', (req, res) => {
  const { userId } = req.params;
    upload(req, res, (err) => {
      if(err){
        res.status(403).json({ errors: err })
      } else {
        if(req.file == undefined){
            res.status(402).json({ errors: ['No file selectd'] })
        } else {
            const thumbnail = req.file.path.replace('public', 'https://jwsb.vercel.app');
            res.send(thumbnail);
        }
      }
    });
  });

uploading.delete('/delete', (req, res) => {
    const { url } = req.query;
    const path = url.replace('https://jwsb.vercel.app', 'public')
    fs.unlink(path, (err) => {
      if (err) {
        res.status(400).json({ error: 'something went wrong' })
      }
      res.status(200).json({ success: true, status: 200 })
    });
  });

// video 
uploading.post('/video/:userId', (req, res) => {
  const { userId } = req.params;
    uploadVideo(req, res, (err) => {
      if(err){
        res.status(403).json({ errors: err })
      } else {
        if(req.file == undefined){
            res.status(402).json({ errors: ['No file selectd'] })
        } else {
            const thumbnail = req.file.path.replace('public', 'https://jwsb.vercel.app');
            res.send(thumbnail);
        }
      }
    });
});

uploading.delete('/video/delete', (req, res) => {
  const { url } = req.query;
  const path = url.replace('https://jwsb.vercel.app', 'public')
  fs.unlink(path, (err) => {
    if (err) {
      res.status(400).json({ error: 'something went wrong' })
    }
    res.status(200).json({ success: true, status: 200 })
  });
});
 
module.exports = uploading
  