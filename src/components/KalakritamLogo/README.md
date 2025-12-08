# KalakritamLogo Component

A reusable React component that displays the Kalakritam logo from a CDN URL with no local image dependencies.

## Features

- ✅ Uses direct HTTPS CDN link (no local imports)
- ✅ Responsive width styling (140px default, scales down on mobile)
- ✅ Crisp rendering on all devices (high-DPI optimized)
- ✅ Lazy loading for performance
- ✅ Customizable props
- ✅ Includes HTML email snippet

## Usage in React

### Basic Usage

```jsx
import KalakritamLogo from './components/KalakritamLogo';

function App() {
  return (
    <div>
      <KalakritamLogo />
    </div>
  );
}
```

### Custom Width

```jsx
<KalakritamLogo width="200px" />
```

### With Click Handler

```jsx
<KalakritamLogo 
  onClick={() => window.location.href = '/'} 
  width="150px"
/>
```

### Custom Styling

```jsx
<KalakritamLogo 
  className="my-custom-class" 
  alt="Custom Alt Text"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | string | `'140px'` | Width of the logo |
| `className` | string | `''` | Additional CSS classes |
| `alt` | string | `'Kalakritam - Manifesting Through Art'` | Alt text for accessibility |
| `onClick` | function | `undefined` | Optional click handler |

## HTML Email Snippet

### Simple Email Logo

```html
<img 
  src="https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/kalakritamLogo.png" 
  alt="Kalakritam - Manifesting Through Art" 
  style="width: 140px; height: auto; display: block; max-width: 100%;" 
/>
```

### Centered Email Logo

```html
<div style="text-align: center;">
  <img 
    src="https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/kalakritamLogo.png" 
    alt="Kalakritam - Manifesting Through Art" 
    style="width: 140px; height: auto; display: inline-block; max-width: 100%;" 
  />
</div>
```

### Email Signature Logo

```html
<table cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td>
      <img 
        src="https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/kalakritamLogo.png" 
        alt="Kalakritam" 
        style="width: 100px; height: auto; display: block;" 
      />
    </td>
  </tr>
</table>
```

## CDN URL

```
https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/kalakritamLogo.png
```

## Responsive Breakpoints

- **Desktop**: 140px (default)
- **Tablet** (≤768px): max 120px
- **Mobile** (≤480px): max 100px

## Browser Support

- ✅ All modern browsers
- ✅ High-DPI/Retina displays
- ✅ Email clients (Gmail, Outlook, Apple Mail, etc.)
