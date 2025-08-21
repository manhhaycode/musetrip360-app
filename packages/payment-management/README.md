# 🔐 Authentication Management Package

A comprehensive, production-ready authentication modal system for the MuseTrip360 platform. Built with React, TypeScript, Zod validation, and shadcn/ui components.

## ✨ Features

- **🎯 Complete Auth Flow**: Login, registration, password reset with OTP verification
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔒 Robust Validation**: Zod schemas with comprehensive password strength checking
- **♿ Accessibility**: Full ARIA support, keyboard navigation, screen reader friendly
- **🎨 Modern UI**: Clean design using shadcn/ui components with smooth animations
- **🚀 Easy Integration**: Simple hooks and components for quick implementation
- **📊 Real-time Feedback**: Live password strength indicators and form validation
- **🔄 State Management**: Integrated with existing authentication APIs
- **🎭 Customizable**: Flexible props for different use cases and branding

## 🚀 Quick Start

### Basic Usage

```tsx
import { useAuthModalConnector } from '@musetrip360/auth-management';

function MyApp() {
  const { openModal, AuthModal } = useAuthModalConnector();

  return (
    <div>
      <button onClick={() => openModal('login')}>Sign In</button>
      <button onClick={() => openModal('register')}>Register</button>

      <AuthModal
        onLoginSuccess={(user) => console.log('User logged in:', user)}
        onRegisterSuccess={(user) => console.log('User registered:', user)}
        onPasswordResetSuccess={() => console.log('Password reset!')}
      />
    </div>
  );
}
```

### Advanced Usage with Custom Callbacks

```tsx
import { useAuthModalConnector } from '@musetrip360/auth-management';

function AdvancedExample() {
  const { openModal, AuthModal } = useAuthModalConnector();
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? <div>Welcome, {user.name}!</div> : <button onClick={() => openModal('login')}>Sign In</button>}

      <AuthModal
        onLoginSuccess={(userData) => {
          setUser(userData);
          // Custom success handling
          localStorage.setItem('lastLogin', new Date().toISOString());
          // Analytics tracking
          trackEvent('user_login', { method: 'email' });
        }}
        onRegisterSuccess={(userData) => {
          setUser(userData);
          // Show onboarding
          showOnboardingFlow();
        }}
        onPasswordResetSuccess={() => {
          showNotification('Password reset successfully!');
        }}
        onAuthSuccess={(step) => {
          console.log('Auth step completed:', step);
        }}
        onStepChange={(step) => {
          // Track step changes for analytics
          trackEvent('auth_step_change', { step });
        }}
        // Pre-fill form with remembered data
        loginDefaults={{
          email: localStorage.getItem('rememberedEmail') || '',
          rememberMe: true,
        }}
        showCloseButton={true}
      />
    </div>
  );
}
```

## 📚 API Reference

### `useAuthModalConnector()`

Returns an object with:

- `isOpen: boolean` - Current modal state
- `currentStep: AuthModalStep` - Current form step
- `openModal: (step?: AuthModalStep) => void` - Open modal at specific step
- `closeModal: () => void` - Close the modal
- `setStep: (step: AuthModalStep) => void` - Change current step
- `AuthModal: React.Component` - Connected modal component

### `AuthModal` Props

```tsx
interface AuthModalProps {
  // Success callbacks
  onLoginSuccess?: (user: any) => void;
  onRegisterSuccess?: (user: any) => void;
  onPasswordResetSuccess?: () => void;

  // Event callbacks
  onAuthSuccess?: (step: AuthModalStep) => void;
  onStepChange?: (step: AuthModalStep) => void;
  onClose?: () => void;

  // Modal customization
  title?: string;
  description?: string;
  showCloseButton?: boolean;

  // Form defaults
  loginDefaults?: Partial<LoginFormData>;
  registerDefaults?: Partial<RegisterFormData>;
}
```

### Form Data Types

```tsx
// Login form data
interface LoginFormData {
  email: string;
  password: string;
  authType: AuthTypeEnum;
  redirect?: string;
  firebaseToken?: string;
  rememberMe: boolean;
}

// Registration form data
interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

// Password reset form data
interface ResetPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}
```

## 🎨 Styling & Theming

The package includes pre-built CSS with smooth animations and responsive design:

```css
/* Custom CSS classes included */
.auth-modal-content      /* Modal entrance animations */
.auth-step-transition    /* Step change animations */
.auth-error             /* Error message animations */
.auth-success           /* Success message animations */
.password-strength-indicator /* Password strength transitions */
.password-toggle        /* Password visibility toggle effects */
.auth-modal-scroll      /* Custom scrollbar for mobile */
```

### Customizing Styles

Override CSS classes or use Tailwind utilities:

```tsx
<AuthModal
  className="custom-auth-modal"
  // ... other props
/>
```

## 🔧 Integration with Different Apps

### 1. Visitor Portal (Next.js)

```tsx
// In your Next.js layout or page
import { useAuthModalConnector } from '@musetrip360/auth-management';

export default function Layout({ children }) {
  const { openModal, AuthModal } = useAuthModalConnector();

  return (
    <div>
      <nav>
        <button onClick={() => openModal('login')}>Sign In</button>
        <button onClick={() => openModal('register')}>Join</button>
      </nav>

      {children}

      <AuthModal
        onLoginSuccess={(user) => {
          // Redirect to user dashboard
          router.push('/dashboard');
        }}
        onRegisterSuccess={(user) => {
          // Show welcome tour
          startOnboarding();
        }}
      />
    </div>
  );
}
```

### 2. Museum Dashboard

```tsx
// For staff authentication
import { useAuthModalConnector } from '@musetrip360/auth-management';

function StaffLogin() {
  const { openModal, AuthModal } = useAuthModalConnector();

  return (
    <AuthModal
      onLoginSuccess={(user) => {
        // Role-based redirect
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/staff-dashboard');
        }
      }}
      loginDefaults={{
        email: '',
        authType: AuthTypeEnum.Email,
      }}
    />
  );
}
```

### 3. Protected Routes

```tsx
import { useAuthModalConnector } from '@musetrip360/auth-management';

function ProtectedRoute({ children }) {
  const { openModal, AuthModal } = useAuthModalConnector();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      openModal('login');
    } else {
      setIsAuthenticated(true);
    }
  }, [openModal]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1>Access Required</h1>
          <p>Please sign in to access this content.</p>

          <AuthModal
            onLoginSuccess={() => setIsAuthenticated(true)}
            onRegisterSuccess={() => setIsAuthenticated(true)}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

## 🔐 Security Features

- **Password Strength Validation**: Real-time feedback with comprehensive rules
- **Rate Limiting Support**: Built-in cooldown for OTP requests
- **Input Sanitization**: Automatic XSS protection via Zod validation
- **CSRF Protection**: Compatible with CSRF tokens
- **Secure Defaults**: Following security best practices

## ♿ Accessibility

- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard support including tab order
- **Screen Reader Support**: Descriptive text for assistive technologies
- **Focus Management**: Proper focus handling during step transitions
- **Color Contrast**: Meets WCAG 2.1 AA standards

## 📱 Mobile Optimization

- **Touch-Friendly**: Optimized button sizes and spacing
- **Responsive Design**: Adapts to all screen sizes
- **Custom Scrollbar**: Smooth scrolling on mobile devices
- **Fast Animations**: 60fps animations with hardware acceleration

## 🧪 Testing

The package includes comprehensive test fixtures and helpers:

```tsx
import { mockLoginUser, mockRegisterUser, createAuthModalWrapper } from '@musetrip360/auth-management/testing';

// Test utilities available for unit testing
```

## 🔄 State Management

The authentication modal integrates seamlessly with the existing auth state:

- **Zustand Integration**: Works with existing auth stores
- **React Query**: Leverages existing API hooks
- **Error Handling**: Comprehensive error messages and recovery
- **Loading States**: Built-in loading and pending states

## 📦 Dependencies

- `react` ^18.0.0
- `react-hook-form` ^7.45.0
- `@hookform/resolvers` ^3.1.0
- `zod` ^3.21.0
- `lucide-react` ^0.263.0
- `@musetrip360/ui-core` (internal)

## 🚀 Performance

- **Code Splitting**: Components lazy-loaded for optimal bundle size
- **Optimized Re-renders**: Minimal re-renders with proper memoization
- **Small Bundle**: Tree-shakeable exports
- **Fast Validation**: Efficient Zod schema validation

## 📈 Analytics Integration

Track user authentication behavior:

```tsx
<AuthModal
  onStepChange={(step) => {
    analytics.track('auth_step_viewed', { step });
  }}
  onLoginSuccess={(user) => {
    analytics.identify(user.id, {
      email: user.email,
      name: user.name,
    });
    analytics.track('user_login', { method: 'email' });
  }}
  onRegisterSuccess={(user) => {
    analytics.track('user_register', {
      method: 'email',
      source: 'auth_modal',
    });
  }}
/>
```

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build package
pnpm build

# Type checking
pnpm type-check
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

For detailed contribution guidelines, see CONTRIBUTING.md.

---

Built with ❤️ for the MuseTrip360 platform.
