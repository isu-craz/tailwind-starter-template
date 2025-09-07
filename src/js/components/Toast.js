/**
 * Toast Component
 * Shows temporary notification messages
 */
export class Toast {
  constructor(container) {
    this.container = container || this.createContainer()
    this.toasts = new Map()
    this.defaultDuration = 5000
  }

  createContainer() {
    const container = document.createElement('div')
    container.className = 'fixed top-4 right-4 z-50 space-y-2'
    container.setAttribute('data-toast-container', '')
    document.body.appendChild(container)
    return container
  }

  show(message, type = 'info', duration = this.defaultDuration) {
    const toast = this.createToast(message, type)
    const id = Date.now().toString()
    
    this.toasts.set(id, toast)
    this.container.appendChild(toast)
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('animate-slide-up')
    }, 10)
    
    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id)
      }, duration)
    }
    
    return id
  }

  createToast(message, type) {
    const toast = document.createElement('div')
    toast.className = `
      flex items-center p-4 max-w-sm bg-white rounded-lg shadow-lg border-l-4 transform translate-x-full
      ${this.getTypeClasses(type)}
    `.trim()
    
    toast.innerHTML = `
      <div class="flex-shrink-0">
        ${this.getTypeIcon(type)}
      </div>
      <div class="ml-3 text-sm font-medium text-gray-900">
        ${message}
      </div>
      <button class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8" data-toast-dismiss>
        <span class="sr-only">Close</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    `
    
    // Add dismiss handler
    const dismissButton = toast.querySelector('[data-toast-dismiss]')
    dismissButton.addEventListener('click', () => {
      const id = Array.from(this.toasts.entries()).find(([, t]) => t === toast)?.[0]
      if (id) this.dismiss(id)
    })
    
    return toast
  }

  getTypeClasses(type) {
    const classes = {
      success: 'border-green-500',
      error: 'border-red-500',
      warning: 'border-yellow-500',
      info: 'border-blue-500'
    }
    return classes[type] || classes.info
  }

  getTypeIcon(type) {
    const icons = {
      success: `
        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
      `,
      error: `
        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
      `,
      warning: `
        <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
      `,
      info: `
        <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
      `
    }
    return icons[type] || icons.info
  }

  dismiss(id) {
    const toast = this.toasts.get(id)
    if (!toast) return
    
    // Animate out
    toast.classList.add('translate-x-full', 'opacity-0')
    toast.classList.remove('animate-slide-up')
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
      this.toasts.delete(id)
    }, 300)
  }

  dismissAll() {
    this.toasts.forEach((_, id) => this.dismiss(id))
  }

  // Convenience methods
  success(message, duration) {
    return this.show(message, 'success', duration)
  }

  error(message, duration) {
    return this.show(message, 'error', duration)
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration)
  }

  info(message, duration) {
    return this.show(message, 'info', duration)
  }
}
