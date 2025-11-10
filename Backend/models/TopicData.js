const mongoose = require('mongoose');

const TopicDataSchema = new mongoose.Schema({
  searchTerm: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  sentiment: {
    type: String,
    required: true
  },
  sentimentScore: {
    Positive: Number,
    Negative: Number,
    Neutral: Number,
    Mixed: Number
  },
  keyPhrases: [String], // An array of key phrases found
  entities: [String], // An array of entities (like "Tesla", "Elon Musk")
  sourceUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('TopicData', TopicDataSchema);