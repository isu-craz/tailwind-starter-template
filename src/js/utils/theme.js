/**
 * Theme Management Utility
 * Handles light/dark theme switching with system preference detection
 */
export const themeManager = {
  currentTheme: null,
  
  /**
   * Initialize theme management
   */
  init() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme()
    this.applyTheme(this.currentTheme)
    this.watchSystemTheme()
    
    console.log(`🎨 Theme initialized: ${this.currentTheme}`)
  },

  /**
   * Get stored theme from localStorage
   * @returns {string|null}
   */
  getStoredTheme() {
    return localStorage.getItem('theme')
  },

  /**
   * Get system theme preference
   * @returns {string}
   */
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  },

  /**
   * Apply theme to document
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme)
    
    // Update theme toggle buttons
    this.updateThemeToggles(theme)
    
    this.currentTheme = theme
  },

  /**
   * Toggle between light and dark themes
   */
  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark'
    this.setTheme(newTheme)
  },

  /**
   * Set specific theme
   * @param {string} theme - Theme name
   */
  setTheme(theme) {
    localStorage.setItem('theme', theme)
    this.applyTheme(theme)
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme, previousTheme: this.currentTheme }
    }))
    
    console.log(`🎨 Theme changed to: ${theme}`)
  },

  /**
   * Remove stored theme and use system preference
   */
  useSystemTheme() {
    localStorage.removeItem('theme')
    const systemTheme = this.getSystemTheme()
    this.applyTheme(systemTheme)
  },

  /**
   * Watch for system theme changes
   */
  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    mediaQuery.addEventListener('change', (e) => {
      // Only update if no manual theme is stored
      if (!this.getStoredTheme()) {
        const newTheme = e.matches ? 'dark' : 'light'
        this.applyTheme(newTheme)
        console.log(`🎨 System theme changed to: ${newTheme}`)
      }
    })
  },

  /**
   * Update meta theme-color for mobile browsers
   * @param {string} theme - Current theme
   */
  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name=\"theme-color\"]')
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }
    
    const colors = {
      light: '#ffffff',
      dark: '#1f2937'
    }
    
    metaThemeColor.setAttribute('content', colors[theme] || colors.light)
  },

  /**
   * Update theme toggle button states
   * @param {string} theme - Current theme
   */
  updateThemeToggles(theme) {
    const toggles = document.querySelectorAll('[data-theme-toggle]')
    
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`)
      
      // Update button content if it has theme-specific content
      const lightContent = toggle.querySelector('[data-theme=\"light\"]')
      const darkContent = toggle.querySelector('[data-theme=\"dark\"]')
      
      if (lightContent && darkContent) {
        lightContent.style.display = theme === 'dark' ? 'block' : 'none'
        darkContent.style.display = theme === 'light' ? 'block' : 'none'
      }
    })
  },

  /**
   * Get current theme
   * @returns {string}
   */
  getCurrentTheme() {
    return this.currentTheme
  },

  /**
   * Check if current theme is dark
   * @returns {boolean}
   */
  isDark() {
    return this.currentTheme === 'dark'
  },

  /**
   * Check if current theme is light
   * @returns {boolean}
   */
  isLight() {
    return this.currentTheme === 'light'
  }
}
