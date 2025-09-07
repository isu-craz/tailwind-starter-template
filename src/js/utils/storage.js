/**
 * Storage Utility
 * Enhanced localStorage wrapper with JSON support and error handling
 */
export const storage = {
  /**
   * Set item in localStorage with JSON encoding
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.warn(`Failed to store item "${key}":`, error)
      return false
    }
  },

  /**
   * Get item from localStorage with JSON parsing
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} Retrieved value or default
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      if (item === null) {
        return defaultValue
      }
      return JSON.parse(item)
    } catch (error) {
      console.warn(`Failed to retrieve item "${key}":`, error)
      return defaultValue
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Failed to remove item "${key}":`, error)
      return false
    }
  },

  /**
   * Clear all localStorage
   * @returns {boolean} Success status
   */
  clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
      return false
    }
  },

  /**
   * Check if key exists in localStorage
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null
  },

  /**
   * Get all keys from localStorage
   * @returns {string[]} Array of keys
   */
  keys() {
    return Object.keys(localStorage)
  },

  /**
   * Get storage size in bytes (approximate)
   * @returns {number} Size in bytes
   */
  size() {
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  },

  /**
   * Set item with expiration time
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds
   * @returns {boolean} Success status
   */
  setWithTTL(key, value, ttl) {
    const item = {
      value,
      expiry: Date.now() + ttl
    }
    return this.set(key, item)
  },

  /**
   * Get item with expiration check
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist or expired
   * @returns {any} Retrieved value or default
   */
  getWithTTL(key, defaultValue = null) {
    const item = this.get(key)
    
    if (!item || typeof item !== 'object' || !item.hasOwnProperty('expiry')) {
      return defaultValue
    }
    
    if (Date.now() > item.expiry) {
      this.remove(key)
      return defaultValue
    }
    
    return item.value
  },

  /**
   * Update existing item (merge objects, replace primitives)
   * @param {string} key - Storage key
   * @param {any} updates - Updates to apply
   * @returns {boolean} Success status
   */
  update(key, updates) {
    const existing = this.get(key)
    
    if (existing === null) {
      return this.set(key, updates)
    }
    
    let newValue
    if (typeof existing === 'object' && existing !== null && !Array.isArray(existing)) {
      newValue = { ...existing, ...updates }
    } else {
      newValue = updates
    }
    
    return this.set(key, newValue)
  },

  /**
   * Increment numeric value
   * @param {string} key - Storage key
   * @param {number} amount - Amount to increment (default: 1)
   * @returns {number} New value
   */
  increment(key, amount = 1) {
    const current = this.get(key, 0)
    const newValue = (typeof current === 'number' ? current : 0) + amount
    this.set(key, newValue)
    return newValue
  },

  /**
   * Push item to array (create array if doesn't exist)
   * @param {string} key - Storage key
   * @param {any} item - Item to push
   * @returns {boolean} Success status
   */
  push(key, item) {
    const array = this.get(key, [])
    if (Array.isArray(array)) {
      array.push(item)
      return this.set(key, array)
    }
    return this.set(key, [item])
  },

  /**
   * Remove item from array by value or index
   * @param {string} key - Storage key
   * @param {any} itemOrIndex - Item to remove or index
   * @returns {boolean} Success status
   */
  removeFromArray(key, itemOrIndex) {
    const array = this.get(key)
    if (!Array.isArray(array)) {
      return false
    }
    
    if (typeof itemOrIndex === 'number') {
      // Remove by index
      array.splice(itemOrIndex, 1)
    } else {
      // Remove by value
      const index = array.indexOf(itemOrIndex)
      if (index > -1) {
        array.splice(index, 1)
      }
    }
    
    return this.set(key, array)
  }
}
