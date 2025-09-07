// Main JavaScript Entry Point
import { themeManager } from './utils/theme.js'
import { DOM } from './utils/dom.js'
import { storage } from './utils/storage.js'
import { validator } from './utils/validator.js'
import { api } from './utils/api.js'

// Import Components
import { Navigation } from './components/Navigation.js'
import { Modal } from './components/Modal.js'
import { Form } from './components/Form.js'
import { Toast } from './components/Toast.js'

/**
 * App Class - Main Application Controller
 */
class App {
  constructor() {
    this.components = {}
    this.utils = {
      theme: themeManager,
      dom: DOM,
      storage,
      validator,
      api
    }
    
    this.init()
  }

  /**
   * Initialize the application
   */
  init() {
    console.log('🚀 Tailwind Starter Template - App Initialized')
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup())
    } else {
      this.setup()
    }
  }

  /**
   * Setup the application after DOM is ready
   */
  setup() {
    this.initializeTheme()
    this.initializeComponents()
    this.bindEvents()
    this.loadPageSpecificCode()
    
    // Show app is ready
    document.body.classList.add('app-ready')
    console.log('✅ App setup complete')
  }

  /**
   * Initialize theme management
   */
  initializeTheme() {
    themeManager.init()
    
    // Theme toggle example
    const themeToggle = DOM.find('[data-theme-toggle]')
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        themeManager.toggle()
      })
    }
  }

  /**
   * Initialize components
   */
  initializeComponents() {
    // Initialize Navigation
    const navElement = DOM.find('[data-component="navigation"]')
    if (navElement) {
      this.components.navigation = new Navigation(navElement)
    }

    // Initialize all modals
    DOM.findAll('[data-modal]').forEach(modal => {
      const modalId = modal.dataset.modal
      this.components[`modal-${modalId}`] = new Modal(modal)
    })

    // Initialize forms with validation
    DOM.findAll('form[data-validate]').forEach(form => {
      this.components[`form-${form.id || 'unnamed'}`] = new Form(form)
    })

    // Initialize toast container
    const toastContainer = DOM.find('[data-toast-container]')
    if (toastContainer) {
      this.components.toast = new Toast(toastContainer)
    }
  }

  /**
   * Bind global events
   */
  bindEvents() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape key to close modals
      if (e.key === 'Escape') {
        this.closeAllModals()
      }
      
      // Ctrl/Cmd + / for help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        this.showHelp()
      }
    })

    // Handle external links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="http"]')
      if (link && !link.hasAttribute('data-internal')) {
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noopener noreferrer')
      }
    })

    // Handle smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (anchor) {
        e.preventDefault()
        const targetId = anchor.getAttribute('href').substring(1)
        const target = document.getElementById(targetId)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    })
  }

  /**
   * Load page-specific JavaScript
   */
  loadPageSpecificCode() {
    const pageType = document.body.dataset.page
    if (pageType) {
      import(`./pages/${pageType}.js`)
        .then(module => {
          if (module.default) {
            module.default()
          }
        })
        .catch(err => {
          console.log(`No page-specific code found for: ${pageType}`)
        })
    }
  }

  /**
   * Close all open modals
   */
  closeAllModals() {
    Object.keys(this.components).forEach(key => {
      if (key.startsWith('modal-') && this.components[key].isOpen) {
        this.components[key].close()
      }
    })
  }

  /**
   * Show help modal or information
   */
  showHelp() {
    if (this.components.toast) {
      this.components.toast.show('Keyboard shortcuts: ESC - Close modals, Ctrl+/ - Help', 'info')
    }
  }

  /**
   * Get component by name
   * @param {string} name - Component name
   * @returns {Object|null} Component instance
   */
  getComponent(name) {
    return this.components[name] || null
  }

  /**
   * Get utility by name
   * @param {string} name - Utility name
   * @returns {Object|null} Utility instance
   */
  getUtil(name) {
    return this.utils[name] || null
  }
}

// Initialize the app
const app = new App()

// Make app globally available for debugging
window.app = app

// Export for use in other modules
export default app
