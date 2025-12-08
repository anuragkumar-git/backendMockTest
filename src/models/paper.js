const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
  part: Number,
  question_number: Number,
  question_type: String,
  question_text: String,
  expression: String,
  series: String,
  analogy: String,
  data_reference: String,
  image_text: String,
  reflection_axis: String,
  statements: Schema.Types.Mixed,
  conclusions: Schema.Types.Mixed,
  options: Schema.Types.Mixed,
  passage_text: String,
  correct_answer_key: String,
  context_type: String,
  
  
  passage_context: Schema.Types.Mixed,
  section: String, //no ideaa
  question_text_gu: String,
  question_text_en: String,
  correct_answer: String,
  question_id: Number,
  context_id: String,
});

const PaperSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Paper', PaperSchema);