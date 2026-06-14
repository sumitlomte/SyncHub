// Form validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export const validateUsername = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50
}

export const validateTitle = (title: string): boolean => {
  return title.trim().length >= 1 && title.trim().length <= 100
}

export const validateDescription = (description: string): boolean => {
  return description.trim().length <= 500
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateForm = (data: Record<string, unknown>, rules: Record<string, (value: unknown) => boolean>): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  for (const [field, rule] of Object.entries(rules)) {
    if (!rule(data[field])) {
      errors[field] = `${field} is invalid`
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
