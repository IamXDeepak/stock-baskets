import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { Smartphone, ArrowRight, Check, Shield } from 'lucide-react';

const Login: React.FC = () => {
    const [step, setStep] = useState<1 | 2>(1); // Add step state
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [receivedOtp, setReceivedOtp] = useState(''); // Store received OTP for display
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    // Updated handleLogin function to call send-otp endpoint
    const handleSendOtp = async () => {
        if (mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authApi.sendOtp({
                mobile: mobile
            });

            if (response.data.status === 'success') {
                // Display the OTP (since this is mock)
                const otpFromApi = response.data.data[0].otp;
                setReceivedOtp(otpFromApi);
                setStep(2); // Move to OTP verification step
            }
        } catch (error: any) {
            setError(error.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // New function to handle OTP verification
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authApi.verifyOtp({
                mobile: mobile,
                otp: otp
            });

            if (response.data.status === 'success') {
                const accessToken = response.data.data[0].accessToken;

                // Store token for future use
                localStorage.setItem('token', accessToken);

                // Create user data (you might want to call a profile endpoint here)
                const userData = {
                    id: '1', // You might get this from a profile API call
                    name: 'User', // You might get this from a profile API call
                    email: '', // You might get this from a profile API call
                    mobile: mobile,
                };

                login(userData);
                navigate(from, { replace: true });
            }
        } catch (error: any) {
            setError(error.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
                        {step === 1 ? <Smartphone className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-white" />}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {step === 1 ? 'Welcome Back' : 'Verify OTP'}
                    </h1>
                    <p className="text-gray-600">
                        {step === 1
                            ? 'Enter your mobile number to continue'
                            : `We've sent OTP to ${mobile}`
                        }
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {step === 1 ? (
                        // Mobile number step
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    id="mobile"
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="Enter 10-digit mobile number"
                                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg outline-none"
                                    maxLength={10}
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-xl">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSendOtp}
                                disabled={loading || mobile.length !== 10}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Send OTP
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        // OTP verification step
                        <div className="space-y-6">
                            {/* Display received OTP for testing */}
                            {receivedOtp && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                                    <p className="text-sm text-yellow-800 mb-1">Mock OTP (for testing):</p>
                                    <p className="text-2xl font-bold text-yellow-900">{receivedOtp}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg outline-none text-center tracking-widest"
                                    maxLength={6}
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-xl">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading || otp.length !== 6}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Verify & Login
                                        <Check className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    setStep(1);
                                    setOtp('');
                                    setReceivedOtp('');
                                    setError('');
                                }}
                                className="w-full text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors duration-200"
                            >
                                Change Mobile Number
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;