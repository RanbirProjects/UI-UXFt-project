import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home,
  Building2,
  Users,
  MessageSquare,
  FileText,
  Settings,
  BarChart3,
  Target,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const buyerNavItems = [
    { name: 'Dashboard', href: '/buyer', icon: <Home className="w-5 h-5" /> },
    { name: 'Browse Businesses', href: '/buyer/browse', icon: <Building2 className="w-5 h-5" /> },
    { name: 'My Matches', href: '/matches', icon: <Target className="w-5 h-5" /> },
    { name: 'My Deals', href: '/deals', icon: <CheckCircle className="w-5 h-5" /> },
    { name: 'Messages', href: '/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Documents', href: '/documents', icon: <FileText className="w-5 h-5" /> },
    { name: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const sellerNavItems = [
    { name: 'Dashboard', href: '/seller', icon: <Home className="w-5 h-5" /> },
    { name: 'Browse Buyers', href: '/seller/browse', icon: <Users className="w-5 h-5" /> },
    { name: 'My Matches', href: '/matches', icon: <Target className="w-5 h-5" /> },
    { name: 'My Deals', href: '/deals', icon: <CheckCircle className="w-5 h-5" /> },
    { name: 'Messages', href: '/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Documents', href: '/documents', icon: <FileText className="w-5 h-5" /> },
    { name: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const commonNavItems = [
    { name: 'Profile', href: '/profile', icon: <Users className="w-5 h-5" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const navItems = user?.userType === 'buyer' ? buyerNavItems : sellerNavItems;

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">BusinessMatch</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.profile.firstName} {user?.profile.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.userType}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-1">
                {commonNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-primary-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-primary-600" />
                <span className="text-xs font-medium text-primary-700">
                  {user?.userType === 'buyer' ? 'Looking for businesses?' : 'Looking for buyers?'}
                </span>
              </div>
              <p className="text-xs text-primary-600 mt-1">
                {user?.userType === 'buyer' 
                  ? 'Browse our curated selection of businesses for sale.'
                  : 'Connect with qualified buyers in your industry.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
