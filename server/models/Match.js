const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired', 'withdrawn'],
    default: 'pending'
  },
  initiatedBy: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  matchCriteria: {
    industryMatch: { type: Boolean },
    locationMatch: { type: Boolean },
    priceRangeMatch: { type: Boolean },
    timelineMatch: { type: Boolean },
    investmentTypeMatch: { type: Boolean }
  },
  communication: {
    lastMessage: { type: Date },
    messageCount: { type: Number, default: 0 },
    buyerResponseTime: { type: Number }, // in hours
    sellerResponseTime: { type: Number } // in hours
  },
  dealProgress: {
    stage: {
      type: String,
      enum: ['initial_contact', 'nda_signed', 'financial_review', 'due_diligence', 'letter_of_intent', 'purchase_agreement', 'closing'],
      default: 'initial_contact'
    },
    milestones: [{
      name: { type: String },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      dueDate: { type: Date }
    }],
    documents: [{
      name: { type: String },
      type: { type: String },
      status: { type: String, enum: ['pending', 'uploaded', 'reviewed', 'approved'] },
      url: { type: String },
      uploadedBy: { type: String, enum: ['buyer', 'seller'] },
      uploadedAt: { type: Date }
    }]
  },
  timeline: {
    createdAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    expiredAt: { type: Date },
    estimatedClosing: { type: Date }
  },
  notes: [{
    content: { type: String },
    author: { type: String, enum: ['buyer', 'seller', 'system'] },
    createdAt: { type: Date, default: Date.now }
  }],
  flags: {
    isUrgent: { type: Boolean, default: false },
    requiresAttention: { type: Boolean, default: false },
    isHotLead: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
matchSchema.index({ buyer: 1, seller: 1 }, { unique: true });
matchSchema.index({ status: 1 });
matchSchema.index({ 'dealProgress.stage': 1 });
matchSchema.index({ matchScore: -1 });
matchSchema.index({ createdAt: -1 });

// Pre-save middleware to set expiration
matchSchema.pre('save', function(next) {
  if (this.isNew && this.status === 'pending') {
    // Set expiration to 7 days from creation
    this.timeline.expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Method to calculate match score
matchSchema.methods.calculateMatchScore = function() {
  let score = 0;
  const criteria = this.matchCriteria;
  
  if (criteria.industryMatch) score += 25;
  if (criteria.locationMatch) score += 20;
  if (criteria.priceRangeMatch) score += 25;
  if (criteria.timelineMatch) score += 15;
  if (criteria.investmentTypeMatch) score += 15;
  
  this.matchScore = score;
  return score;
};

// Method to update deal progress
matchSchema.methods.updateDealProgress = function(stage) {
  this.dealProgress.stage = stage;
  this.dealProgress.milestones.push({
    name: `Moved to ${stage.replace('_', ' ')}`,
    completed: true,
    completedAt: new Date()
  });
};

module.exports = mongoose.model('Match', matchSchema);
