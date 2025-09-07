import { validator } from '../utils/validator.js'

/**
 * Form Component
 * Enhanced form with validation and submission handling
 */
export class Form {
  constructor(element) {
    this.element = element
    this.validationRules = this.parseValidationRules()
    this.isSubmitting = false
    
    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    // Form submission
    this.element.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleSubmit()
    })

    // Real-time validation on input
    this.element.addEventListener('input', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.validateField(e.target)
      }
    })

    // Validation on blur
    this.element.addEventListener('blur', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.validateField(e.target)
      }
    }, true)
  }

  parseValidationRules() {
    const rules = {}
    const fields = this.element.querySelectorAll('[data-validate]')
    
    fields.forEach(field => {
      const fieldName = field.name
      const validationString = field.getAttribute('data-validate')
      
      if (fieldName && validationString) {
        rules[fieldName] = this.parseRuleString(validationString)
      }
    })
    
    return rules
  }

  parseRuleString(ruleString) {
    const rules = []
    const ruleParts = ruleString.split('|')
    
    ruleParts.forEach(rule => {
      if (rule.includes(':')) {
        const [ruleName, params] = rule.split(':')
        const paramArray = params.split(',').map(p => {
          const num = Number(p)
          return isNaN(num) ? p : num
        })
        rules.push({ rule: ruleName, params: paramArray })
      } else {
        rules.push(rule)
      }
    })
    
    return rules
  }

  validateField(field) {
    const fieldName = field.name
    const fieldValue = field.value
    const fieldRules = this.validationRules[fieldName]
    
    if (!fieldRules) return true
    
    const formData = validator.extractFormData(this.element)
    const result = validator.validateField(fieldValue, fieldRules, formData)
    
    this.displayFieldErrors(field, result.errors)
    
    return result.isValid
  }

  validateForm() {
    const formData = validator.extractFormData(this.element)
    const result = validator.validateForm(formData, this.validationRules)
    
    validator.displayErrors(this.element, result.errors)
    
    return result
  }

  displayFieldErrors(field, errors) {
    const errorContainer = this.element.querySelector(`[data-error="${field.name}"]`) ||
                         this.element.querySelector(`#${field.name}-error`)
    
    // Remove existing error styles
    field.classList.remove('border-red-500', 'focus:border-red-500')
    
    if (errors.length > 0) {
      field.classList.add('border-red-500', 'focus:border-red-500')
      
      if (errorContainer) {
        errorContainer.textContent = errors[0]
        errorContainer.style.display = 'block'
      }
    } else {
      field.classList.remove('border-red-500', 'focus:border-red-500')
      
      if (errorContainer) {
        errorContainer.textContent = ''
        errorContainer.style.display = 'none'
      }
    }
  }

  async handleSubmit() {
    if (this.isSubmitting) return
    
    const validation = this.validateForm()
    if (!validation.isValid) return
    
    this.isSubmitting = true
    this.setSubmitState(true)
    
    try {
      const formData = validator.extractFormData(this.element)
      
      // Dispatch custom event with form data
      const submitEvent = new CustomEvent('form:submit', {
        detail: { formData, form: this.element }
      })
      this.element.dispatchEvent(submitEvent)
      
      // If no custom handler prevented default, you can add default behavior here
      if (!submitEvent.defaultPrevented) {
        console.log('Form submitted:', formData)
      }
      
    } catch (error) {
      console.error('Form submission error:', error)
      
      // Dispatch error event
      this.element.dispatchEvent(new CustomEvent('form:error', {
        detail: { error }
      }))
    } finally {
      this.isSubmitting = false
      this.setSubmitState(false)
    }
  }

  setSubmitState(isSubmitting) {
    const submitButton = this.element.querySelector('[type="submit"]')
    if (submitButton) {
      submitButton.disabled = isSubmitting
      
      if (isSubmitting) {
        submitButton.classList.add('opacity-50', 'cursor-not-allowed')
        const originalText = submitButton.textContent
        submitButton.dataset.originalText = originalText
        submitButton.textContent = 'Submitting...'
      } else {
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed')
        if (submitButton.dataset.originalText) {
          submitButton.textContent = submitButton.dataset.originalText
        }
      }
    }
  }

  reset() {
    this.element.reset()
    validator.clearErrors(this.element)
  }

  setValues(data) {
    Object.keys(data).forEach(key => {
      const field = this.element.querySelector(`[name="${key}"]`)
      if (field) {
        field.value = data[key]
      }
    })
  }

  getValues() {
    return validator.extractFormData(this.element)
  }
}
