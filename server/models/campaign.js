const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  collectionItem: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tokenType: {
    type: String,
    required: true,
  },
  pastTransaction: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('Campaign', CampaignSchema);
