# Stock Baskets

A modern React-based investment platform that allows users to invest in curated stock baskets with automated subscription management. The application provides real-time portfolio tracking, OTP-based authentication, and comprehensive investment management features.

## 🚀 Features

- **OTP Authentication**: Secure mobile-based login with OTP verification
- **Stock Basket Investment**: Browse and invest in professionally curated stock baskets
- **Subscription Management**: Set up recurring investments (daily, weekly, monthly)
- **Portfolio Dashboard**: Real-time tracking of investments and performance
- **Interactive Charts**: Visual performance tracking with Recharts integration
- **Mandate Management**: Automated payment and rebalancing setup
- **Risk-based Filtering**: Filter baskets by risk levels (Low, Medium, High)
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Data**: Live stock prices and portfolio updates

## 🛠️ Tech Stack

- **Frontend**: React 19+ with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 4.x
- **Routing**: React Router DOM 7.x
- **Charts**: Recharts 3.x
- **Icons**: Lucide React
- **State Management**: React Context API
- **API Client**: Custom Fetch-based interceptor

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 20.0 or higher)
- npm or yarn package manager
- Backend API server running (default: http://3.7.225.218:1337)

## 🏗️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/IamXDeepak/stock-baskets.git
   cd stock-baskets
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**

   ```bash
   # The application uses the backend API at http://3.7.225.218:1337
   # No additional environment variables are required for basic setup
   # API calls are proxied through Vite dev server
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🎯 Usage

### Authentication

1. **Login Process**
   - Enter your 10-digit mobile number
   - Click "Send OTP" to receive a verification code
   - Enter the 6-digit OTP to access your account
   - For testing, the OTP is displayed on screen in development mode

### Dashboard Overview

- **Portfolio Summary**: View total portfolio value and daily changes
- **My Investments**: Track your active investments with subscription details
- **Available Baskets**: Browse and invest in curated stock baskets
- **Risk Filtering**: Filter baskets by risk level (Low, Medium, High)

### Investing in Baskets

1. **Browse Available Baskets**

   - View basket performance, holdings, and risk levels
   - Click on any basket to see detailed information
   - Review top holdings and historical performance

2. **Subscribe to a Basket**

   - Click "Invest" on your chosen basket
   - Select subscription frequency (daily, weekly, monthly)
   - Choose number of units to purchase
   - Review subscription summary and confirm

3. **Set Up Mandate**
   - Configure automatic payment preferences
   - Choose rebalancing frequency (monthly, quarterly, yearly)
   - Confirm mandate settings

### Portfolio Management

- **Track Performance**: Monitor real-time portfolio value and changes
- **View Holdings**: See detailed breakdown of your investments
- **Manage Subscriptions**: Add more units or view subscription history
- **Investment Analytics**: Visual charts showing portfolio performance

## 📁 Project Structure

```
stock-baskets/
├── public/                    # Static assets
│   └── vite.svg
├── src/
│   ├── components/           # Reusable React components
│   │   └── layout/
│   │       └── Layout.tsx    # Main layout with header and navigation
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── hooks/               # Custom React hooks
│   │   └── useApi.ts        # API state management hook
│   ├── pages/               # Main page components
│   │   ├── Dashboard/       # Portfolio dashboard
│   │   ├── Login/           # OTP-based authentication
│   │   ├── Subscribe/       # Basket subscription flow
│   │   └── Mandate/         # Payment mandate setup
│   ├── routes/              # React Router configuration
│   │   ├── AppRoutes.tsx    # Main routing setup
│   │   ├── PrivateRoute.tsx # Protected route wrapper
│   │   └── PublicRoute.tsx  # Public route wrapper
│   ├── services/            # API service layer
│   │   └── api/
│   │       ├── auth.ts      # Authentication endpoints
│   │       ├── dashboard.ts # Portfolio and basket data
│   │       ├── subscription.ts # Investment subscriptions
│   │       ├── mandate.ts   # Payment mandates
│   │       ├── base.ts      # Base API service class
│   │       └── interceptors.ts # HTTP interceptors
│   ├── types/               # TypeScript type definitions
│   │   ├── api.ts           # API response types
│   │   └── auth.ts          # Authentication types
│   ├── config/              # Configuration files
│   │   └── api.ts           # API endpoints and config
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type checking
tsc -b               # TypeScript compilation check
```

## ⚙️ Configuration

### API Configuration

The application is configured to work with the backend API. Key configuration files:

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV ? "/api" : "http://3.7.225.218:1337",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://3.7.225.218:1337",
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

### Authentication

The app uses JWT tokens stored in localStorage:

- **Login**: OTP-based authentication via mobile number
- **Token Storage**: Access tokens are automatically managed
- **Auto Logout**: Users are logged out on token expiration

## 📊 API Integration

The application integrates with a backend REST API for all data operations:

### Authentication Endpoints

- **POST** `/send-otp` - Send OTP to mobile number
- **POST** `/verify-otp` - Verify OTP and get access token

### Dashboard & Portfolio

- **GET** `/baskets` - Get all available stock baskets
- **GET** `/basket/{id}` - Get specific basket details
- **GET** `/investments` - Get user's current investments

### Investment Management

- **POST** `/investments/{basketId}/subscribe` - Subscribe to a basket
- **POST** `/investments/{basketId}/mandate/{period}` - Set up payment mandate

### Chart Data

- **GET** `/baskets/{basketId}/chart/{period}` - Get historical performance data

### Error Handling

The app includes comprehensive error handling:

- **Network errors**: Automatic retry with exponential backoff
- **Authentication errors**: Auto-logout and redirect to login
- **API errors**: User-friendly error messages
- **Loading states**: Proper loading indicators throughout the app

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Use TypeScript for all new components and services
- Write meaningful commit messages
- Ensure all TypeScript checks pass before submitting PR
- Follow the established project structure
- Use the custom `useApi` hook for API calls
- Implement proper error handling and loading states

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Deepak** - [@IamXDeepak](https://github.com/IamXDeepak)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Recharts](https://recharts.org/) - Charts and data visualization
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [React Router](https://reactrouter.com/) - Client-side routing

## 📞 Support

If you have any questions or run into issues:

- 🐛 [Report Bugs](https://github.com/IamXDeepak/stock-baskets/issues)
- 💡 [Request Features](https://github.com/IamXDeepak/stock-baskets/issues)
- 📧 Contact: [your-email@example.com]

## 🔮 Roadmap

- [ ] Advanced portfolio analytics and insights
- [ ] Real-time notifications for market changes
- [ ] Social features for sharing investment strategies
- [ ] Mobile app development (React Native)
- [ ] Integration with additional stock exchanges
- [ ] AI-powered investment recommendations
- [ ] Tax reporting and document generation
- [ ] Advanced charting with technical indicators

## 🚀 Deployment

The application can be deployed to any static hosting service:

```bash
# Build for production
npm run build

# The dist/ folder contains the production build
# Deploy the contents to your hosting provider
```

Recommended hosting platforms:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

---

⭐ **Star this repository if you found it helpful!**

_Built with ❤️ using React, TypeScript, and modern web technologies_
