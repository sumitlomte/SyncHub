// Input sanitization utilities

/**
 * Remove HTML tags and potential XSS vectors
 */
export const sanitizeHTML = (input: string): string => {
  const div = document.createElement("div")
  div.textContent = input
  return div.innerHTML
}

/**
 * Escape special characters for safe display
 */
export const escapeHTML = (text: string): string => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Remove whitespace and trim
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, " ")
}

/**
 * Sanitize object keys to prevent prototype pollution
 */
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const sanitized = { ...obj }
  const dangerousKeys = ["__proto__", "constructor", "prototype"]

  for (const key of dangerousKeys) {
    delete (sanitized as Record<string, unknown>)[key]
  }

  return sanitized
}

/**
 * Sanitize URL to prevent malicious redirects
 */
export const sanitizeUrl = (url: string): string => {
  if (url.startsWith("javascript:") || url.startsWith("data:") || url.startsWith("vbscript:")) {
    return "/"
  }
  return url
}

/**
 * Sanitize all string values in an object
 */
export const sanitizeFormData = <T extends Record<string, unknown>>(data: T): T => {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}
