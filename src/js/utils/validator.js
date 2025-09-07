/**
 * Form Validation Utility
 * Provides validation rules and form validation functionality
 */
export const validator = {
  // Validation rules
  rules: {
    required: (value) => {
      const trimmed = typeof value === 'string' ? value.trim() : value
      return trimmed !== '' && trimmed !== null && trimmed !== undefined
    },

    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },

    minLength: (min) => (value) => {
      return typeof value === 'string' && value.length >= min
    },

    maxLength: (max) => (value) => {
      return typeof value === 'string' && value.length <= max
    },

    min: (minValue) => (value) => {
      const num = Number(value)
      return !isNaN(num) && num >= minValue
    },

    max: (maxValue) => (value) => {
      const num = Number(value)
      return !isNaN(num) && num <= maxValue
    },

    pattern: (regex) => (value) => {
      return regex.test(value)
    },

    url: (value) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },

    phone: (value) => {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))
    },

    number: (value) => {
      return !isNaN(Number(value)) && value.trim() !== ''
    },

    integer: (value) => {
      return Number.isInteger(Number(value))
    },

    alpha: (value) => {
      return /^[a-zA-Z]+$/.test(value)
    },

    alphanumeric: (value) => {
      return /^[a-zA-Z0-9]+$/.test(value)
    },

    match: (fieldName) => (value, formData) => {
      return value === formData[fieldName]
    }
  },

  // Error messages
  messages: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: (min) => `Must be at least ${min} characters`,
    maxLength: (max) => `Must not exceed ${max} characters`,
    min: (minValue) => `Must be at least ${minValue}`,
    max: (maxValue) => `Must not exceed ${maxValue}`,
    pattern: 'Please enter a valid format',
    url: 'Please enter a valid URL',
    phone: 'Please enter a valid phone number',
    number: 'Please enter a valid number',
    integer: 'Please enter a whole number',
    alpha: 'Only letters are allowed',
    alphanumeric: 'Only letters and numbers are allowed',
    match: (fieldName) => `Must match ${fieldName}`
  },

  /**
   * Validate a single field
   * @param {string} value - Field value
   * @param {Array} rules - Validation rules
   * @param {Object} formData - All form data (for field matching)
   * @returns {Object} Validation result
   */
  validateField(value, rules, formData = {}) {
    const errors = []
    
    for (const rule of rules) {
      let isValid = true
      let errorMessage = ''
      
      if (typeof rule === 'string') {
        // Simple rule name
        isValid = this.rules[rule](value, formData)
        errorMessage = this.messages[rule]
      } else if (typeof rule === 'object') {
        // Rule with parameters
        const ruleName = rule.rule
        const ruleParams = rule.params || []
        const customMessage = rule.message
        
        if (this.rules[ruleName]) {
          const ruleFunction = ruleParams.length > 0 
            ? this.rules[ruleName](...ruleParams)
            : this.rules[ruleName]
          
          isValid = ruleFunction(value, formData)
          errorMessage = customMessage || 
            (typeof this.messages[ruleName] === 'function' 
              ? this.messages[ruleName](...ruleParams)
              : this.messages[ruleName])
        }
      }
      
      if (!isValid) {
        errors.push(errorMessage)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  /**
   * Validate entire form
   * @param {Object} formData - Form data object
   * @param {Object} validationRules - Validation rules for each field
   * @returns {Object} Validation result
   */
  validateForm(formData, validationRules) {
    const results = {}
    const errors = {}
    let isValid = true
    
    Object.keys(validationRules).forEach(fieldName => {
      const fieldValue = formData[fieldName] || ''
      const fieldRules = validationRules[fieldName]
      
      const result = this.validateField(fieldValue, fieldRules, formData)
      results[fieldName] = result
      
      if (!result.isValid) {
        errors[fieldName] = result.errors
        isValid = false
      }
    })
    
    return {
      isValid,
      errors,
      results
    }
  },

  /**
   * Extract form data from form element
   * @param {HTMLFormElement} form - Form element
   * @returns {Object} Form data
   */
  extractFormData(form) {
    const formData = new FormData(form)
    const data = {}
    
    for (const [key, value] of formData.entries()) {
      // Handle multiple values (checkboxes, multiple selects)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value)
        } else {
          data[key] = [data[key], value]
        }
      } else {
        data[key] = value
      }
    }
    
    return data
  },

  /**
   * Display validation errors in form
   * @param {HTMLFormElement} form - Form element
   * @param {Object} errors - Validation errors
   */
  displayErrors(form, errors) {
    // Clear existing errors
    form.querySelectorAll('.form-error').forEach(error => {
      error.textContent = ''
      error.style.display = 'none'
    })
    
    form.querySelectorAll('.form-input').forEach(input => {
      input.classList.remove('border-red-500', 'focus:border-red-500')
    })
    
    // Display new errors
    Object.keys(errors).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`)
      const errorContainer = form.querySelector(`[data-error="${fieldName}"]`) ||
                           form.querySelector(`#${fieldName}-error`)
      
      if (field) {
        field.classList.add('border-red-500', 'focus:border-red-500')
      }
      
      if (errorContainer && errors[fieldName].length > 0) {
        errorContainer.textContent = errors[fieldName][0]
        errorContainer.style.display = 'block'
      }
    })
  },

  /**
   * Clear all validation errors from form
   * @param {HTMLFormElement} form - Form element
   */
  clearErrors(form) {
    this.displayErrors(form, {})
  },

  /**
   * Add custom validation rule
   * @param {string} name - Rule name
   * @param {Function} rule - Validation function
   * @param {string|Function} message - Error message
   */
  addRule(name, rule, message) {
    this.rules[name] = rule
    this.messages[name] = message
  }
}
