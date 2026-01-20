import React, { useState } from 'react';
import type { AssetCreate } from '../types';

interface AssetFormProps {
    onAssetAdded: (asset: AssetCreate) => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ onAssetAdded }) => {
    const [name, setName] = useState('');
    const [ip, setIp] = useState('');
    const [value, setValue] = useState<number | ''>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && ip && value) {
            onAssetAdded({ name, ip, value: Number(value) });
            setName('');
            setIp('');
            setValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Asset</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Billing Server"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                    <input
                        type="text"
                        placeholder="e.g. 192.168.1.5"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Value (₹)</label>
                    <input
                        type="number"
                        placeholder="e.g. 500000"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        required
                        min="0"
                    />
                </div>
            </div>
            <div className="mt-4 text-right">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors duration-200"
                >
                    Add Asset
                </button>
            </div>
        </form>
    );
};

export default AssetForm;
