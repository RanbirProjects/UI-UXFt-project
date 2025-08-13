const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  business: {
    name: { type: String, required: true },
    industry: {
      type: String,
      enum: [
        'Technology', 'Healthcare', 'Manufacturing', 'Retail', 'Food & Beverage',
        'Real Estate', 'Financial Services', 'Education', 'Transportation',
        'Energy', 'Media & Entertainment', 'Professional Services', 'Other'
      ],
      required: true
    },
    description: { type: String, required: true, maxlength: 2000 },
    founded: { type: Number },
    location: {
      address: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String }
    },
    website: { type: String },
    socialMedia: {
      linkedin: { type: String },
      facebook: { type: String },
      instagram: { type: String }
    }
  },
  financials: {
    annualRevenue: { type: Number, required: true },
    annualProfit: { type: Number, required: true },
    cashFlow: { type: Number },
    assets: { type: Number },
    liabilities: { type: Number },
    askingPrice: { type: Number, required: true },
    priceRange: {
      min: { type: Number },
      max: { type: Number }
    },
    revenueGrowth: { type: Number }, // percentage
    profitMargin: { type: Number }, // percentage
    financialDocuments: [{
      name: { type: String },
      type: { type: String, enum: ['P&L', 'Balance Sheet', 'Tax Returns', 'Other'] },
      url: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  operations: {
    employeeCount: { type: Number, required: true },
    customerCount: { type: Number },
    suppliers: [String],
    keyCustomers: [String],
    businessHours: { type: String },
    seasonality: { type: String },
    competitiveAdvantages: [String],
    challenges: [String]
  },
  reasonForSelling: {
    type: String,
    enum: [
      'Retirement', 'Health Issues', 'New Opportunity', 'Relocation',
      'Partnership Dispute', 'Market Conditions', 'Succession Planning', 'Other'
    ],
    required: true
  },
  timeline: {
    preferredClosing: {
      type: String,
      enum: ['Immediate', '3-6 months', '6-12 months', '1-2 years', 'Flexible']
    },
    transitionPeriod: { type: Number }, // in months
    sellerFinancing: { type: Boolean, default: false },
    sellerFinancingTerms: { type: String }
  },
  assets: {
    realEstate: { type: Boolean, default: false },
    equipment: { type: Boolean, default: false },
    inventory: { type: Boolean, default: false },
    intellectualProperty: { type: Boolean, default: false },
    contracts: { type: Boolean, default: false },
    customerList: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'under_contract', 'sold', 'inactive'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite_only'],
    default: 'public'
  },
  metrics: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    matches: { type: Number, default: 0 }
  },
  documents: [{
    name: { type: String },
    type: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  photos: [{
    url: { type: String },
    caption: { type: String },
    isPrimary: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
sellerSchema.index({ 'business.industry': 1 });
sellerSchema.index({ 'financials.askingPrice': 1 });
sellerSchema.index({ 'business.location.country': 1, 'business.location.state': 1 });
sellerSchema.index({ status: 1, visibility: 1 });

// Virtual for business age
sellerSchema.virtual('businessAge').get(function() {
  if (this.business.founded) {
    return new Date().getFullYear() - this.business.founded;
  }
  return null;
});

// Ensure virtuals are serialized
sellerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Seller', sellerSchema);
