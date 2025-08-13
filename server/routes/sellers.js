const express = require('express');
const { body, validationResult } = require('express-validator');
const Seller = require('../models/Seller');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/sellers/profile
// @desc    Get seller profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user.id })
      .populate('userId', 'profile email userType');
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    res.json(seller);
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sellers/onboarding
// @desc    Complete seller onboarding
// @access  Private
router.post('/onboarding', auth, [
  body('business.name').notEmpty(),
  body('business.industry').isIn([
    'Technology', 'Healthcare', 'Manufacturing', 'Retail', 'Food & Beverage',
    'Real Estate', 'Financial Services', 'Education', 'Transportation',
    'Energy', 'Media & Entertainment', 'Professional Services', 'Other'
  ]),
  body('business.description').isLength({ min: 50, max: 2000 }),
  body('business.location.city').notEmpty(),
  body('business.location.state').notEmpty(),
  body('business.location.country').notEmpty(),
  body('financials.annualRevenue').isNumeric(),
  body('financials.annualProfit').isNumeric(),
  body('financials.askingPrice').isNumeric(),
  body('operations.employeeCount').isNumeric(),
  body('reasonForSelling').isIn([
    'Retirement', 'Health Issues', 'New Opportunity', 'Relocation',
    'Partnership Dispute', 'Market Conditions', 'Succession Planning', 'Other'
  ])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      business,
      financials,
      operations,
      reasonForSelling,
      timeline,
      assets
    } = req.body;

    let seller = await Seller.findOne({ userId: req.user.id });
    
    if (!seller) {
      seller = new Seller({ userId: req.user.id });
    }

    // Update business information
    seller.business = {
      ...seller.business,
      ...business
    };

    // Update financials
    seller.financials = {
      ...seller.financials,
      ...financials
    };

    // Update operations
    seller.operations = {
      ...seller.operations,
      ...operations
    };

    // Update other fields
    seller.reasonForSelling = reasonForSelling;
    if (timeline) seller.timeline = { ...seller.timeline, ...timeline };
    if (assets) seller.assets = { ...seller.assets, ...assets };

    // Set status to active after onboarding
    seller.status = 'active';

    await seller.save();

    // Mark user onboarding as completed
    await User.findByIdAndUpdate(req.user.id, { onboardingCompleted: true });

    res.json({
      message: 'Onboarding completed successfully',
      seller
    });

  } catch (error) {
    console.error('Seller onboarding error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/sellers/profile
// @desc    Update seller profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user.id });
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    // Update fields
    const updateFields = [
      'business', 'financials', 'operations', 'timeline', 
      'assets', 'reasonForSelling', 'visibility'
    ];

    updateFields.forEach(field => {
      if (req.body[field]) {
        seller[field] = { ...seller[field], ...req.body[field] };
      }
    });

    await seller.save();

    res.json({
      message: 'Profile updated successfully',
      seller
    });

  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sellers/buyers
// @desc    Get potential buyers for seller
// @access  Private
router.get('/buyers', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const seller = await Seller.findOne({ userId: req.user.id });
    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    // Build query based on seller's business
    const query = {
      status: 'active'
    };

    // Match industry preferences
    if (seller.business.industry) {
      query['investmentProfile.preferredIndustries'] = seller.business.industry;
    }

    // Match price range
    if (seller.financials.askingPrice) {
      query['investmentProfile.investmentRange.min'] = { $lte: seller.financials.askingPrice };
      query['investmentProfile.investmentRange.max'] = { $gte: seller.financials.askingPrice };
    }

    // Match location preferences
    if (seller.business.location.country) {
      query['investmentProfile.preferredLocations.country'] = seller.business.location.country;
    }

    const Buyer = require('../models/Buyer');
    const buyers = await Buyer.find(query)
      .populate('userId', 'profile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Buyer.countDocuments(query);

    res.json({
      buyers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get buyers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sellers/initiate-contact
// @desc    Initiate contact with a buyer
// @access  Private
router.post('/initiate-contact', auth, [
  body('buyerId').isMongoId(),
  body('message').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { buyerId, message } = req.body;

    // This would create a match record
    // For now, return a simple response
    res.json({
      message: 'Contact initiated successfully',
      buyerId,
      message
    });

  } catch (error) {
    console.error('Initiate contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sellers/matches
// @desc    Get seller matches
// @access  Private
router.get('/matches', auth, async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user.id });
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    // This would typically involve a matching algorithm
    // For now, return a simple response
    res.json({
      matches: [],
      message: 'Matches will be implemented with the matching algorithm'
    });

  } catch (error) {
    console.error('Get seller matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/sellers/status
// @desc    Update seller listing status
// @access  Private
router.put('/status', auth, [
  body('status').isIn(['draft', 'active', 'under_contract', 'sold', 'inactive'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    const seller = await Seller.findOne({ userId: req.user.id });
    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    seller.status = status;
    await seller.save();

    res.json({
      message: 'Status updated successfully',
      status
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
