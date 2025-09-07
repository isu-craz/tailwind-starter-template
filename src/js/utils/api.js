/**
 * API Utility
 * Provides a simple wrapper for fetch API with common functionality
 */
export const api = {
  baseURL: '',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,

  /**
   * Set base URL for all requests
   * @param {string} url - Base URL
   */
  setBaseURL(url) {
    this.baseURL = url.replace(/\/$/, '')
  },

  /**
   * Set default headers
   * @param {Object} headers - Headers object
   */
  setDefaultHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  },

  /**
   * Set request timeout
   * @param {number} ms - Timeout in milliseconds
   */
  setTimeout(ms) {
    this.timeout = ms
  },

  /**
   * Make HTTP request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} Response promise
   */
  async request(url, options = {}) {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`
    
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    config.signal = controller.signal

    try {
      const response = await fetch(fullURL, config)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Try to parse as JSON, fallback to text
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`)
      }
      
      throw error
    }
  },

  /**
   * GET request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} Response promise
   */
  get(url, options = {}) {
    return this.request(url, { method: 'GET', ...options })
  },

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {any} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} Response promise
   */
  post(url, data = null, options = {}) {
    const config = { method: 'POST', ...options }
    
    if (data) {
      if (data instanceof FormData) {
        // Don't set Content-Type for FormData, browser will set it
        const headers = { ...config.headers }
        delete headers['Content-Type']
        config.headers = headers
        config.body = data
      } else if (typeof data === 'object') {
        config.body = JSON.stringify(data)
      } else {
        config.body = data
      }
    }
    
    return this.request(url, config)
  },

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {any} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} Response promise
   */
  put(url, data = null, options = {}) {
    const config = { method: 'PUT', ...options }
    
    if (data) {
      if (data instanceof FormData) {
        const headers = { ...config.headers }
        delete headers['Content-Type']
        config.headers = headers
        config.body = data
      } else if (typeof data === 'object') {
        config.body = JSON.stringify(data)
      } else {
        config.body = data
      }
    }
    
    return this.request(url, config)
  },

  /**
   * PATCH request
   * @param {string} url - Request URL
   * @param {any} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} Response promise
   */
  patch(url, data = null, options = {}) {
    const config = { method: 'PATCH', ...options }
    
    if (data) {
      if (typeof data === 'object' && !(data instanceof FormData)) {
        config.body = JSON.stringify(data)
      } else {
        config.body = data
      }
    }
    
    return this.request(url, config)
  },

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} Response promise
   */
  delete(url, options = {}) {
    return this.request(url, { method: 'DELETE', ...options })
  },

  /**
   * Upload file(s)
   * @param {string} url - Upload URL
   * @param {File|FileList|Array} files - File(s) to upload
   * @param {Object} additionalData - Additional form data
   * @param {Object} options - Request options
   * @returns {Promise} Response promise
   */
  upload(url, files, additionalData = {}, options = {}) {
    const formData = new FormData()
    
    // Add files
    if (files instanceof FileList || Array.isArray(files)) {
      Array.from(files).forEach((file, index) => {
        formData.append(`file${index}`, file)
      })
    } else if (files instanceof File) {
      formData.append('file', files)
    }
    
    // Add additional data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key])
    })
    
    return this.post(url, formData, options)
  },

  /**
   * Download file
   * @param {string} url - Download URL
   * @param {string} filename - Filename for download
   * @param {Object} options - Request options
   */
  async download(url, filename = null, options = {}) {
    try {
      const response = await fetch(
        url.startsWith('http') ? url : `${this.baseURL}${url}`,
        { ...options, headers: { ...this.defaultHeaders, ...options.headers } }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
      throw error
    }
  }
}
