import React from 'react';
import ReactMarkdown from 'react-markdown';

interface RemediationPanelProps {
    plan?: string;
    isLoading: boolean;
}

const RemediationPanel: React.FC<RemediationPanelProps> = ({ plan, isLoading }) => {
    if (isLoading) {
        return (
            <div className="mt-8 p-6 rounded-2xl bg-indigo-50/30 backdrop-blur-md border border-indigo-100 shadow-lg animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">✨</span>
                    <div className="h-6 w-48 bg-indigo-200 rounded"></div>
                </div>
                <div className="space-y-3">
                    <div className="h-4 bg-indigo-100 rounded w-full"></div>
                    <div className="h-4 bg-indigo-100 rounded w-5/6"></div>
                    <div className="h-4 bg-indigo-100 rounded w-4/6"></div>
                    <div className="mt-6 space-y-2">
                        <div className="h-10 bg-indigo-100 rounded w-full"></div>
                        <div className="h-10 bg-indigo-100 rounded w-full"></div>
                        <div className="h-10 bg-indigo-100 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!plan) return null;

    return (
        <div className="mt-8 p-6 rounded-2xl bg-indigo-50/50 backdrop-blur-lg border border-indigo-100 shadow-xl transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-xl animate-bounce">✨</span>
                <h3 className="text-xl font-bold text-indigo-900 tracking-tight">AI Remediation Strategy</h3>
                <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-indigo-600 text-white rounded-full animate-pulse">
                    Virtual CISO
                </span>
            </div>

            <div className="prose prose-indigo prose-sm max-w-none text-indigo-900/80">
                <ReactMarkdown
                    components={{
                        code({ className, children, ...props }) {
                            return (
                                <code
                                    className={`${className} bg-indigo-900 text-indigo-50 px-1.5 py-0.5 rounded text-xs font-mono`}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        },
                        pre({ children }) {
                            return (
                                <pre className="bg-indigo-900 text-indigo-50 p-4 rounded-xl overflow-x-auto my-4 shadow-inner">
                                    {children}
                                </pre>
                            );
                        },
                        ul({ children }) {
                            return <ul className="space-y-2 my-4 list-disc list-inside">{children}</ul>;
                        },
                        li({ children }) {
                            return <li className="marker:text-indigo-400">{children}</li>;
                        }
                    }}
                >
                    {plan}
                </ReactMarkdown>
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-200/50 flex items-center justify-between text-[11px] text-indigo-400 font-medium italic">
                <span>Tailored for your business assets & financial scale.</span>
                <span>Powered by Llama 3.3</span>
            </div>
        </div>
    );
};

export default RemediationPanel;
