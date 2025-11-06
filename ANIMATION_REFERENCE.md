# Animation Classes Reference Guide

Quick reference for all available animation classes in BookEasy.

---

## 🎬 Keyframe Animations

### Entrance Animations

```css
/* Fade in */
.animate-fade-in { animation: fadeIn 0.6s ease-out; }

/* Slide up */
.animate-slide-up { animation: slideUp 0.6s ease-out; }

/* Slide down */
.animate-slide-down { animation: slideDown 0.6s ease-out; }

/* Slide in from left */
.animate-slide-in-left { animation: slideInLeft 0.6s ease-out; }

/* Slide in from right */
.animate-slide-in-right { animation: slideInRight 0.6s ease-out; }

/* Scale in */
.animate-scale-in { animation: scaleIn 0.6s ease-out; }
```

### Continuous Animations

```css
/* Pulsing effect */
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

/* Shimmer loading */
.animate-shimmer { animation: shimmer 2s infinite; }

/* Glowing effect */
.animate-glow { animation: glow 2s ease-in-out infinite; }

/* Floating motion */
.animate-float { animation: float 3s ease-in-out infinite; }

/* Bouncing */
.animate-bounce { animation: bounce 1s ease-in-out infinite; }

/* Spinning */
.animate-spin { animation: spin 1s linear infinite; }

/* Gradient shift */
.animate-gradient-shift { animation: gradientShift 3s ease infinite; }
```

### Special Animations

```css
/* Checkmark animation */
.animate-checkmark { animation: checkmark 0.6s ease-out; }

/* Confetti falling */
.animate-confetti { animation: confetti 3s ease-out; }

/* Ripple effect */
.animate-ripple { animation: ripple 0.6s ease-out; }
```

---

## 🖱️ Hover Effects

### Lift Effect
```css
.hover-lift {
  transition: transform 200ms, box-shadow 200ms;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

### Scale Effect
```css
.hover-scale {
  transition: transform 200ms;
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

### Glow Effect
```css
.hover-glow {
  transition: box-shadow 200ms;
}
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
}
```

### Color Shift
```css
.hover-color-shift {
  transition: color 200ms, background-color 200ms;
}
.hover-color-shift:hover {
  color: #2563eb;
  background-color: rgba(37, 99, 235, 0.1);
}
```

### Border Glow
```css
.hover-border-glow {
  transition: border-color 200ms, box-shadow 200ms;
}
.hover-border-glow:hover {
  border-color: #2563eb;
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.3);
}
```

---

## 🎨 Glassmorphism Effects

### Light Glass
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Dark Glass
```css
.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 🌈 Gradient Backgrounds

### Primary Gradient
```css
.gradient-primary {
  background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%);
}
```

### Success Gradient
```css
.gradient-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
```

### Animated Gradient
```css
.gradient-primary-animated {
  background: linear-gradient(
    -45deg,
    #2563eb,
    #8b5cf6,
    #2563eb
  );
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
}
```

---

## ⏱️ Transition Utilities

### Fast Transition
```css
.transition-fast {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Base Transition
```css
.transition-base {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Slow Transition
```css
.transition-slow {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 📦 Loading States

### Skeleton Loading
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
```

### Loading Spinner
```css
.loading-spinner {
  border: 3px solid rgba(37, 99, 235, 0.1);
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

## 🎯 Usage Examples

### Example 1: Animated Button
```tsx
<button className="hover-lift hover-glow transition-base">
  Click Me
</button>
```

### Example 2: Loading Card
```tsx
<div className="skeleton h-24 w-full rounded-lg animate-shimmer" />
```

### Example 3: Gradient Background
```tsx
<div className="gradient-primary-animated rounded-lg p-6">
  Content
</div>
```

### Example 4: Glassmorphic Card
```tsx
<div className="glass rounded-lg p-6 backdrop-blur-md">
  Content
</div>
```

### Example 5: Animated Entrance
```tsx
<div className="animate-fade-in animate-slide-up">
  Content
</div>
```

---

## 🎬 Framer Motion Patterns

### Staggered Container
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
```

### Item Variants
```tsx
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};
```

### Hover Animation
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Content
</motion.div>
```

### Exit Animation
```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🎨 CSS Variables

```css
/* Colors */
--primary: #2563eb;
--primary-dark: #1e40af;
--primary-light: #3b82f6;
--secondary: #8b5cf6;
--success: #10b981;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;

/* Transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

---

## ♿ Accessibility

All animations respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Adjustments

Animations automatically adjust for mobile:

```css
@media (max-width: 768px) {
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  
  .hover-lift:hover {
    transform: translateY(-2px);
  }
}
```

---

## 🚀 Performance Tips

1. **Use GPU-accelerated properties:**
   - `transform`
   - `opacity`
   - Avoid: `width`, `height`, `left`, `top`

2. **Keep animations short:**
   - Entrance: 0.3-0.6s
   - Hover: 0.2-0.3s
   - Continuous: 2-3s

3. **Use `will-change` sparingly:**
   ```css
   .animated-element {
     will-change: transform;
   }
   ```

4. **Test on real devices:**
   - Mobile performance varies
   - Use DevTools throttling

---

## 📚 More Resources

- **Framer Motion Docs:** https://www.framer.com/motion/
- **CSS Animations:** https://developer.mozilla.org/en-US/docs/Web/CSS/animation
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Web Performance:** https://web.dev/performance/

---

**Happy animating! 🎨**

