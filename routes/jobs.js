const { Router } = require('express')
const multer = require('multer');
const path = require('path');
const jobs = Router()

const { Jobs } = require('../models/jobs')

// image upload
const storage = multer.diskStorage({
  destination: './public/jobImage/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  // limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('jobImageUploader');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
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
// image upload end

jobs.get('/', async (req, res) => { 

  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 9;
  const postedById = req.query.postedById && {'postedById': req.query.postedById};
  const userId = req.query.userId && {'postedById': {$ne :req.query.userId}}
  const city = req.query.city && {'city': new RegExp('^' + req.query.city + '$', 'i')};
  const title = req.query.title && {'jobTitle': new RegExp('^' + req.query.title + '$', 'i')};
  const category = req.query.category && {'postedByCategory': new RegExp('^' + req.query.category + '$', 'i')};
  const subCategory = req.query.subCategory && {'postedBySubCategory': new RegExp('^' + req.query.subCategory + '$', 'i')};
  const state = req.query.state && {'state': new RegExp('^' + req.query.state + '$', 'i')};
  const country = req.query.country && {'country': new RegExp('^' + req.query.country + '$', 'i')};
  const budget = req.query.budgetMinimum && {'budget':{$gte: Number(req.query.budgetMinimum) ,$lte: Number(req.query.budgetMaximum)}};
  const total = await Jobs.countDocuments();
  const query = {...userId, ...postedById, ...city, ...state, ...country, ...budget, ...category, ...subCategory, ...title}

  try {
      const response = await Jobs.find(query)
      // .skip(page * limit).limit(limit);
      console.log(response, 'response')
     return res.status(200).json({
      data: response,
      total
     })
    }
   catch (error) {
    return res.status(502).json({ errors: ['Some error occurred'] })
  }
})

jobs.post("/", async (req, res) => {
  try {
    // upload(req, res, (err) => {
    //   if(err){
    //     res.status(403).json({ errors: err })
    //   } else {
    //     if(req.file == undefined){
    //         res.status(402).json({ errors: ['No file selectd'] })
    //     } else {
    //         const thumbnail = req.file.path.replace('public', 'http://node-env.eba-xnwspbk7.ap-northeast-1.elasticbeanstalk.com');
    //           const newJob = {postedOn: new Date(), thumbnail: thumbnail};
    //           Jobs.create(
    //             newJob, (err, users) => {
    //               if (err) {
    //                 throw err;
    //               }
    //               res.status(200).json({ success: true })
    //             })
    //         // res.send(thumbnail);
    //     }
    //   }
    // })
    const newJob = {...req.body, postedOn: new Date(), status: false};
    Jobs.create(
      newJob, (err, users) => {
        if (err) {
          throw err;
        }
        res.status(200).json({ success: true })
      }
    )
  } catch (err) {
    res
      .status(400)
      .send({ message: "Something went wrong. Unable to contact" })
  }
})

jobs.post('/:_id', (req, res) => {
  console.log(req, 'req')
  const { _id = "",  } = req.params
  const jobDetail = {...req.body, updatedAt: new Date()};

  try {
    Jobs.findByIdAndUpdate(_id, jobDetail, {new: true})
        .then(() => res.status(200).json({ message: 'record updated successfully', data: {...req.body}}))
        .catch(error => console.log(error))
  }
  catch(error){
      console.log( error)
  }
})

jobs.delete('/:_id', (req, res) => {
  const { _id = "",  } = req.params

  try {
    Jobs.findOneAndDelete({ _id })
        .then(() => res.status(200).json({ message: 'record Deleted successfully', data: {...req.body}  }))
        .catch(error => console.log(error))
  }
  catch(error){
      console.log( error)
  }
})

module.exports = jobs
