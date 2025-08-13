const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  investmentProfile: {
    investmentRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    preferredIndustries: [{
      type: String,
      enum: [
        'Technology', 'Healthcare', 'Manufacturing', 'Retail', 'Food & Beverage',
        'Real Estate', 'Financial Services', 'Education', 'Transportation',
        'Energy', 'Media & Entertainment', 'Professional Services', 'Other'
      ]
    }],
    preferredLocations: [{
      country: { type: String },
      state: { type: String },
      city: { type: String }
    }],
    dealSize: {
      type: String,
      enum: ['<$1M', '$1M-$5M', '$5M-$10M', '$10M-$25M', '$25M-$50M', '$50M+']
    },
    investmentType: [{
      type: String,
      enum: ['Full Acquisition', 'Majority Stake', 'Minority Stake', 'Partnership']
    }],
    timeHorizon: {
      type: String,
      enum: ['Immediate', '3-6 months', '6-12 months', '1-2 years', '2+ years']
    }
  },
  experience: {
    previousAcquisitions: { type: Number, default: 0 },
    yearsInBusiness: { type: Number },
    industryExperience: [String],
    teamSize: { type: Number },
    currentBusinesses: [{
      name: { type: String },
      industry: { type: String },
      revenue: { type: Number }
    }]
  },
  financialCapacity: {
    liquidCapital: { type: Number },
    financingPreference: {
      type: String,
      enum: ['Cash', 'SBA Loan', 'Bank Financing', 'Seller Financing', 'Combination']
    },
    creditScore: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Poor'] }
  },
  criteria: {
    mustHave: [String],
    niceToHave: [String],
    dealBreakers: [String],
    minimumRevenue: { type: Number },
    minimumProfit: { type: Number },
    employeeCount: {
      min: { type: Number },
      max: { type: Number }
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'inactive'],
    default: 'active'
  },
  preferences: {
    communicationStyle: {
      type: String,
      enum: ['Direct', 'Collaborative', 'Hands-off'],
      default: 'Direct'
    },
    responseTime: {
      type: String,
      enum: ['Immediate', 'Within 24 hours', 'Within a week'],
      default: 'Within 24 hours'
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
buyerSchema.index({ 'investmentProfile.preferredIndustries': 1 });
buyerSchema.index({ 'investmentProfile.investmentRange.min': 1, 'investmentProfile.investmentRange.max': 1 });
buyerSchema.index({ 'investmentProfile.preferredLocations.country': 1 });

module.exports = mongoose.model('Buyer', buyerSchema);
