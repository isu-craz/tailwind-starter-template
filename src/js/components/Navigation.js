/**
 * Navigation Component
 * Handles responsive navigation with mobile menu
 */
export class Navigation {
  constructor(element) {
    this.element = element
    this.mobileMenuButton = element.querySelector('[data-mobile-toggle]')
    this.mobileMenu = element.querySelector('[data-mobile-menu]')
    this.dropdownToggles = element.querySelectorAll('[data-dropdown-toggle]')
    this.isOpen = false
    
    this.init()
  }

  init() {
    this.bindEvents()
    this.setActiveLink()
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.mobileMenuButton && this.mobileMenu) {
      this.mobileMenuButton.addEventListener('click', (e) => {
        e.preventDefault()
        this.toggleMobileMenu()
      })
    }

    // Dropdown toggles
    this.dropdownToggles.forEach(toggle => {
      const dropdownId = toggle.getAttribute('data-dropdown-toggle')
      const dropdown = this.element.querySelector(`[data-dropdown="${dropdownId}"]`)
      
      if (dropdown) {
        toggle.addEventListener('click', (e) => {
          e.preventDefault()
          this.toggleDropdown(dropdown)
        })
      }
    })

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target) && this.isOpen) {
        this.closeMobileMenu()
      }
    })

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isOpen) {
        this.closeMobileMenu()
      }
    })

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      this.element.querySelectorAll('[data-dropdown].open').forEach(dropdown => {
        if (!dropdown.contains(e.target) && !dropdown.previousElementSibling.contains(e.target)) {
          this.closeDropdown(dropdown)
        }
      })
    })

    // Handle keyboard navigation
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns()
        if (this.isOpen) {
          this.closeMobileMenu()
        }
      }
    })
  }

  toggleMobileMenu() {
    if (this.isOpen) {
      this.closeMobileMenu()
    } else {
      this.openMobileMenu()
    }
  }

  openMobileMenu() {
    this.mobileMenu.classList.remove('hidden')
    this.mobileMenu.classList.add('animate-fade-in')
    this.mobileMenuButton.setAttribute('aria-expanded', 'true')
    this.isOpen = true
    
    // Update button icon if it has toggle icons
    this.updateMobileMenuButton()
  }

  closeMobileMenu() {
    this.mobileMenu.classList.add('hidden')
    this.mobileMenu.classList.remove('animate-fade-in')
    this.mobileMenuButton.setAttribute('aria-expanded', 'false')
    this.isOpen = false
    
    // Update button icon
    this.updateMobileMenuButton()
    
    // Close any open dropdowns
    this.closeAllDropdowns()
  }

  updateMobileMenuButton() {
    const openIcon = this.mobileMenuButton.querySelector('[data-icon="open"]')
    const closeIcon = this.mobileMenuButton.querySelector('[data-icon="close"]')
    
    if (openIcon && closeIcon) {
      if (this.isOpen) {
        openIcon.classList.add('hidden')
        closeIcon.classList.remove('hidden')
      } else {
        openIcon.classList.remove('hidden')
        closeIcon.classList.add('hidden')
      }
    }
  }

  toggleDropdown(dropdown) {
    if (dropdown.classList.contains('open')) {
      this.closeDropdown(dropdown)
    } else {
      this.closeAllDropdowns()
      this.openDropdown(dropdown)
    }
  }

  openDropdown(dropdown) {
    dropdown.classList.add('open')
    dropdown.classList.remove('hidden')
    dropdown.classList.add('animate-fade-in')
    
    const toggle = dropdown.previousElementSibling
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true')
    }
  }

  closeDropdown(dropdown) {
    dropdown.classList.remove('open', 'animate-fade-in')
    dropdown.classList.add('hidden')
    
    const toggle = dropdown.previousElementSibling
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false')
    }
  }

  closeAllDropdowns() {
    this.element.querySelectorAll('[data-dropdown]').forEach(dropdown => {
      this.closeDropdown(dropdown)
    })
  }

  setActiveLink() {
    const currentPath = window.location.pathname
    const links = this.element.querySelectorAll('a[href]')
    
    links.forEach(link => {
      const href = link.getAttribute('href')
      
      // Remove existing active classes
      link.classList.remove('nav-link-active')
      
      // Check if this link matches current page
      if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
        link.classList.add('nav-link-active')
      }
    })
  }

  // Public API methods
  open() {
    this.openMobileMenu()
  }

  close() {
    this.closeMobileMenu()
  }

  toggle() {
    this.toggleMobileMenu()
  }
}
