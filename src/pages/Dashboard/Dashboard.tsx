import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Types for the API response
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

interface BasketsResponse {
    status: string;
    code: number;
    count: number;
    data: Basket[];
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [baskets, setBaskets] = useState<Basket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBasket, setSelectedBasket] = useState<Basket | null>(null);

    useEffect(() => {
        fetchBaskets();
    }, []);

    const handleInvestClick = (basketId: string) => {
        // Navigate to subscribe page with basket ID
        window.location.href = `/subscribe?basketId=${basketId}`;
    };

    const fetchBaskets = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('/api/baskets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data: BasketsResponse = await response.json();

            if (data.status === 'success' && data.data) {
                setBaskets(data.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch baskets');
            console.error('Error fetching baskets:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTotalPortfolioValue = () => {
        return baskets.reduce((total, basket) => total + basket.currentValue, 0);
    };

    const getOverallChange = () => {
        if (baskets.length === 0) return 0;
        const totalValue = getTotalPortfolioValue();
        const weightedChange = baskets.reduce((sum, basket) => {
            const weight = basket.currentValue / totalValue;
            return sum + (basket.oneDayChangePct * weight);
        }, 0);
        return weightedChange;
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
        return `${sign}${percent.toFixed(2)}%`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your portfolio...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                    <button
                        onClick={fetchBaskets}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const totalValue = getTotalPortfolioValue();
    const overallChange = getOverallChange();

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
                            <a href="#" className="text-white font-medium">Dashboard</a>
                            <a href="#" className="text-gray-300 hover:text-white">Baskets</a>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="max-w-7xl mx-auto p-6">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Hello, {user?.name || 'Investor'}!</p>
                </div>

                {/* Portfolio Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Total Portfolio Value</h2>
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-gray-900">{formatCurrency(totalValue)}</span>
                                <div className={`flex items-center space-x-1 ${overallChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {overallChange >= 0 ? (
                                        <ArrowUpRight className="w-5 h-5" />
                                    ) : (
                                        <ArrowDownRight className="w-5 h-5" />
                                    )}
                                    <span className="font-semibold">{formatPercentage(overallChange)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Today's Change</p>
                            <p className="text-lg font-semibold text-gray-700">
                                {formatCurrency(totalValue * (overallChange / 100))}
                            </p>
                        </div>
                    </div>

                    {/* Mini Chart Placeholder */}
                    <div className="h-20 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-end justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-200 opacity-30">
                            <svg className="w-full h-full" viewBox="0 0 400 80">
                                <path
                                    d="M0,60 Q100,40 200,45 T400,35"
                                    stroke="#3B82F6"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <path
                                    d="M0,60 Q100,40 200,45 T400,35 V80 H0 Z"
                                    fill="url(#gradient)"
                                    opacity="0.3"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex justify-between w-full px-4 pb-2 text-xs text-gray-500 relative z-10">
                            <span>1W</span>
                            <span>1M</span>
                            <span>6M</span>
                            <span>1Y</span>
                            <span className="font-medium">1Y</span>
                        </div>
                    </div>
                </div>

                {/* Show message if no baskets */}
                {baskets.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Baskets Found</h3>
                        <p className="text-gray-600">Your portfolio is empty. Start investing in some baskets!</p>
                    </div>
                ) : (
                    /* Baskets Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {baskets.map((basket) => (
                            <div
                                key={basket.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                onClick={() => setSelectedBasket(basket)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{basket.name}</h3>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(basket.risk)}`}>
                                            {basket.risk} Risk
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className={`flex items-center space-x-1 ${basket.oneDayChangePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {basket.oneDayChangePct >= 0 ? (
                                                <TrendingUp className="w-4 h-4" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4" />
                                            )}
                                            <span className="font-semibold text-sm">{formatPercentage(basket.oneDayChangePct)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(basket.currentValue)}</p>
                                    <p className="text-sm text-gray-600">{basket.description}</p>
                                </div>

                                {/* Top Holdings Preview */}
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Top Holdings:</p>
                                    <div className="space-y-1">
                                        {basket.holdings.slice(0, 3).map((holding) => (
                                            <div key={holding.symbol} className="flex items-center justify-between text-xs">
                                                <span className="text-gray-600">{holding.symbol}</span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-500">{(holding.weight * 100).toFixed(0)}%</span>
                                                    <span className={`${holding.changePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatPercentage(holding.changePct)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInvestClick(basket.id);
                                    }}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                                >
                                    Invest
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Basket Detail Modal */}
                {selectedBasket && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedBasket.name}</h2>
                                        <p className="text-gray-600">{selectedBasket.description}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedBasket(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-1">Current Value</p>
                                        <p className="text-xl font-bold">{formatCurrency(selectedBasket.currentValue)}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-1">Day Change</p>
                                        <p className={`text-xl font-bold ${selectedBasket.oneDayChangePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatPercentage(selectedBasket.oneDayChangePct)}
                                        </p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-4">Holdings</h3>
                                <div className="space-y-3">
                                    {selectedBasket.holdings.map((holding) => (
                                        <div key={holding.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-gray-900">{holding.symbol}</p>
                                                <p className="text-sm text-gray-600">{holding.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${holding.price.toFixed(2)}</p>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500">{(holding.weight * 100).toFixed(1)}%</span>
                                                    <span className={`text-sm font-medium ${holding.changePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatPercentage(holding.changePct)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex space-x-3">
                                    <button
                                        onClick={() => handleInvestClick(selectedBasket.id)}
                                        className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        Invest in {selectedBasket.name}
                                    </button>
                                    <button
                                        onClick={() => setSelectedBasket(null)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;