import React, { useState } from 'react';
import { ArrowLeft, Check, AlertCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MandateRequest {
    period: 'monthly' | 'quarterly' | 'yearly';
}

interface MandateResponse {
    status: string;
    code: number;
    data: any;
}

const Mandate: React.FC = () => {

    const navigate = useNavigate()
    const urlParams = new URLSearchParams(window.location.search);
    const basketId = urlParams.get('basketId');

    if (!basketId) {
        navigate('/dashboard')
    }


    // Form state
    const [automaticPayment, setAutomaticPayment] = useState(true);
    const [rebalancing, setRebalancing] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSetMandate = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const mandateData: MandateRequest = {

                period: rebalancing
            };

            const response = await fetch(`/api/investments/${basketId}/mandate/${rebalancing}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(mandateData),
            });

            if (!response.ok) {
                throw new Error(`Mandate setup failed: ${response.status}`);
            }

            const data: MandateResponse = await response.json();

            if (data.status === 'success') {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/dashboard')
                }, 2000);
            } else {
                throw new Error('Mandate setup failed');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to set up mandate');
            console.error('Error setting mandate:', err);
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Mandate Set Successfully!</h2>
                    <p className="text-gray-600 mb-4">
                        Your automatic payment and rebalancing preferences have been configured.
                    </p>
                    <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/* <div className="bg-slate-700 text-white p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                            <PieChart className="w-8 h-8" />
                            <span className="text-xl font-bold">Stock Baskets</span>
                        </div>
                        <nav className="flex space-x-6">
                            <a href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</a>
                            <a href="#" className="text-white font-medium">Profile</a>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="max-w-2xl mx-auto p-6">
                {/* Back Button */}
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Mandate</h1>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Set Mandate</h2>
                        <p className="text-gray-600">Set up automatic payments and rebalancing for your basket</p>
                    </div>

                    <div className="space-y-8">
                        {/* Automatic Payment Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Automatic Payment</h3>
                                <p className="text-sm text-gray-600 mt-1">Enable automatic payments for your subscriptions</p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setAutomaticPayment(!automaticPayment)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${automaticPayment ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${automaticPayment ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Rebalancing Frequency */}
                        <div className="space-y-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Rebalancing</h3>
                                <p className="text-sm text-gray-600 mt-1">Choose how often your portfolio should be rebalanced</p>
                            </div>

                            <div className="relative">
                                <select
                                    value={rebalancing}
                                    onChange={(e) => setRebalancing(e.target.value as 'monthly' | 'quarterly' | 'yearly')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg appearance-none bg-white pr-10"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">Mandate Setup Failed</p>
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Set Mandate Button */}
                        <button
                            onClick={handleSetMandate}
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Setting Up Mandate...
                                </>
                            ) : (
                                'Set Mandate'
                            )}
                        </button>

                        {/* Additional Information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">What this means:</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• <strong>Automatic Payment:</strong> Your subscription payments will be processed automatically</li>
                                <li>• <strong>Rebalancing:</strong> Your portfolio will be automatically rebalanced based on your selected frequency</li>
                                <li>• You can change these settings anytime from your profile</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mandate;