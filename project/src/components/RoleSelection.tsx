import type { FC } from 'react';

interface Props {
  onSelect: (role: 'customer' | 'vendor') => void;
}

export const RoleSelection: FC<Props> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Welcome to Food Ordering</h2>
          <p className="text-gray-600 mb-8">Please select your role to continue</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelect('customer')}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue as Customer
          </button>
          
          <button
            onClick={() => onSelect('vendor')}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Continue as Vendor
          </button>
        </div>
      </div>
    </div>
  );
}