const express = require('express');
const CampaignSchema = require('../models/campaign');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const {
      brand,
      name,
      tags,
      collectionItem,
      unit,
      weight,
      description,
      tokenType,
      pastTransaction,
      userName,
    } = req.body;
    if (brand == null) {
      throw new Error('Brand is required.');
    }
    if (name == null) {
      throw new Error('Name is required.');
    }
    if (tags == null) {
      throw new Error('Tags is required.');
    }
    if (collectionItem == null) {
      throw new Error('Collection is required.');
    }
    if (unit == null) {
      throw new Error('Unit is required.');
    }
    if (weight == null) {
      throw new Error('Weight is required.');
    }
    if (description == null) {
      throw new Error('Description is required.');
    }
    if (tokenType == null) {
      throw new Error('Token Type is required.');
    }
    if (pastTransaction == null) {
      throw new Error('Past Transaction is required.');
    }
    if (userName == null) {
      throw new Error('Username is required.');
    }
    const campaign = new CampaignSchema({
      brand,
      name,
      tags,
      collectionItem,
      unit,
      weight,
      description,
      tokenType,
      pastTransaction,
      userName,
    });
    const persistedCampaign = await campaign.save();
    const campaignId = persistedCampaign._id;

    res.json({
      message: 'Campaign Registration Successful',
      data: persistedCampaign,
    });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          message: 'Something went wrong during registration process.',
          error: err.message,
        },
      ],
    });
  }
});

router.patch('/edit', async (req, res) => {
  try {
    const {
      brand,
      name,
      tags,
      collectionItem,
      unit,
      weight,
      description,
      tokenType,
      pastTransaction,
      userName,
      id,
    } = req.body;
    const campaigns = await CampaignSchema.findOneAndUpdate(
      {
        _id: id,
      },
      {
        brand,
        name,
        tags,
        collectionItem,
        unit,
        weight,
        description,
        tokenType,
        pastTransaction,
        userName,
      },
      {
        new: true,
      }
    );
    res.json({
      message: 'Update successful',
      data: campaigns,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          message: 'Something went wrong!',
          error: err.message,
        },
      ],
    });
  }
});

router.get('/lists', async (req, res) => {
  try {
    const campaigns = await CampaignSchema.find();
    console.log(campaigns);
    res.json({
      message: 'Campaign successful',
      data: campaigns,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          message: 'Something went wrong!',
          error: err.message,
        },
      ],
    });
  }
});

router.delete('/remove', async (req, res) => {
  try {
    const { id } = req.body;
    if (id == null) {
      throw new Error('Campaign ID is required.');
    }
    const campaign = await CampaignSchema.findByIdAndDelete({
      _id: id,
    });
    res.json({
      message: 'Campaign Deleted',
      data: campaign,
    });
  } catch (error) {
    res.status(401).json({
      errors: [
        {
          message: 'Something went wrong!',
          error: err.message,
        },
      ],
    });
  }
});

module.exports = router;
