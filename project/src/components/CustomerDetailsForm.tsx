import type { FC } from 'react';

interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

interface Props {
  details: CustomerDetails;
  onChange: (details: CustomerDetails) => void;
}

export const CustomerDetailsForm: FC<Props> = ({ details, onChange }) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={details.name}
          onChange={(e) => onChange({ ...details, name: e.target.value })}
          placeholder="Enter your full name"
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={details.phone}
          onChange={(e) => onChange({ ...details, phone: e.target.value })}
          placeholder="Enter your phone number"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Address
        </label>
        <textarea
          id="address"
          value={details.address}
          onChange={(e) => onChange({ ...details, address: e.target.value })}
          placeholder="Enter your complete delivery address"
          className="w-full p-2 border rounded-md"
          rows={3}
        />
      </div>
    </div>
  );
}