import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

export const AddressForm = ({ onCancel, onSaveSuccess }) => {
  const addAddress = useAuthStore((state) => state.addAddress);
  const addToast = useUIStore((state) => state.addToast);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home'
  });

  const [errors, setErrors] = useState({});

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Chandigarh'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit phone number required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Valid 6-digit pincode required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const newAddress = {
        id: `addr_${Date.now()}`,
        ...formData
      };
      
      // Attempt to save to store. If addAddress is not in store, we fallback to just onSuccess callback
      if (addAddress) {
        addAddress(newAddress);
      }
      
      addToast('Address saved successfully', 'success');
      if (onSaveSuccess) onSaveSuccess(newAddress);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.fullName ? 'border-rose-500' : 'border-gray-300'}`}
          />
          {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.phone ? 'border-rose-500' : 'border-gray-300'}`}
          />
          {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          placeholder="House/Flat No., Building, Street"
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.addressLine1 ? 'border-rose-500' : 'border-gray-300'}`}
        />
        {errors.addressLine1 && <p className="text-rose-500 text-xs mt-1">{errors.addressLine1}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          placeholder="Landmark, Area"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.city ? 'border-rose-500' : 'border-gray-300'}`}
          />
          {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.state ? 'border-rose-500' : 'border-gray-300'}`}
          >
            <option value="">Select State</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="text-rose-500 text-xs mt-1">{errors.state}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            maxLength="6"
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.pincode ? 'border-rose-500' : 'border-gray-300'}`}
          />
          {errors.pincode && <p className="text-rose-500 text-xs mt-1">{errors.pincode}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="type" value="Home" checked={formData.type === 'Home'} onChange={handleChange} className="text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-gray-700">Home</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="type" value="Work" checked={formData.type === 'Work'} onChange={handleChange} className="text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-gray-700">Work</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
          Save Address
        </button>
      </div>
    </form>
  );
};
