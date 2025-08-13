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
  Target,
  Clock,
  Users,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { buyerAPI } from '../../services/api';

interface BuyerOnboardingData {
  investmentRange: {
    min: number;
    max: number;
  };
  preferredIndustries: string[];
  preferredLocations: Array<{
    country: string;
    state?: string;
    city?: string;
  }>;
  dealSize: string;
  investmentType: string[];
  timeHorizon: string;
  yearsInBusiness?: number;
  industryExperience: string[];
  teamSize?: number;
  liquidCapital?: number;
  financingPreference: string;
  mustHave: string[];
  niceToHave: string[];
  dealBreakers: string[];
  minimumRevenue?: number;
  minimumProfit?: number;
}

const BuyerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BuyerOnboardingData>>({});
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BuyerOnboardingData>();
  
  const onboardingMutation = useMutation(buyerAPI.completeOnboarding, {
    onSuccess: () => {
      toast.success('Onboarding completed successfully!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to complete onboarding');
    }
  });

  const steps = [
    { id: 1, title: 'Investment Profile', icon: <DollarSign className="w-5 h-5" /> },
    { id: 2, title: 'Industry Preferences', icon: <Building2 className="w-5 h-5" /> },
    { id: 3, title: 'Geographic Focus', icon: <MapPin className="w-5 h-5" /> },
    { id: 4, title: 'Experience & Capacity', icon: <Users className="w-5 h-5" /> },
    { id: 5, title: 'Deal Criteria', icon: <Target className="w-5 h-5" /> },
    { id: 6, title: 'Review & Complete', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Manufacturing', 'Retail', 'Food & Beverage',
    'Real Estate', 'Financial Services', 'Education', 'Transportation',
    'Energy', 'Media & Entertainment', 'Professional Services', 'Other'
  ];

  const dealSizes = ['<$1M', '$1M-$5M', '$5M-$10M', '$10M-$25M', '$25M-$50M', '$50M+'];
  const investmentTypes = ['Full Acquisition', 'Majority Stake', 'Minority Stake', 'Partnership'];
  const timeHorizons = ['Immediate', '3-6 months', '6-12 months', '1-2 years', '2+ years'];
  const financingOptions = ['Cash', 'SBA Loan', 'Bank Financing', 'Seller Financing', 'Combination'];

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

  const onSubmit = (data: BuyerOnboardingData) => {
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Range</h3>
              <p className="text-gray-600">What's your target investment range?</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Investment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('investmentRange.min', { required: 'Minimum investment is required' })}
                    className="input pl-8"
                    placeholder="1,000,000"
                  />
                </div>
                {errors.investmentRange?.min && (
                  <p className="text-error-600 text-sm mt-1">{errors.investmentRange.min.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Investment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('investmentRange.max', { required: 'Maximum investment is required' })}
                    className="input pl-8"
                    placeholder="5,000,000"
                  />
                </div>
                {errors.investmentRange?.max && (
                  <p className="text-error-600 text-sm mt-1">{errors.investmentRange.max.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Deal Size
              </label>
              <select {...register('dealSize', { required: 'Deal size is required' })} className="input">
                <option value="">Select deal size</option>
                {dealSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {errors.dealSize && (
                <p className="text-error-600 text-sm mt-1">{errors.dealSize.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Type
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {investmentTypes.map(type => (
                  <label key={type} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      value={type}
                      {...register('investmentType', { required: 'At least one investment type is required' })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
              {errors.investmentType && (
                <p className="text-error-600 text-sm mt-1">{errors.investmentType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Horizon
              </label>
              <select {...register('timeHorizon', { required: 'Time horizon is required' })} className="input">
                <option value="">Select time horizon</option>
                {timeHorizons.map(horizon => (
                  <option key={horizon} value={horizon}>{horizon}</option>
                ))}
              </select>
              {errors.timeHorizon && (
                <p className="text-error-600 text-sm mt-1">{errors.timeHorizon.message}</p>
              )}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Industry Preferences</h3>
              <p className="text-gray-600">Which industries are you most interested in?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Industries (Select all that apply)
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {industries.map(industry => (
                  <label key={industry} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      value={industry}
                      {...register('preferredIndustries', { required: 'At least one industry is required' })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{industry}</span>
                  </label>
                ))}
              </div>
              {errors.preferredIndustries && (
                <p className="text-error-600 text-sm mt-1">{errors.preferredIndustries.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years in Business
              </label>
              <input
                type="number"
                {...register('yearsInBusiness')}
                className="input"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Experience
              </label>
              <textarea
                {...register('industryExperience')}
                className="input"
                rows={3}
                placeholder="Describe your experience in specific industries..."
              />
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Geographic Focus</h3>
              <p className="text-gray-600">Where are you looking to invest?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select className="input">
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province (Optional)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="California"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City (Optional)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="San Francisco"
                />
              </div>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-sm text-primary-700">
                💡 Tip: You can add multiple locations. We'll match you with businesses in your preferred areas.
              </p>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Experience & Capacity</h3>
              <p className="text-gray-600">Tell us about your team and financial capacity</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Size
                </label>
                <input
                  type="number"
                  {...register('teamSize')}
                  className="input"
                  placeholder="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liquid Capital Available
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('liquidCapital')}
                    className="input pl-8"
                    placeholder="2,000,000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financing Preference
              </label>
              <select {...register('financingPreference')} className="input">
                <option value="">Select financing preference</option>
                {financingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Deal Criteria</h3>
              <p className="text-gray-600">What are your must-haves and deal-breakers?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Must-Have Criteria
              </label>
              <textarea
                {...register('mustHave')}
                className="input"
                rows={3}
                placeholder="e.g., Strong recurring revenue, Established customer base, Proven management team..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nice-to-Have Criteria
              </label>
              <textarea
                {...register('niceToHave')}
                className="input"
                rows={3}
                placeholder="e.g., Technology stack, Geographic location, Growth potential..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal-Breakers
              </label>
              <textarea
                {...register('dealBreakers')}
                className="input"
                rows={3}
                placeholder="e.g., Legal issues, Declining revenue, Key person dependency..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Annual Revenue
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('minimumRevenue')}
                    className="input pl-8"
                    placeholder="1,000,000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Annual Profit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('minimumProfit')}
                    className="input pl-8"
                    placeholder="200,000"
                  />
                </div>
              </div>
            </div>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Profile</h3>
              <p className="text-gray-600">Please review your information before completing</p>
            </div>
            
            <div className="card p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Investment Range</h4>
                  <p className="text-gray-600">${watch('investmentRange.min')?.toLocaleString()} - ${watch('investmentRange.max')?.toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Preferred Industries</h4>
                  <p className="text-gray-600">{watch('preferredIndustries')?.join(', ')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Deal Size</h4>
                  <p className="text-gray-600">{watch('dealSize')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Investment Type</h4>
                  <p className="text-gray-600">{watch('investmentType')?.join(', ')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Time Horizon</h4>
                  <p className="text-gray-600">{watch('timeHorizon')}</p>
                </div>
              </div>
            </div>

            <div className="bg-success-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <p className="text-success-700 font-medium">Ready to start matching with sellers!</p>
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
                  {onboardingMutation.isLoading ? 'Completing...' : 'Complete Onboarding'}
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

export default BuyerOnboarding;
