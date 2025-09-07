/**
 * Modal Component
 * Accessible modal with backdrop, animations, and keyboard handling
 */
export class Modal {
  constructor(element) {
    this.element = element
    this.backdrop = element.querySelector('[data-modal-backdrop]')
    this.content = element.querySelector('[data-modal-content]')
    this.closeButtons = element.querySelectorAll('[data-modal-close]')
    this.isOpen = false
    this.focusableElements = []
    this.previousActiveElement = null
    
    this.init()
  }

  init() {
    this.bindEvents()
    this.setupFocusable()
  }

  bindEvents() {
    // Close button clicks
    this.closeButtons.forEach(button => {
      button.addEventListener('click', () => this.close())
    })

    // Backdrop click to close
    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) {
          this.close()
        }
      })
    }

    // Keyboard events
    this.element.addEventListener('keydown', (e) => {
      if (!this.isOpen) return

      if (e.key === 'Escape') {
        this.close()
      } else if (e.key === 'Tab') {
        this.handleTabKey(e)
      }
    })
  }

  setupFocusable() {
    this.focusableElements = this.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  }

  open() {
    if (this.isOpen) return

    this.previousActiveElement = document.activeElement
    
    this.element.classList.remove('hidden')
    this.element.classList.add('animate-fade-in')
    
    if (this.content) {
      this.content.classList.add('animate-scale-in')
    }
    
    document.body.classList.add('overflow-hidden')
    this.isOpen = true
    
    // Focus first focusable element
    setTimeout(() => {
      if (this.focusableElements.length > 0) {
        this.focusableElements[0].focus()
      }
    }, 100)

    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent('modal:opened'))
  }

  close() {
    if (!this.isOpen) return

    this.element.classList.add('hidden')
    this.element.classList.remove('animate-fade-in')
    
    if (this.content) {
      this.content.classList.remove('animate-scale-in')
    }
    
    document.body.classList.remove('overflow-hidden')
    this.isOpen = false
    
    // Restore focus
    if (this.previousActiveElement) {
      this.previousActiveElement.focus()
      this.previousActiveElement = null
    }

    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent('modal:closed'))
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  handleTabKey(e) {
    if (this.focusableElements.length === 0) return

    const firstElement = this.focusableElements[0]
    const lastElement = this.focusableElements[this.focusableElements.length - 1]

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }
}
