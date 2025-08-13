import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  DollarSign, 
  MapPin, 
  Users,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  Upload
} from 'lucide-react';
import { sellerAPI } from '../../services/api';

interface SellerOnboardingData {
  business: {
    name: string;
    industry: string;
    description: string;
    founded?: number;
    location: {
      address?: string;
      city: string;
      state: string;
      country: string;
      zipCode?: string;
    };
    website?: string;
    socialMedia?: {
      linkedin?: string;
      facebook?: string;
      instagram?: string;
    };
  };
  financials: {
    annualRevenue: number;
    annualProfit: number;
    cashFlow?: number;
    assets?: number;
    liabilities?: number;
    askingPrice: number;
    priceRange?: {
      min?: number;
      max?: number;
    };
    revenueGrowth?: number;
    profitMargin?: number;
  };
  operations: {
    employeeCount: number;
    customerCount?: number;
    suppliers?: string[];
    keyCustomers?: string[];
    businessHours?: string;
    seasonality?: string;
    competitiveAdvantages?: string[];
    challenges?: string[];
  };
  reasonForSelling: string;
  timeline: {
    preferredClosing?: string;
    transitionPeriod?: number;
    sellerFinancing?: boolean;
    sellerFinancingTerms?: string;
  };
  assets: {
    realEstate?: boolean;
    equipment?: boolean;
    inventory?: boolean;
    intellectualProperty?: boolean;
    contracts?: boolean;
    customerList?: boolean;
  };
}

const SellerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SellerOnboardingData>>({});
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SellerOnboardingData>();
  
  const onboardingMutation = useMutation(sellerAPI.completeOnboarding, {
    onSuccess: () => {
      toast.success('Business listing created successfully!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create business listing');
    }
  });

  const steps = [
    { id: 1, title: 'Business Overview', icon: <Building2 className="w-5 h-5" /> },
    { id: 2, title: 'Financial Information', icon: <DollarSign className="w-5 h-5" /> },
    { id: 3, title: 'Operations & Assets', icon: <Users className="w-5 h-5" /> },
    { id: 4, title: 'Selling Details', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 5, title: 'Timeline & Terms', icon: <Clock className="w-5 h-5" /> },
    { id: 6, title: 'Review & Publish', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Manufacturing', 'Retail', 'Food & Beverage',
    'Real Estate', 'Financial Services', 'Education', 'Transportation',
    'Energy', 'Media & Entertainment', 'Professional Services', 'Other'
  ];

  const reasonsForSelling = [
    'Retirement', 'Health Issues', 'New Opportunity', 'Relocation',
    'Partnership Dispute', 'Market Conditions', 'Succession Planning', 'Other'
  ];

  const closingTimelines = [
    'Immediate', '3-6 months', '6-12 months', '1-2 years', 'Flexible'
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: SellerOnboardingData) => {
    onboardingMutation.mutate(data);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Overview</h3>
              <p className="text-gray-600">Tell us about your business</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                {...register('business.name', { required: 'Business name is required' })}
                className="input"
                placeholder="Acme Corporation"
              />
              {errors.business?.name && (
                <p className="text-error-600 text-sm mt-1">{errors.business.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select {...register('business.industry', { required: 'Industry is required' })} className="input">
                <option value="">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              {errors.business?.industry && (
                <p className="text-error-600 text-sm mt-1">{errors.business.industry.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                {...register('business.description', { 
                  required: 'Business description is required',
                  minLength: { value: 50, message: 'Description must be at least 50 characters' }
                })}
                className="input"
                rows={4}
                placeholder="Describe your business, its history, products/services, market position, and growth potential..."
              />
              {errors.business?.description && (
                <p className="text-error-600 text-sm mt-1">{errors.business.description.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Founded
                </label>
                <input
                  type="number"
                  {...register('business.founded')}
                  className="input"
                  placeholder="2010"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  {...register('business.website')}
                  className="input"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <input
                type="text"
                {...register('business.location.address')}
                className="input"
                placeholder="123 Business St"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  {...register('business.location.city', { required: 'City is required' })}
                  className="input"
                  placeholder="San Francisco"
                />
                {errors.business?.location?.city && (
                  <p className="text-error-600 text-sm mt-1">{errors.business.location.city.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  {...register('business.location.state', { required: 'State is required' })}
                  className="input"
                  placeholder="California"
                />
                {errors.business?.location?.state && (
                  <p className="text-error-600 text-sm mt-1">{errors.business.location.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select {...register('business.location.country', { required: 'Country is required' })} className="input">
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
                {errors.business?.location?.country && (
                  <p className="text-error-600 text-sm mt-1">{errors.business.location.country.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  {...register('business.location.zipCode')}
                  className="input"
                  placeholder="94105"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Financial Information</h3>
              <p className="text-gray-600">Provide key financial metrics</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Revenue *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('financials.annualRevenue', { required: 'Annual revenue is required' })}
                    className="input pl-8"
                    placeholder="2,500,000"
                  />
                </div>
                {errors.financials?.annualRevenue && (
                  <p className="text-error-600 text-sm mt-1">{errors.financials.annualRevenue.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Profit *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('financials.annualProfit', { required: 'Annual profit is required' })}
                    className="input pl-8"
                    placeholder="450,000"
                  />
                </div>
                {errors.financials?.annualProfit && (
                  <p className="text-error-600 text-sm mt-1">{errors.financials.annualProfit.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cash Flow
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('financials.cashFlow')}
                    className="input pl-8"
                    placeholder="380,000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asking Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('financials.askingPrice', { required: 'Asking price is required' })}
                    className="input pl-8"
                    placeholder="3,200,000"
                  />
                </div>
                {errors.financials?.askingPrice && (
                  <p className="text-error-600 text-sm mt-1">{errors.financials.askingPrice.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Assets
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('financials.assets')}
                    className="input pl-8"
                    placeholder="1,500,000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Liabilities
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('financials.liabilities')}
                    className="input pl-8"
                    placeholder="300,000"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Growth Rate (%)
                </label>
                <input
                  type="number"
                  {...register('financials.revenueGrowth')}
                  className="input"
                  placeholder="15"
                  min="-100"
                  max="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profit Margin (%)
                </label>
                <input
                  type="number"
                  {...register('financials.profitMargin')}
                  className="input"
                  placeholder="18"
                  min="-100"
                  max="100"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Operations & Assets</h3>
              <p className="text-gray-600">Tell us about your operations and what's included</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees *
              </label>
              <input
                type="number"
                {...register('operations.employeeCount', { required: 'Employee count is required' })}
                className="input"
                placeholder="25"
                min="1"
              />
              {errors.operations?.employeeCount && (
                <p className="text-error-600 text-sm mt-1">{errors.operations.employeeCount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Customers
              </label>
              <input
                type="number"
                {...register('operations.customerCount')}
                className="input"
                placeholder="500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Hours
              </label>
              <input
                type="text"
                {...register('operations.businessHours')}
                className="input"
                placeholder="Monday-Friday 9AM-6PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seasonality
              </label>
              <input
                type="text"
                {...register('operations.seasonality')}
                className="input"
                placeholder="e.g., Q4 peak season, Summer slowdown"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Customers (Optional)
              </label>
              <textarea
                {...register('operations.keyCustomers')}
                className="input"
                rows={3}
                placeholder="List major customers or client types..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Competitive Advantages
              </label>
              <textarea
                {...register('operations.competitiveAdvantages')}
                className="input"
                rows={3}
                placeholder="What makes your business unique? (e.g., proprietary technology, exclusive contracts, brand recognition)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Challenges
              </label>
              <textarea
                {...register('operations.challenges')}
                className="input"
                rows={3}
                placeholder="What challenges is the business currently facing? (e.g., staffing, competition, market changes)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Assets Included in Sale
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { key: 'realEstate', label: 'Real Estate' },
                  { key: 'equipment', label: 'Equipment & Machinery' },
                  { key: 'inventory', label: 'Inventory' },
                  { key: 'intellectualProperty', label: 'Intellectual Property' },
                  { key: 'contracts', label: 'Contracts & Agreements' },
                  { key: 'customerList', label: 'Customer Database' }
                ].map(asset => (
                  <label key={asset.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register(`assets.${asset.key}`)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{asset.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Selling Details</h3>
              <p className="text-gray-600">Why are you selling and what are you looking for?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Reason for Selling *
              </label>
              <select {...register('reasonForSelling', { required: 'Reason for selling is required' })} className="input">
                <option value="">Select reason</option>
                {reasonsForSelling.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              {errors.reasonForSelling && (
                <p className="text-error-600 text-sm mt-1">{errors.reasonForSelling.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <textarea
                {...register('reasonForSelling')}
                className="input"
                rows={4}
                placeholder="Provide more context about why you're selling and what you're looking for in a buyer..."
              />
            </div>

            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-sm text-primary-700">
                💡 Tip: Being transparent about your reasons for selling helps attract the right buyers and builds trust.
              </p>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Timeline & Terms</h3>
              <p className="text-gray-600">What's your preferred timeline and terms?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Closing Timeline
              </label>
              <select {...register('timeline.preferredClosing')} className="input">
                <option value="">Select timeline</option>
                {closingTimelines.map(timeline => (
                  <option key={timeline} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transition Period (months)
              </label>
              <input
                type="number"
                {...register('timeline.transitionPeriod')}
                className="input"
                placeholder="3"
                min="0"
                max="24"
              />
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register('timeline.sellerFinancing')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Open to Seller Financing
                </span>
              </label>
            </div>

            {watch('timeline.sellerFinancing') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Financing Terms
                </label>
                <textarea
                  {...register('timeline.sellerFinancingTerms')}
                  className="input"
                  rows={3}
                  placeholder="Describe your seller financing terms (e.g., 20% down, 5-year term, 6% interest)..."
                />
              </div>
            )}
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Listing</h3>
              <p className="text-gray-600">Please review your business information before publishing</p>
            </div>
            
            <div className="card p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Business Information</h4>
                  <p className="text-gray-600">{watch('business.name')} - {watch('business.industry')}</p>
                  <p className="text-gray-600">{watch('business.location.city')}, {watch('business.location.state')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Financial Summary</h4>
                  <p className="text-gray-600">Revenue: ${watch('financials.annualRevenue')?.toLocaleString()}</p>
                  <p className="text-gray-600">Profit: ${watch('financials.annualProfit')?.toLocaleString()}</p>
                  <p className="text-gray-600">Asking Price: ${watch('financials.askingPrice')?.toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Operations</h4>
                  <p className="text-gray-600">{watch('operations.employeeCount')} employees</p>
                  <p className="text-gray-600">Reason for selling: {watch('reasonForSelling')}</p>
                </div>
              </div>
            </div>

            <div className="bg-success-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <p className="text-success-700 font-medium">Ready to attract qualified buyers!</p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={onboardingMutation.isLoading}
                  className="btn-success"
                >
                  {onboardingMutation.isLoading ? 'Publishing...' : 'Publish Listing'}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding;
