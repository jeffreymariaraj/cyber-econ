import React from 'react';
import type { RiskReport } from '../types';

interface RiskCardProps {
    report: RiskReport;
}

const RiskCard: React.FC<RiskCardProps> = ({ report }) => {
    // Determine color based on Exposure Factor (EF)
    const getSeverityColor = (ef: number) => {
        if (ef >= 0.9) return 'bg-red-600 text-white'; // Critical
        if (ef >= 0.6) return 'bg-orange-500 text-white'; // High
        if (ef >= 0.3) return 'bg-yellow-400 text-black'; // Medium
        return 'bg-green-500 text-white'; // Low
    };

    const getSeverityLabel = (ef: number) => {
        if (ef >= 0.9) return 'Critical';
        if (ef >= 0.6) return 'High';
        if (ef >= 0.3) return 'Medium';
        return 'Low';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const severityColor = getSeverityColor(report.exposure_factor);
    const severityLabel = getSeverityLabel(report.exposure_factor);

    return (
        <div className="bg-white shadow-xl rounded-lg p-6 max-w-2xl mx-auto mt-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Cyber-Economic Risk Report</h2>
            <p className="text-gray-500 mb-4">Asset: <span className="font-medium text-gray-800">{report.asset_name}</span></p>

            <div className={`rounded-xl p-8 text-center mb-6 transform transition-all hover:scale-105 ${severityColor}`}>
                <p className="text-lg font-medium opacity-90 uppercase tracking-wider mb-1">Potential Financial Loss</p>
                <div className="text-5xl font-bold tracking-tight">
                    {formatCurrency(report.financial_risk_exposure)}
                </div>
                <div className="mt-4 inline-block bg-black/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                    Severity: {severityLabel} (EF: {report.exposure_factor * 100}%)
                </div>
            </div>

            <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-600 border border-gray-200">
                <span className="font-bold">Why?</span> This estimate is based on the highest vulnerability found, which could impact up to <span className="font-semibold">{report.exposure_factor * 100}%</span> of this asset's value.
            </div>

            {report.vulnerabilities.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Detected Vulnerabilities</h3>
                    <ul className="space-y-2">
                        {report.vulnerabilities.map((vuln) => (
                            <li key={vuln.cve_id} className="border-l-4 border-red-400 bg-red-50 p-3 rounded-r-md">
                                <span className="font-mono text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded">{vuln.cve_id}</span>
                                <span className="ml-2 font-semibold text-gray-800">CVSS {vuln.severity}</span>
                                <p className="text-xs text-gray-600 mt-1">{vuln.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RiskCard;
