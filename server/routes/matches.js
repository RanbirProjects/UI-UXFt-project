const express = require('express');
const { body, validationResult } = require('express-validator');
const Match = require('../models/Match');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/matches
// @desc    Get user's matches
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    // Find matches where user is either buyer or seller
    query.$or = [
      { buyer: req.user.id },
      { seller: req.user.id }
    ];
    
    if (status) {
      query.status = status;
    }

    const matches = await Match.find(query)
      .populate('buyer', 'investmentProfile')
      .populate('seller', 'business financials')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Match.countDocuments(query);

    res.json({
      matches,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches
// @desc    Create a new match
// @access  Private
router.post('/', auth, [
  body('buyerId').isMongoId(),
  body('sellerId').isMongoId(),
  body('initiatedBy').isIn(['buyer', 'seller']),
  body('message').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { buyerId, sellerId, initiatedBy, message } = req.body;

    // Check if match already exists
    const existingMatch = await Match.findOne({
      buyer: buyerId,
      seller: sellerId
    });

    if (existingMatch) {
      return res.status(400).json({ message: 'Match already exists' });
    }

    // Create new match
    const match = new Match({
      buyer: buyerId,
      seller: sellerId,
      initiatedBy,
      status: 'pending'
    });

    // Add initial message if provided
    if (message) {
      match.notes.push({
        content: message,
        author: initiatedBy,
        createdAt: new Date()
      });
    }

    await match.save();

    res.status(201).json({
      message: 'Match created successfully',
      match
    });

  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/matches/:id/status
// @desc    Update match status
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['accepted', 'rejected', 'withdrawn'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const matchId = req.params.id;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Verify user is part of this match
    if (match.buyer.toString() !== req.user.id && match.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    match.status = status;
    
    // Update timeline
    if (status === 'accepted') {
      match.timeline.acceptedAt = new Date();
    } else if (status === 'rejected') {
      match.timeline.rejectedAt = new Date();
    }

    await match.save();

    res.json({
      message: 'Match status updated successfully',
      match
    });

  } catch (error) {
    console.error('Update match status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches/:id/notes
// @desc    Add note to match
// @access  Private
router.post('/:id/notes', auth, [
  body('content').notEmpty().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const matchId = req.params.id;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Verify user is part of this match
    if (match.buyer.toString() !== req.user.id && match.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Determine author based on user role
    const author = match.buyer.toString() === req.user.id ? 'buyer' : 'seller';

    match.notes.push({
      content,
      author,
      createdAt: new Date()
    });

    // Update communication metrics
    match.communication.lastMessage = new Date();
    match.communication.messageCount += 1;

    await match.save();

    res.json({
      message: 'Note added successfully',
      note: match.notes[match.notes.length - 1]
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/matches/:id
// @desc    Get specific match details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const matchId = req.params.id;

    const match = await Match.findById(matchId)
      .populate('buyer', 'investmentProfile')
      .populate('seller', 'business financials');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Verify user is part of this match
    if (match.buyer._id.toString() !== req.user.id && match.seller._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(match);

  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
