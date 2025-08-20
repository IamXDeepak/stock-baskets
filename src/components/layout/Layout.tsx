import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X, PieChart, Bell, Settings, User, ChevronDown } from 'lucide-react';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { logout, user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    const navigation: Array<any> = [
        // { name: 'Dashboard', href: '/dashboard', icon: Home },
        // { name: 'Subscribe', href: '/subscribe', icon: CreditCard },
        // { name: 'Mandate', href: '/mandate', icon: FileText },
    ];

    useEffect(() => {
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    const handleLogout = () => {
        logout();
    };

    const handleNavigation = (href: string) => {
        window.location.href = href;
        setMobileMenuOpen(false);
    };

    const isActive = (href: string) => {
        return currentPath === href || (href === '/subscribe' && currentPath.includes('/subscribe'));
    };

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuOpen) {
                const target = event.target as HTMLElement;
                if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
                    setMobileMenuOpen(false);
                }
            }
            if (userMenuOpen) {
                const target = event.target as HTMLElement;
                if (!target.closest('.user-menu') && !target.closest('.user-menu-button')) {
                    setUserMenuOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen, userMenuOpen]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Horizontal Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <PieChart className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Stock Baskets</h1>
                                <h1 className="text-lg font-bold text-gray-900 sm:hidden">SB</h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigation.length > 0 && navigation.map((item) => {
                                const isCurrentActive = isActive(item.href);
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigation(item.href)}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isCurrentActive
                                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 mr-2 ${isCurrentActive ? 'text-blue-600' : 'text-gray-500'
                                            }`} />
                                        {item.name}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-4">

                            {/* Notifications */}
                            <button className="hidden sm:flex p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                <Bell className="w-5 h-5" />
                            </button>

                            {/* Settings */}
                            <button className="hidden sm:flex p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                <Settings className="w-5 h-5" />
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="user-menu-button flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate max-w-32">
                                            {user?.email || user?.mobile || 'Welcome!'}
                                        </p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''
                                        }`} />
                                </button>

                                {/* User Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="user-menu absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500">{user?.email || user?.mobile || 'Welcome back!'}</p>
                                        </div>

                                        <div className="py-2">
                                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                                <User className="w-4 h-4 mr-3 text-gray-500" />
                                                Profile
                                            </button>
                                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                                <Settings className="w-4 h-4 mr-3 text-gray-500" />
                                                Settings
                                            </button>
                                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                                <Bell className="w-4 h-4 mr-3 text-gray-500" />
                                                Notifications
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-100 py-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="mobile-menu-button md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu md:hidden bg-white border-t border-gray-200 shadow-lg">
                        <div className="px-4 py-4 space-y-2">
                            {navigation.map((item) => {
                                const isCurrentActive = isActive(item.href);
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigation(item.href)}
                                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isCurrentActive
                                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 mr-3 ${isCurrentActive ? 'text-blue-600' : 'text-gray-500'
                                            }`} />
                                        {item.name}
                                    </button>
                                );
                            })}

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                    <Bell className="w-5 h-5 mr-3 text-gray-500" />
                                    Notifications
                                </button>
                                <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                    <Settings className="w-5 h-5 mr-3 text-gray-500" />
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="min-h-screen">
                {/* {children || (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Stock Baskets</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                This is your main content area. The actual page content will be rendered here based on the current route.
                                Use this layout component and pass your page content as children.
                            </p>
                        </div>
                    </div>
                )} */}
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation (Alternative) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
                <div className="flex items-center justify-around py-2">
                    {navigation.map((item) => {
                        const isCurrentActive = isActive(item.href);
                        return (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.href)}
                                className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 text-xs font-medium transition-colors duration-200 ${isCurrentActive
                                    ? 'text-blue-600'
                                    : 'text-gray-500'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 mb-1 ${isCurrentActive ? 'text-blue-600' : 'text-gray-500'
                                    }`} />
                                <span className="truncate">{item.name}</span>
                                {isCurrentActive && (
                                    <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Layout;