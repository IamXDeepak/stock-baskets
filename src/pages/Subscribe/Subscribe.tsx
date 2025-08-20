import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { dashboardApi } from '../../services/api';
import { ArrowLeft, PieChart, TrendingUp, TrendingDown, Check, AlertCircle, ChevronDown } from 'lucide-react';

// Types for the API responses
interface Holding {
    symbol: string;
    name: string;
    weight: number;
    price: number;
    changePct: number;
}

interface Basket {
    id: string;
    name: string;
    risk: 'Low' | 'Medium' | 'High';
    label: string;
    oneDayChangePct: number;
    currentValue: number;
    description: string;
    holdings: Holding[];
}

interface SubscriptionRequest {
    period: 'daily' | 'weekly' | 'monthly';
    units: number;
}

const Subscribe: React.FC = () => {
    const { user } = useAuth();

    // Get basketId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const basketId = urlParams.get('basketId');

    // Form state
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
    const [units, setUnits] = useState<number>(10);
    const [success, setSuccess] = useState(false);

    // API calls using centralized structure
    const {
        data: basketData,
        loading: basketLoading,
        error: basketError,
        execute: fetchBasket
    } = useApi(() => dashboardApi.getBasketDetails(basketId!));

    const {
        loading: subscribing,
        error: subscribeError,
        execute: subscribeToBasket
    } = useApi((data: SubscriptionRequest) => dashboardApi.subscribeToBasket(basketId!, data));

    const basket = basketData?.data?.[0] || null;

    useEffect(() => {
        if (basketId) {
            fetchBasket();
        }
    }, [basketId]);

    const handleSubscribe = async () => {
        const subscriptionData: SubscriptionRequest = {
            period,
            units
        };

        const result = await subscribeToBasket(subscriptionData);

        if (result) {
            setSuccess(true);
            // Redirect to mandate page after 2 seconds
            setTimeout(() => {
                window.location.href = '/mandate';
            }, 2000);
        }
    };

    const getPeriodText = () => {
        switch (period) {
            case 'daily': return 'Daily';
            case 'weekly': return 'Weekly';
            case 'monthly': return 'Monthly';
            default: return 'Weekly';
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Low': return 'text-green-600 bg-green-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            case 'High': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercentage = (percent: number) => {
        const sign = percent >= 0 ? '+' : '';
        return `${sign}${percent.toFixed(1)}%`;
    };

    // Loading state
    if (basketLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading basket details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (basketError || !basketId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {basketError?.message || 'No basket ID provided'}
                    </div>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Successful!</h2>
                    <p className="text-gray-600 mb-4">
                        You've successfully subscribed to {basket?.name} with {getPeriodText().toLowerCase()} investments of {units} units.
                    </p>
                    <p className="text-sm text-gray-500">Redirecting to mandate management...</p>
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
                            <a href="#" className="text-white font-medium">Subscribe</a>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="max-w-4xl mx-auto p-6">
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscribe</h1>
                    <p className="text-gray-600">Set up your investment subscription</p>
                </div>

                {basket && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Basket Overview */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{basket.name}</h2>
                                    <div className="flex items-center space-x-3 mb-3">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(basket.risk)}`}>
                                            {basket.label}
                                        </span>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(basket.risk)}`}>
                                            {basket.risk}
                                        </span>
                                    </div>
                                    <div className={`flex items-center space-x-2 ${basket.oneDayChangePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {basket.oneDayChangePct >= 0 ? (
                                            <TrendingUp className="w-5 h-5" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5" />
                                        )}
                                        <span className="text-lg font-bold">{formatPercentage(basket.oneDayChangePct)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(basket.currentValue)}</p>
                                    <p className="text-sm text-gray-500">per unit</p>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6">{basket.description}</p>

                            {/* Top Holdings */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Holdings</h3>
                                <div className="space-y-2">
                                    {basket.holdings.slice(0, 4).map((holding) => (
                                        <div key={holding.symbol} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{holding.symbol}</p>
                                                <p className="text-sm text-gray-600">{holding.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{(holding.weight * 100).toFixed(1)}%</p>
                                                <p className={`text-sm ${holding.changePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatPercentage(holding.changePct)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Subscription Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to {basket.name}</h2>
                            <p className="text-gray-600 mb-8">Subscribe to the basket to invest regularly</p>

                            <div className="space-y-6">
                                {/* Recurring Payment Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recurring Payment</h3>

                                    {/* Frequency */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Frequency
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={period}
                                                onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg appearance-none bg-white"
                                            >
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Units */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Units
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="1000"
                                            value={units}
                                            onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                                            placeholder="Enter number of units"
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            {units} unit{units !== 1 ? 's' : ''} × {formatCurrency(basket.currentValue)} = {formatCurrency(basket.currentValue * units)} per {period.toLowerCase()} payment
                                        </p>
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-2">Subscription Summary</h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Basket:</span>
                                                <span className="font-medium">{basket.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Frequency:</span>
                                                <span className="font-medium">{getPeriodText()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Units per payment:</span>
                                                <span className="font-medium">{units}</span>
                                            </div>
                                            <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                                                <span className="text-gray-600">Amount per payment:</span>
                                                <span className="font-bold text-lg">{formatCurrency(basket.currentValue * units)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Error Display */}
                                {subscribeError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800">Subscription Failed</p>
                                            <p className="text-sm text-red-600">{subscribeError.message}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Subscribe Button */}
                                <button
                                    onClick={handleSubscribe}
                                    disabled={subscribing || units < 1}
                                    className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                                >
                                    {subscribing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Creating Subscription...
                                        </>
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    By subscribing, you agree to our terms and conditions. Your payment will be processed {getPeriodText().toLowerCase()}.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscribe;