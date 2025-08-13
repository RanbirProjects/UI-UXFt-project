const express = require('express');
const { body, validationResult } = require('express-validator');
const Buyer = require('../models/Buyer');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/buyers/profile
// @desc    Get buyer profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user.id })
      .populate('userId', 'profile email userType');
    
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer profile not found' });
    }

    res.json(buyer);
  } catch (error) {
    console.error('Get buyer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/buyers/onboarding
// @desc    Complete buyer onboarding
// @access  Private
router.post('/onboarding', auth, [
  body('investmentRange.min').isNumeric(),
  body('investmentRange.max').isNumeric(),
  body('preferredIndustries').isArray(),
  body('preferredLocations').isArray(),
  body('dealSize').isIn(['<$1M', '$1M-$5M', '$5M-$10M', '$10M-$25M', '$25M-$50M', '$50M+']),
  body('investmentType').isArray(),
  body('timeHorizon').isIn(['Immediate', '3-6 months', '6-12 months', '1-2 years', '2+ years'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      investmentRange,
      preferredIndustries,
      preferredLocations,
      dealSize,
      investmentType,
      timeHorizon,
      yearsInBusiness,
      industryExperience,
      teamSize,
      liquidCapital,
      financingPreference,
      mustHave,
      niceToHave,
      dealBreakers,
      minimumRevenue,
      minimumProfit
    } = req.body;

    let buyer = await Buyer.findOne({ userId: req.user.id });
    
    if (!buyer) {
      buyer = new Buyer({ userId: req.user.id });
    }

    // Update investment profile
    buyer.investmentProfile = {
      investmentRange,
      preferredIndustries,
      preferredLocations,
      dealSize,
      investmentType,
      timeHorizon
    };

    // Update experience
    buyer.experience = {
      yearsInBusiness,
      industryExperience,
      teamSize,
      previousAcquisitions: buyer.experience?.previousAcquisitions || 0,
      currentBusinesses: buyer.experience?.currentBusinesses || []
    };

    // Update financial capacity
    buyer.financialCapacity = {
      liquidCapital,
      financingPreference,
      creditScore: buyer.financialCapacity?.creditScore || 'Good'
    };

    // Update criteria
    buyer.criteria = {
      mustHave,
      niceToHave,
      dealBreakers,
      minimumRevenue,
      minimumProfit,
      employeeCount: buyer.criteria?.employeeCount || { min: 0, max: 1000 }
    };

    await buyer.save();

    // Mark user onboarding as completed
    await User.findByIdAndUpdate(req.user.id, { onboardingCompleted: true });

    res.json({
      message: 'Onboarding completed successfully',
      buyer
    });

  } catch (error) {
    console.error('Buyer onboarding error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/buyers/profile
// @desc    Update buyer profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user.id });
    
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer profile not found' });
    }

    // Update fields
    const updateFields = [
      'investmentProfile', 'experience', 'financialCapacity', 
      'criteria', 'preferences', 'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field]) {
        buyer[field] = { ...buyer[field], ...req.body[field] };
      }
    });

    await buyer.save();

    res.json({
      message: 'Profile updated successfully',
      buyer
    });

  } catch (error) {
    console.error('Update buyer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/buyers/matches
// @desc    Get buyer matches
// @access  Private
router.get('/matches', auth, async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user.id });
    
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer profile not found' });
    }

    // This would typically involve a matching algorithm
    // For now, return a simple response
    res.json({
      matches: [],
      message: 'Matches will be implemented with the matching algorithm'
    });

  } catch (error) {
    console.error('Get buyer matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/buyers/sellers
// @desc    Get available sellers for buyer
// @access  Private
router.get('/sellers', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, industry, location, minPrice, maxPrice } = req.query;
    
    const buyer = await Buyer.findOne({ userId: req.user.id });
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer profile not found' });
    }

    // Build query based on buyer preferences
    const query = {
      status: 'active',
      visibility: 'public'
    };

    if (industry) query['business.industry'] = industry;
    if (location) query['business.location.country'] = location;
    if (minPrice || maxPrice) {
      query['financials.askingPrice'] = {};
      if (minPrice) query['financials.askingPrice'].$gte = parseInt(minPrice);
      if (maxPrice) query['financials.askingPrice'].$lte = parseInt(maxPrice);
    }

    const Seller = require('../models/Seller');
    const sellers = await Seller.find(query)
      .populate('userId', 'profile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Seller.countDocuments(query);

    res.json({
      sellers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get sellers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/buyers/express-interest
// @desc    Express interest in a seller
// @access  Private
router.post('/express-interest', auth, [
  body('sellerId').isMongoId(),
  body('message').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sellerId, message } = req.body;

    // This would create a match record
    // For now, return a simple response
    res.json({
      message: 'Interest expressed successfully',
      sellerId,
      message
    });

  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
