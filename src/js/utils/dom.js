/**
 * DOM Utility Functions
 * Provides helper methods for DOM manipulation and querying
 */
export const DOM = {
  /**
   * Find a single element
   * @param {string} selector - CSS selector
   * @param {Element} context - Context element (default: document)
   * @returns {Element|null}
   */
  find(selector, context = document) {
    return context.querySelector(selector)
  },

  /**
   * Find multiple elements
   * @param {string} selector - CSS selector
   * @param {Element} context - Context element (default: document)
   * @returns {NodeList}
   */
  findAll(selector, context = document) {
    return context.querySelectorAll(selector)
  },

  /**
   * Create a new element with attributes and content
   * @param {string} tag - HTML tag name
   * @param {Object} attributes - Element attributes
   * @param {string} content - Inner content
   * @returns {Element}
   */
  create(tag, attributes = {}, content = '') {
    const element = document.createElement(tag)
    
    Object.keys(attributes).forEach(key => {
      if (key === 'className') {
        element.className = attributes[key]
      } else if (key === 'dataset') {
        Object.keys(attributes[key]).forEach(dataKey => {
          element.dataset[dataKey] = attributes[key][dataKey]
        })
      } else {
        element.setAttribute(key, attributes[key])
      }
    })
    
    if (content) {
      element.innerHTML = content
    }
    
    return element
  },

  /**
   * Add class(es) to element(s)
   * @param {Element|NodeList|string} elements - Element(s) or selector
   * @param {string|Array} classes - Class name(s)
   */
  addClass(elements, classes) {
    const els = this._ensureElements(elements)
    const classArray = Array.isArray(classes) ? classes : [classes]
    
    els.forEach(el => {
      el.classList.add(...classArray)
    })
  },

  /**
   * Remove class(es) from element(s)
   * @param {Element|NodeList|string} elements - Element(s) or selector
   * @param {string|Array} classes - Class name(s)
   */
  removeClass(elements, classes) {
    const els = this._ensureElements(elements)
    const classArray = Array.isArray(classes) ? classes : [classes]
    
    els.forEach(el => {
      el.classList.remove(...classArray)
    })
  },

  /**
   * Toggle class(es) on element(s)
   * @param {Element|NodeList|string} elements - Element(s) or selector
   * @param {string|Array} classes - Class name(s)
   */
  toggleClass(elements, classes) {
    const els = this._ensureElements(elements)
    const classArray = Array.isArray(classes) ? classes : [classes]
    
    els.forEach(el => {
      classArray.forEach(className => {
        el.classList.toggle(className)
      })
    })
  },

  /**
   * Check if element has class
   * @param {Element|string} element - Element or selector
   * @param {string} className - Class name
   * @returns {boolean}
   */
  hasClass(element, className) {
    const el = typeof element === 'string' ? this.find(element) : element
    return el ? el.classList.contains(className) : false
  },

  /**
   * Set styles on element(s)
   * @param {Element|NodeList|string} elements - Element(s) or selector
   * @param {Object} styles - Style properties
   */
  setStyles(elements, styles) {
    const els = this._ensureElements(elements)
    
    els.forEach(el => {
      Object.keys(styles).forEach(prop => {
        el.style[prop] = styles[prop]
      })
    })
  },

  /**
   * Get element position and dimensions
   * @param {Element|string} element - Element or selector
   * @returns {Object} Bounding rect information
   */
  getRect(element) {
    const el = typeof element === 'string' ? this.find(element) : element
    return el ? el.getBoundingClientRect() : null
  },

  /**
   * Scroll to element smoothly
   * @param {Element|string} element - Element or selector
   * @param {Object} options - Scroll options
   */
  scrollTo(element, options = { behavior: 'smooth' }) {
    const el = typeof element === 'string' ? this.find(element) : element
    if (el) {
      el.scrollIntoView(options)
    }
  },

  /**
   * Check if element is visible in viewport
   * @param {Element|string} element - Element or selector
   * @returns {boolean}
   */
  isVisible(element) {
    const el = typeof element === 'string' ? this.find(element) : element
    if (!el) return false
    
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  },

  /**
   * Add event listener with optional delegation
   * @param {Element|string} element - Element or selector
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {string} delegate - Delegation selector
   */
  on(element, event, handler, delegate = null) {
    const el = typeof element === 'string' ? this.find(element) : element
    if (!el) return
    
    if (delegate) {
      el.addEventListener(event, (e) => {
        const target = e.target.closest(delegate)
        if (target) {
          handler.call(target, e)
        }
      })
    } else {
      el.addEventListener(event, handler)
    }
  },

  /**
   * Remove event listener
   * @param {Element|string} element - Element or selector
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  off(element, event, handler) {
    const el = typeof element === 'string' ? this.find(element) : element
    if (el) {
      el.removeEventListener(event, handler)
    }
  },

  /**
   * Wait for element to appear in DOM
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Element>}
   */
  waitFor(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = this.find(selector)
      if (element) {
        resolve(element)
        return
      }

      const observer = new MutationObserver(() => {
        const element = this.find(selector)
        if (element) {
          observer.disconnect()
          clearTimeout(timeoutId)
          resolve(element)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      const timeoutId = setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Element "${selector}" not found within ${timeout}ms`))
      }, timeout)
    })
  },

  /**
   * Ensure we have an array of elements
   * @private
   * @param {Element|NodeList|string} elements - Element(s) or selector
   * @returns {Array<Element>}
   */
  _ensureElements(elements) {
    if (typeof elements === 'string') {
      return Array.from(this.findAll(elements))
    }
    if (elements instanceof NodeList) {
      return Array.from(elements)
    }
    if (elements instanceof Element) {
      return [elements]
    }
    return Array.isArray(elements) ? elements : []
  }
}
