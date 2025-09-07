# 🚀 Tailwind Starter Template

> A comprehensive, professional-grade starter template for HTML, CSS, JavaScript, and Tailwind CSS projects. Built with modern development practices and ready for production.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1.13-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5.0.10-646CFF?logo=vite)](https://vitejs.dev)

---

## ✨ Features

### 🎯 **Core Technologies**
- **Tailwind CSS v4** - Latest version with improved architecture
- **Vanilla JavaScript** - Clean, modular ES6+ patterns
- **Vite** - Lightning-fast development server
- **PostCSS** - Advanced CSS processing

### 🏗️ **Architecture & Organization**
- **Modular JavaScript** - Component-based architecture without framework overhead
- **Custom Design System** - Consistent colors, typography, and spacing
- **Responsive First** - Mobile-optimized with desktop enhancements
- **Accessibility Ready** - ARIA labels, keyboard navigation, screen reader support

### 🎨 **UI Components**
- **Navigation** - Responsive navbar with mobile menu and dropdowns
- **Modals** - Accessible modals with backdrop and keyboard handling
- **Forms** - Advanced validation with real-time feedback
- **Toast Notifications** - Beautiful alerts and messages
- **Cards & Buttons** - Pre-styled components with variants

### 🔧 **Developer Experience**
- **Hot Reload** - Instant browser updates during development
- **Code Formatting** - Prettier configuration for consistent style
- **Build Optimization** - Production-ready asset bundling
- **Dark Mode Support** - System preference detection and manual toggle

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** or **yarn**

### Quick Start

```bash
# 1. Clone or download this repository
git clone <your-repo-url> my-project
cd my-project

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

**That's it!** 🎉 Your development environment is ready.

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run format` | Format all code with Prettier |
| `npm run setup` | Customize project for your needs |

### Development Workflow

```bash
# Start development (most common command)
npm run dev

# The server will start on http://localhost:3000
# Changes to HTML, CSS, or JS files will auto-refresh the browser
```

### Production Build

```bash
# Build optimized files for deployment
npm run build

# Files will be generated in the 'dist' folder
# Ready to upload to any web server
```

---

## 📁 Project Structure

```
tailwind-starter-template/
├── 📄 index.html              # Main landing page
├── 📁 src/                    # Source files
│   ├── 📁 css/
│   │   └── input.css          # Tailwind CSS with custom styles
│   └── 📁 js/
│       ├── main.js            # Main JavaScript entry point
│       ├── 📁 components/     # Reusable UI components
│       │   ├── Navigation.js  # Navigation component
│       │   ├── Modal.js       # Modal component
│       │   ├── Form.js        # Form validation component
│       │   └── Toast.js       # Toast notifications
│       └── 📁 utils/          # Utility functions
│           ├── dom.js         # DOM manipulation helpers
│           ├── theme.js       # Theme management
│           ├── storage.js     # Local storage wrapper
│           ├── validator.js   # Form validation
│           └── api.js         # HTTP request helper
├── 📁 pages/                  # Additional page examples
├── 📁 assets/                 # Images, icons, fonts
├── 📁 public/                 # Static assets
├── 📁 docs/                   # Documentation
└── 📄 package.json           # Dependencies and scripts
```

---

## 🎨 Customization Guide

### 1. **Update Project Information**

**Edit `package.json`:**
```json
{
  "name": "your-project-name",
  "description": "Your project description",
  "author": "Your Name"
}
```

**Update HTML titles and meta tags:**
```html
<title>Your Project Name</title>
<meta name="description" content="Your project description">
```

### 2. **Customize Design System**

**Colors and Typography** (`src/css/input.css`):
```css
:root {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  /* Add your brand colors */
}
```

**Logo and Branding:**
- Replace logo in navigation (line 25 in `index.html`)
- Add your favicon to `assets/icons/`
- Update social media links

### 3. **Add Your Content**

**Homepage Sections:**
- Update hero text (lines 87-96 in `index.html`)
- Modify feature cards (lines 108+ in `index.html`)
- Add your project links and information

**Additional Pages:**
- Create new HTML files in the root or `pages/` folder
- Copy the navigation and structure from `index.html`
- Update navigation links accordingly

---

## 🧩 Components Usage

### Navigation Component
```html
<nav data-component="navigation">
  <!-- Navigation will be automatically initialized -->
</nav>
```

### Modal Component
```html
<!-- Modal Trigger -->
<button onclick="window.app.getComponent('modal-demo')?.open()">
  Open Modal
</button>

<!-- Modal HTML -->
<div data-modal="demo" class="fixed inset-0 hidden">
  <div data-modal-backdrop></div>
  <div data-modal-content>
    <!-- Modal content -->
    <button data-modal-close>Close</button>
  </div>
</div>
```

### Form Validation
```html
<form data-validate>
  <input 
    name="email" 
    type="email" 
    data-validate="required|email"
    class="form-input"
  >
  <div data-error="email" class="form-error"></div>
</form>
```

### Toast Notifications
```javascript
// Success message
window.app.getComponent('toast')?.success('Operation completed!')

// Error message
window.app.getComponent('toast')?.error('Something went wrong!')
```

### Theme Toggle
```html
<button data-theme-toggle>
  Toggle Dark Mode
</button>
```

---

## 🎭 Dark Mode Implementation

Dark mode is automatically implemented with:
- **System preference detection**
- **Manual toggle capability**
- **Persistent user choice**
- **Smooth transitions**

**JavaScript API:**
```javascript
// Toggle theme
window.app.getUtil('theme')?.toggle()

// Set specific theme
window.app.getUtil('theme')?.setTheme('dark')

// Check current theme
window.app.getUtil('theme')?.isDark()
```

---

## 📱 Responsive Design

The template is mobile-first with these breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

**Key responsive features:**
- Collapsible navigation menu
- Responsive typography using `clamp()`
- Flexible grid layouts
- Touch-friendly interactive elements

---

## 🔧 Advanced Configuration

### Tailwind CSS Customization

**Add custom utilities** (`src/css/input.css`):
```css
@layer utilities {
  .your-custom-class {
    /* Your styles */
  }
}
```

**Extend color palette:**
```css
:root {
  --color-brand: #ff6b6b;
}
```

### Vite Configuration

**Customize build settings** (`vite.config.js`):
```javascript
export default defineConfig({
  // Your custom Vite configuration
  server: {
    port: 8080  // Change development port
  }
})
```

### Adding New Pages

1. **Create HTML file:**
```bash
cp index.html pages/new-page.html
```

2. **Update page content and title**

3. **Add navigation link:**
```html
<a href="pages/new-page.html" class="nav-link">New Page</a>
```

4. **Update Vite config** to include new page in build

---

## 🚀 Deployment Guide

### Build for Production
```bash
npm run build
```

### Deploy to Popular Platforms

#### **Netlify**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

#### **Vercel**
1. Import repository
2. Framework preset: Vite
3. Deploy with zero configuration

#### **GitHub Pages**
1. Build project: `npm run build`
2. Push `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

#### **Traditional Web Hosting**
1. Run `npm run build`
2. Upload contents of `dist` folder to your server
3. Ensure server serves `index.html` for all routes

---

## 🔍 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 88+ |
| Firefox | 78+ |
| Safari | 14+ |
| Edge | 88+ |

**Modern features used:**
- ES6 Modules
- CSS Grid & Flexbox
- CSS Custom Properties
- Fetch API
- Intersection Observer

---

## 🧪 Testing Your Setup

### Verify Installation
1. ✅ `npm run dev` starts without errors
2. ✅ Browser opens to `http://localhost:3000`
3. ✅ Page loads with styled content
4. ✅ Navigation works on mobile and desktop
5. ✅ Theme toggle switches between light/dark
6. ✅ Modal opens and closes properly
7. ✅ Toast notifications appear when triggered

### Test Production Build
```bash
npm run build
npm run preview
```
Check that the preview version works identically to development.

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### **Development server won't start**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Styles not applying**
- Check if CSS file path is correct in HTML
- Ensure Tailwind CSS is being processed
- Verify PostCSS configuration

#### **JavaScript modules not working**
- Ensure you're using `type="module"` in script tags
- Check for typos in import/export statements
- Verify file paths are correct

#### **Build fails**
```bash
# Check for syntax errors
npm run format

# Clear build cache
rm -rf dist
npm run build
```

### Getting Help

1. **Check the console** for error messages
2. **Verify file paths** are correct
3. **Ensure all dependencies** are installed
4. **Check browser compatibility**
5. **Review the documentation** above

---

## 📚 Learning Resources

### Tailwind CSS
- [Official Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com)
- [Tailwind CSS v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)

### Vite
- [Vite Documentation](https://vitejs.dev)
- [Vite Configuration](https://vitejs.dev/config/)

### Modern JavaScript
- [MDN Web Docs](https://developer.mozilla.org)
- [ES6 Modules Guide](https://javascript.info/modules-intro)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run formatting**: `npm run format`
5. **Test thoroughly**
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) team for the amazing framework
- [Vite](https://vitejs.dev) for the blazing-fast build tool
- [Heroicons](https://heroicons.com) for beautiful SVG icons
- Open source community for inspiration and best practices

---

## 📧 Support

Need help? Found a bug? Have a suggestion?

- 📧 **Email**: your-email@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/your-repo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/your-repo/discussions)

---

<div align="center">

**Made with ❤️ for the web development community**

⭐ **If this template helped you, please give it a star!** ⭐

[⬆ Back to Top](#-tailwind-starter-template)

</div>

---

## 🚀 Quick Commands Cheat Sheet

```bash
# 🏃‍♂️ Start development
npm run dev

# 🏗️ Build for production  
npm run build

# 🔍 Preview production build
npm run preview

# ✨ Format code
npm run format

# 🎨 Customize project
npm run setup
```

**Happy coding! 🎉**
