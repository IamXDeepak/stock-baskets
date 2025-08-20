import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import type { Investment, InvestmentsResponse } from '../../types/api';

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

type RiskFilter = 'All' | 'Low' | 'Medium' | 'High';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [baskets, setBaskets] = useState<Basket[]>([]);
    const [investments, setInvestments] = useState<Investment[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBasket, setSelectedBasket] = useState<Basket | null>(null);

    // Filter states
    const [basketRiskFilter, setBasketRiskFilter] = useState<RiskFilter>('All');
    const [investmentRiskFilter, setInvestmentRiskFilter] = useState<RiskFilter>('All');

    useEffect(() => {
        fetchInvestment()
        fetchBaskets();
    }, []);

    const handleInvestClick = (basketId: string) => {
        // Navigate to subscribe page with basket ID
        window.location.href = `/subscribe?basketId=${basketId}`;
    };

    const fetchInvestment = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('/api/investments', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data: InvestmentsResponse = await response.json();

            if (data.status === 'success' && data.data) {
                setInvestments(data.data);
            } else {
                throw new Error('Invalid response format');
            }

        } catch (err: any) {
            setError(err.message || 'Failed to fetch investment');
            console.error('Error fetching investment:', err);
        } finally {
            setLoading(false);
        }
    }

    const getBasketById = (basketId: string) => {
        return baskets.find(basket => basket.id === basketId);
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

    // Filter functions
    const getFilteredInvestments = () => {
        if (investmentRiskFilter === 'All') return investments;

        return investments.filter(investment => {
            const basket = getBasketById(investment.basketId);
            return basket && basket.risk === investmentRiskFilter;
        });
    };

    const getFilteredBaskets = () => {
        if (basketRiskFilter === 'All') return baskets;
        return baskets.filter(basket => basket.risk === basketRiskFilter);
    };

    // Risk Filter Component
    const RiskFilterSelector: React.FC<{
        currentFilter: RiskFilter;
        onFilterChange: (filter: RiskFilter) => void;
        label: string;
    }> = ({ currentFilter, onFilterChange, label }) => (
        <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>{label}:</span>
            </div>
            <div className="flex space-x-2">
                {(['All', 'Low', 'Medium', 'High'] as RiskFilter[]).map((risk) => (
                    <button
                        key={risk}
                        onClick={() => onFilterChange(risk)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${currentFilter === risk
                            ? risk === 'All'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : `${getRiskColorForFilter(risk)} border`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {risk}
                    </button>
                ))}
            </div>
        </div>
    );

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

    const getRiskColorForFilter = (risk: string) => {
        switch (risk) {
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
    const filteredInvestments = getFilteredInvestments();
    const filteredBaskets = getFilteredBaskets();

    return (
        <div className="min-h-screen bg-gray-50">
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

                </div>

                {/* My Investments Section */}
                {investments.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">My Investments</h2>
                            <span className="text-sm text-gray-500">{filteredInvestments.length} of {investments.length} investment{investments.length !== 1 ? 's' : ''}</span>
                        </div>

                        {/* Investment Risk Filter */}
                        <div className="mb-6">
                            <RiskFilterSelector
                                currentFilter={investmentRiskFilter}
                                onFilterChange={setInvestmentRiskFilter}
                                label="Filter by Risk"
                            />
                        </div>

                        {filteredInvestments.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Investments Found</h3>
                                <p className="text-gray-600">No investments match the selected risk filter.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredInvestments.map((investment) => {
                                    const basket = getBasketById(investment.basketId);
                                    if (!basket) return null;

                                    return (
                                        <div
                                            key={investment.basketId}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
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
                                                <div className="grid grid-cols-2 gap-4 mb-3">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Total Invested</p>
                                                        <p className="text-lg font-bold text-gray-900">{formatCurrency(investment.totalInvested)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Units Owned</p>
                                                        <p className="text-lg font-bold text-gray-900">{investment.units}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Active Subscriptions */}
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Active Subscriptions ({investment.subscriptions.length}):</p>
                                                <div className="space-y-1 max-h-24 overflow-y-auto">
                                                    {investment.subscriptions.map((subscription: any, index: number) => (
                                                        <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                                                            <span className="text-gray-600 capitalize">{subscription.period}</span>
                                                            <span className="font-medium">{subscription.units} units</span>
                                                            <span className="text-gray-500">{formatCurrency(subscription.amount)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleInvestClick(basket.id)}
                                                    className="flex-1 bg-green-50 text-green-700 py-2 px-4 rounded-lg font-semibold hover:bg-green-100 transition-colors duration-200 border border-green-200"
                                                >
                                                    Add More
                                                </button>
                                                <button
                                                    onClick={() => {/* Handle view details */ }}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Available Baskets Section */}
                {baskets.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Baskets Found</h3>
                        <p className="text-gray-600">Your portfolio is empty. Start investing in some baskets!</p>
                    </div>
                ) : (
                    <div className="mb-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Available Baskets</h2>
                            <span className="text-sm text-gray-500">{filteredBaskets.length} of {baskets.length} Available Basket{baskets.length !== 1 ? 's' : ''}</span>
                        </div>

                        {/* Basket Risk Filter */}
                        <div className="mb-6">
                            <RiskFilterSelector
                                currentFilter={basketRiskFilter}
                                onFilterChange={setBasketRiskFilter}
                                label="Filter by Risk"
                            />
                        </div>

                        {filteredBaskets.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Baskets Found</h3>
                                <p className="text-gray-600">No baskets match the selected risk filter.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredBaskets.map((basket) => (
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