import React, { useState } from 'react';
import type { Asset, AssetCreate, RiskReport } from '../types';
import { createAsset, triggerScan, getRiskReport, exportReport } from '../services/api';
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
    const [downloading, setDownloading] = useState(false);


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

    const handleDownload = async () => {
        if (!report) return;
        setDownloading(true);
        try {
            const blob = await exportReport(report.asset_id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Audit_Report_${report.asset_name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Download failed', err);
            setError('Failed to download PDF report.');
        } finally {
            setDownloading(false);
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
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                {downloading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating PDF...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                        </svg>
                                        Download Executive PDF
                                    </>
                                )}
                            </button>
                        </div>
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
