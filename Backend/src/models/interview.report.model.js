const mongoose = require("mongoose");
const { string } = require("zod");

/**
 * --> job descrptions schema
 * --> resume text
 * --> self description
 *
 * --> technical question : [{
 *          quetion: "",,
 *          intention : "",
 *          answer: ""
 * }]
 * --> behavioral quetions : []
 * --> skill gaps : []
 * --> preparatin plain : [{}
 */

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "technical question is required"],
    },
    intention: {
      type: String,
      required: [true, "intention is srequired"],
    },
  },
  {
    _id: false,
  },
);

const behaviorQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "technical question is required"],
    },
    intention: {
      type: String,
      required: [true, "intention is srequired"],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required:  [true, "skill is required"]
    },
    severity:{
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "savariety is required"]
    }
},{
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type:Number,
        required: [true, "date is required"]
    },
    focus: {
        type: String,
        required: [true, "focus is required"]
    },
    taskS:[{
        type: String,
        required: [true, "task is required"]
    }]
})

const interviewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: [true, "job descsription is required"],
  },
  resume: {
    type: String,
  },
  selfDescription: {
    type: String,
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalQuestions: [technicalQuestionSchema],
  behavioralQuestions:[behaviorQuestionSchema],
  skillGaps: [skillGapSchema],
  preparationPlan: [preparationPlanSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title:{
    type:string,
    required: [ true, "job title is required" ]
  }
},{
    timestamps: true
});

const interviewReportModel = mongoose.model('interviewReport', interviewReportSchema)

module.exports = interviewReportModel;