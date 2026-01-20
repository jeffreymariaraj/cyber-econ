import React, { useState } from 'react';
import type { Asset, AssetCreate, RiskReport } from '../types';
import { createAsset, triggerScan, getRiskReport } from '../services/api';
import AssetForm from '../components/AssetForm';
import RiskCard from '../components/RiskCard';
import RemediationPanel from '../components/RemediationPanel';

import RiskGraph from '../components/RiskGraph';

const Dashboard: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState<string | null>(null); // Asset ID being scanned
    const [remediationLoading, setRemediationLoading] = useState(false);
    const [report, setReport] = useState<RiskReport | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAddAsset = async (assetData: AssetCreate) => {
        try {
            setError(null);
            const newAsset = await createAsset(assetData);
            setAssets([...assets, newAsset]);
        } catch (err) {
            setError('Failed to create asset. Is backend running?');
            console.error(err);
        }
    };

    const handleScan = async (asset: Asset) => {
        setLoading(asset.id);
        setRemediationLoading(true);
        setError(null);
        setReport(null);
        try {
            // 1. Trigger Scan
            await triggerScan(asset.id);

            // 2. Poll or wait for report (Mock is instant-ish but let's wait a moment)
            // In real app, we'd poll status. Here we just fetch report after a delay.
            setTimeout(async () => {
                try {
                    const riskReport = await getRiskReport(asset.id);
                    setReport(riskReport);
                    setLoading(null);
                    setRemediationLoading(false);
                } catch (err) {
                    setError('Failed to fetch risk report.');
                    setLoading(null);
                    setRemediationLoading(false);
                    console.error(err);
                }
            }, 1000);

        } catch (err) {
            setError('Scan failed to start.');
            setLoading(null);
            setRemediationLoading(false);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Cyber-Econ Risk Quantifier</h1>
                    <p className="mt-2 text-lg text-gray-600">Translate vulnerabilities into financial impact.</p>
                </div>

                <AssetForm onAssetAdded={handleAddAsset} />

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {assets.length > 0 && (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 mb-8">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">Your Assets</h3>
                        </div>
                        <ul>
                            {assets.map((asset) => (
                                <li key={asset.id} className="border-b border-gray-100 last:border-b-0 px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">{asset.name}</p>
                                        <p className="text-sm text-gray-500">{asset.ip} • <span className="text-green-600 font-medium">₹{asset.value}</span></p>
                                    </div>
                                    <button
                                        onClick={() => handleScan(asset)}
                                        disabled={loading === asset.id}
                                        className={`px-4 py-2 rounded-md font-medium text-sm shadow-sm transition-all duration-200 ${loading === asset.id
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            }`}
                                    >
                                        {loading === asset.id ? 'Scanning...' : 'Scan & Quantify'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {report && (
                    <>
                        <RiskCard report={report} />
                        <RiskGraph report={report} />
                        <RemediationPanel plan={report.remediation_plan} isLoading={remediationLoading} />
                    </>
                )}
                {!report && remediationLoading && (
                    <RemediationPanel isLoading={true} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
