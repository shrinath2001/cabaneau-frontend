# Font Usage Guide - Cabaneau

## Available Fonts

Your project now has **3 optimized fonts** ready to use anywhere:

1. **Jost** (Google Font) - Heading font
2. **Raleway** (Google Font) - Body font (default)
3. **Logga** (Custom local font) - Custom font

---

## How to Use Fonts

### Method 1: Using Tailwind Classes (Recommended)

Simply add these classes to any element:

```jsx
// Jost Font
<h1 className="font-jost">Heading with Jost</h1>

// Raleway Font
<p className="font-raleway">Body text with Raleway</p>

// Logga Font
<h2 className="font-logga">Custom text with Logga</h2>
```

### Method 2: Using Legacy Aliases

For backward compatibility, you can also use:

```jsx
<h1 className="font-heading">Same as font-jost</h1>
<p className="font-body">Same as font-raleway</p>
<h2 className="font-custom">Same as font-logga</h2>
```

---

## Font Examples

### Combining with Other Tailwind Classes

```jsx
// Jost with weight and size
<h1 className="font-jost text-4xl font-bold">Bold Heading</h1>

// Raleway with color
<p className="font-raleway text-gray-600 text-sm">Small body text</p>

// Logga with letter spacing
<h2 className="font-logga tracking-widest text-2xl">Custom Font</h2>
```

### Responsive Font Usage

```jsx
<h1 className="font-jost md:font-logga">
  Jost on mobile, Logga on desktop
</h1>
```

### Complete Component Example

```jsx
export default function MyComponent() {
  return (
    <div>
      <h1 className="font-jost text-5xl font-bold mb-4">
        Welcome to Cabaneau
      </h1>

      <p className="font-raleway text-lg text-gray-700 mb-6">
        Experience luxury cabins with private wellness facilities.
      </p>

      <h2 className="font-logga text-3xl tracking-wider">
        Our Cabines
      </h2>
    </div>
  );
}
```

---

## Font Weights Available

All fonts support multiple weights:

- **Jost**: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **Raleway**: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **Logga**: 400 (normal)

Use Tailwind weight classes:

```jsx
<p className="font-jost font-light">Light (300)</p>
<p className="font-jost font-normal">Normal (400)</p>
<p className="font-jost font-medium">Medium (500)</p>
<p className="font-jost font-semibold">Semi Bold (600)</p>
<p className="font-jost font-bold">Bold (700)</p>
<p className="font-jost font-black">Black (900)</p>
```

---

## Default Font

The default font for the entire app is **Raleway** (body font).

To change it, edit `app/layout.tsx`:

```tsx
<body className="font-raleway antialiased">  // Current default
<body className="font-jost antialiased">     // Change to Jost
<body className="font-logga antialiased">    // Change to Logga
```

---

## Advanced Usage

### Using CSS Variables Directly

If you need to use fonts in CSS or styled-components:

```css
.my-class {
  font-family: var(--font-jost);
}

.another-class {
  font-family: var(--font-raleway);
}

.custom-class {
  font-family: var(--font-logga);
}
```

### Using in Inline Styles

```jsx
<div style={{ fontFamily: 'var(--font-jost)' }}>
  Text with Jost
</div>
```

---

## Performance Benefits

✅ **Automatic optimization** - Fonts are self-hosted and optimized by Next.js
✅ **Zero layout shift** - Fonts load without CLS (Cumulative Layout Shift)
✅ **Preloading** - Critical fonts are preloaded automatically
✅ **Subset optimization** - Only Latin characters loaded for better performance

---

## Troubleshooting

### Font not appearing?

1. Make sure you're using the correct class name: `font-jost`, `font-raleway`, or `font-logga`
2. Check that the element isn't being overridden by a parent's font
3. Try adding `!font-jost` to force the font (use sparingly)

### Using with CSS Modules?

```module.css
.title {
  font-family: var(--font-jost);
  font-weight: 700;
}
```

---

## Quick Reference

| Font | Class | CSS Variable | Usage |
|------|-------|--------------|-------|
| Jost | `font-jost` | `var(--font-jost)` | Headings, Titles |
| Raleway | `font-raleway` | `var(--font-raleway)` | Body text, Paragraphs |
| Logga | `font-logga` | `var(--font-logga)` | Special text, Logos |

---

**Ready to use! 🎉**

All fonts are now optimized and ready to use anywhere in your project with simple Tailwind classes.
