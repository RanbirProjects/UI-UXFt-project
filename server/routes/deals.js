const express = require('express');
const { body, validationResult } = require('express-validator');
const Match = require('../models/Match');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/deals
// @desc    Get user's deals
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { stage, page = 1, limit = 10 } = req.query;
    
    const query = {
      status: 'accepted'
    };
    
    // Find deals where user is either buyer or seller
    query.$or = [
      { buyer: req.user.id },
      { seller: req.user.id }
    ];
    
    if (stage) {
      query['dealProgress.stage'] = stage;
    }

    const deals = await Match.find(query)
      .populate('buyer', 'investmentProfile')
      .populate('seller', 'business financials')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'dealProgress.stage': 1, createdAt: -1 });

    const total = await Match.countDocuments(query);

    res.json({
      deals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/deals/:id/stage
// @desc    Update deal stage
// @access  Private
router.put('/:id/stage', auth, [
  body('stage').isIn([
    'initial_contact', 'nda_signed', 'financial_review', 'due_diligence', 
    'letter_of_intent', 'purchase_agreement', 'closing'
  ])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { stage } = req.body;
    const dealId = req.params.id;

    const deal = await Match.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Verify user is part of this deal
    if (deal.buyer.toString() !== req.user.id && deal.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update deal stage
    deal.updateDealProgress(stage);

    await deal.save();

    res.json({
      message: 'Deal stage updated successfully',
      deal
    });

  } catch (error) {
    console.error('Update deal stage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/deals/:id/documents
// @desc    Add document to deal
// @access  Private
router.post('/:id/documents', auth, [
  body('name').notEmpty(),
  body('type').notEmpty(),
  body('url').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, url } = req.body;
    const dealId = req.params.id;

    const deal = await Match.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Verify user is part of this deal
    if (deal.buyer.toString() !== req.user.id && deal.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Determine uploader based on user role
    const uploadedBy = deal.buyer.toString() === req.user.id ? 'buyer' : 'seller';

    deal.dealProgress.documents.push({
      name,
      type,
      url,
      status: 'uploaded',
      uploadedBy,
      uploadedAt: new Date()
    });

    await deal.save();

    res.json({
      message: 'Document added successfully',
      document: deal.dealProgress.documents[deal.dealProgress.documents.length - 1]
    });

  } catch (error) {
    console.error('Add document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/deals/:id/documents/:docId/status
// @desc    Update document status
// @access  Private
router.put('/:id/documents/:docId/status', auth, [
  body('status').isIn(['pending', 'uploaded', 'reviewed', 'approved'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const { id: dealId, docId } = req.params;

    const deal = await Match.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Verify user is part of this deal
    if (deal.buyer.toString() !== req.user.id && deal.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const document = deal.dealProgress.documents.id(docId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.status = status;
    await deal.save();

    res.json({
      message: 'Document status updated successfully',
      document
    });

  } catch (error) {
    console.error('Update document status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/deals/:id/milestones
// @desc    Add milestone to deal
// @access  Private
router.post('/:id/milestones', auth, [
  body('name').notEmpty(),
  body('dueDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, dueDate } = req.body;
    const dealId = req.params.id;

    const deal = await Match.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Verify user is part of this deal
    if (deal.buyer.toString() !== req.user.id && deal.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    deal.dealProgress.milestones.push({
      name,
      completed: false,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    await deal.save();

    res.json({
      message: 'Milestone added successfully',
      milestone: deal.dealProgress.milestones[deal.dealProgress.milestones.length - 1]
    });

  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/deals/:id/milestones/:milestoneId
// @desc    Update milestone
// @access  Private
router.put('/:id/milestones/:milestoneId', auth, [
  body('completed').isBoolean(),
  body('name').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { completed, name } = req.body;
    const { id: dealId, milestoneId } = req.params;

    const deal = await Match.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Verify user is part of this deal
    if (deal.buyer.toString() !== req.user.id && deal.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const milestone = deal.dealProgress.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.completed = completed;
    if (completed) {
      milestone.completedAt = new Date();
    }
    if (name) {
      milestone.name = name;
    }

    await deal.save();

    res.json({
      message: 'Milestone updated successfully',
      milestone
    });

  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/deals/:id
// @desc    Get specific deal details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const dealId = req.params.id;

    const deal = await Match.findById(dealId)
      .populate('buyer', 'investmentProfile')
      .populate('seller', 'business financials');

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Verify user is part of this deal
    if (deal.buyer._id.toString() !== req.user.id && deal.seller._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(deal);

  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
