const { Schema, model } = require("mongoose");

const requiredStringDefObj = {
  required: false,
  type: String,
};

const requiredNumberObj = {
  required: false,
  type: Number,
};

const optionalFieldArray = {
  required: false,
  type: Array,
};

const optionalFieldString = {
  required: false,
  type: String,
};

const optionalFieldBoolean = {
  required : false, 
  type: Boolean
}

const jobShareInfoSchema = new Schema({
  sharedById: requiredStringDefObj,
  sharedByName: requiredStringDefObj,
//   sharedByDp: requiredStringDefObj,
  sharedByCategory: requiredStringDefObj,
  sharedByExperience: requiredNumberObj,
  sharedTo: requiredStringDefObj,
  jobId: requiredStringDefObj,
  jobTitle: requiredStringDefObj,
  appliedDate: requiredStringDefObj,
  jobExpired: requiredStringDefObj,
  status: optionalFieldBoolean
})

const JobShare = new model("applications", jobShareInfoSchema);

module.exports = {
    JobShare,
    jobShareInfoSchema,
};
