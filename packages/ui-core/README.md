# MuseTrip360 UI Core

A comprehensive, accessible, and customizable UI component library built with TypeScript, React, and Tailwind CSS. Designed specifically for the MuseTrip360 platform but flexible enough for general use.

## 🎨 Features

- **Built with TypeScript** - Full type safety and excellent developer experience
- **Class Variance Authority (CVA)** - Type-safe component variants with consistent styling
- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **Accessibility First** - WCAG 2.1 AA compliant components with proper ARIA attributes
- **Customizable** - Extensive variant system for different use cases
- **Tree Shakeable** - Import only what you need
- **Consistent Design** - Follows MuseTrip360 design system tokens

## 📦 Installation

```bash
pnpm add @musetrip360/ui-core
```

## 🚀 Usage

### Basic Import

```tsx
import { Button, Input, Card, Badge, Select, Modal } from '@musetrip360/ui-core';

function App() {
  return (
    <div>
      <Button variant="primary" size="md">
        Click me
      </Button>
    </div>
  );
}
```

### With Utilities

```tsx
import { cn } from '@musetrip360/ui-core';

function CustomComponent() {
  return <div className={cn('base-classes', 'conditional-classes')}>Content</div>;
}
```

## 🧩 Components

### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@musetrip360/ui-core';

// Basic usage
<Button>Default Button</Button>

// With variants
<Button variant="secondary" size="lg">
  Large Secondary Button
</Button>

// With icons and loading state
<Button
  variant="primary"
  loading={isLoading}
  leftIcon={<SaveIcon />}
  fullWidth
>
  Save Changes
</Button>

// Available variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>

// Available sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon">Icon Only</Button>
```

### Input

Form input component with built-in validation styling and icons.

```tsx
import { Input } from '@musetrip360/ui-core';

// Basic usage
<Input placeholder="Enter your name" />

// With label and validation
<Input
  label="Email Address"
  type="email"
  error={errors.email}
  helperText="We'll never share your email"
/>

// With icons
<Input
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
  placeholder="Search..."
/>

// Available variants
<Input variant="default" />
<Input variant="error" />
<Input variant="success" />

// Available sizes
<Input size="sm" />
<Input size="md" />
<Input size="lg" />
```

### Card

Flexible container component for grouping related content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@musetrip360/ui-core';

// Basic usage
<Card>
  <CardContent>
    Simple card content
  </CardContent>
</Card>

// Full featured card
<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    Main card content
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Available variants
<Card variant="default">Default</Card>
<Card variant="interactive">Interactive</Card>
<Card variant="elevated">Elevated</Card>
<Card variant="outlined">Outlined</Card>

// Available padding
<Card padding="none">No Padding</Card>
<Card padding="sm">Small</Card>
<Card padding="md">Medium</Card>
<Card padding="lg">Large</Card>
```

### Badge

Small status and labeling component.

```tsx
import { Badge } from '@musetrip360/ui-core';

// Basic usage
<Badge>Default</Badge>

// With variants
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="neutral">Neutral</Badge>
<Badge variant="outline">Outline</Badge>

// Available sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Select

Dropdown selection component with keyboard navigation.

```tsx
import { Select } from '@musetrip360/ui-core';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

// Basic usage
<Select
  options={options}
  placeholder="Choose an option"
  onChange={(value) => console.log(value)}
/>

// With label and validation
<Select
  label="Country"
  options={countryOptions}
  value={selectedCountry}
  error={errors.country}
  onChange={setSelectedCountry}
/>

// Available variants
<Select variant="default" />
<Select variant="error" />

// Available sizes
<Select size="sm" />
<Select size="md" />
<Select size="lg" />
```

### Modal

Accessible modal dialog component.

```tsx
import { Modal, ModalHeader, ModalFooter } from '@musetrip360/ui-core';

function MyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Modal Title"
      description="Modal description"
    >
      <p>Modal content goes here</p>

      <ModalFooter>
        <Button variant="ghost" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// Available sizes
<Modal size="sm">Small Modal</Modal>
<Modal size="md">Medium Modal</Modal>
<Modal size="lg">Large Modal</Modal>
<Modal size="xl">Extra Large Modal</Modal>
<Modal size="full">Full Width Modal</Modal>

// Configuration options
<Modal
  open={isOpen}
  onClose={handleClose}
  closeOnBackdropClick={false}
  closeOnEscape={true}
  showCloseButton={true}
>
  Content
</Modal>
```

## 🛠️ Utilities

### cn (Class Name Utility)

Merge class names with conditional logic.

```tsx
import { cn } from '@musetrip360/ui-core';

function Component({ isActive, className }) {
  return <div className={cn('base-classes', isActive && 'active-classes', className)}>Content</div>;
}
```

### Other Utilities

```tsx
import {
  formatBytes,
  debounce,
  throttle,
  sleep,
  copyToClipboard,
  generateId,
  isInViewport,
  formatDate,
  formatRelativeTime,
} from '@musetrip360/ui-core';

// Format file sizes
formatBytes(1024); // "1 KB"

// Debounce function calls
const debouncedSearch = debounce(searchFunction, 300);

// Copy text to clipboard
await copyToClipboard('Hello World');

// Format dates
formatDate(new Date()); // "January 1, 2024"
formatRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
```

## 🎨 Customization

### Extending Components

You can extend any component by creating your own variants:

```tsx
import { Button, cn } from '@musetrip360/ui-core';
import { cva } from 'class-variance-authority';

const customButtonVariants = cva('', {
  variants: {
    customVariant: {
      brand: 'bg-brand-500 text-white hover:bg-brand-600',
    },
  },
});

function CustomButton({ customVariant, className, ...props }) {
  return <Button className={cn(customButtonVariants({ customVariant }), className)} {...props} />;
}
```

### Theming

The components use semantic color classes that can be customized in your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          // ... other shades
        },
        neutral: {
          // ... neutral color scale
        },
        error: {
          // ... error color scale
        },
        success: {
          // ... success color scale
        },
      },
    },
  },
};
```

## 🏗️ Development

### Building

```bash
pnpm build
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

## 📝 Design Principles

1. **Accessibility First** - All components are built with screen readers and keyboard navigation in mind
2. **Composable** - Components can be combined and extended easily
3. **Consistent** - Follows a predictable API pattern across all components
4. **Performant** - Optimized for bundle size and runtime performance
5. **Type Safe** - Full TypeScript support with proper type inference

## 🤝 Contributing

Please refer to the main repository's contributing guidelines.

## 📄 License

MIT License - see the main repository for details.
