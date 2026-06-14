import { useState, useCallback } from "react"
import { validateEmail, validatePassword, validateUsername, validateTitle, validateDescription } from "../utils/validation"
import { sanitizeFormData } from "../utils/sanitize"

export interface FormErrors {
  [key: string]: string
}

export interface UseFormValidationOptions {
  onSubmit: (data: unknown) => void
  initialValues: Record<string, unknown>
  validate?: (values: Record<string, unknown>) => FormErrors
}

export function useFormValidation({ onSubmit, initialValues, validate }: UseFormValidationOptions) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }, [errors])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }, [])

  const validateForm = useCallback((formValues: Record<string, unknown>): FormErrors => {
    const newErrors: FormErrors = {}

    if (validate) {
      return validate(formValues)
    }

    return newErrors
  }, [validate])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSubmitting(true)

      const formErrors = validateForm(values)

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors)
        setTouched(
          Object.keys(values).reduce(
            (acc, key) => {
              acc[key] = true
              return acc
            },
            {} as Record<string, boolean>
          )
        )
        setIsSubmitting(false)
        return
      }

      try {
        const sanitized = sanitizeFormData(values)
        onSubmit(sanitized)
      } catch (error) {
        console.error("Form submission error:", error)
        setErrors({ submit: "Failed to submit form" })
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validateForm, onSubmit]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  }
}

/**
 * Pre-made validator for user forms
 */
export const userFormValidator = (values: Record<string, unknown>): FormErrors => {
  const errors: FormErrors = {}

  if (!values.name || typeof values.name !== "string" || !validateUsername(values.name)) {
    errors.name = "Name must be between 2 and 50 characters"
  }

  if (!values.email || typeof values.email !== "string" || !validateEmail(values.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (values.password) {
    if (typeof values.password !== "string") {
      errors.password = "Password is invalid"
    } else {
      const passwordValidation = validatePassword(values.password)
      if (!passwordValidation.valid) {
        errors.password = passwordValidation.errors[0] || "Password is invalid"
      }
    }
  }

  return errors
}

/**
 * Pre-made validator for project forms
 */
export const projectFormValidator = (values: Record<string, unknown>): FormErrors => {
  const errors: FormErrors = {}

  if (!values.title || typeof values.title !== "string" || !validateTitle(values.title)) {
    errors.title = "Title is required and must be between 1 and 100 characters"
  }

  if (values.description && typeof values.description === "string" && !validateDescription(values.description)) {
    errors.description = "Description must be less than 500 characters"
  }

  return errors
}

/**
 * Pre-made validator for task forms
 */
export const taskFormValidator = (values: Record<string, unknown>): FormErrors => {
  const errors: FormErrors = {}

  if (!values.title || typeof values.title !== "string" || !validateTitle(values.title)) {
    errors.title = "Title is required and must be between 1 and 100 characters"
  }

  if (values.description && typeof values.description === "string" && !validateDescription(values.description)) {
    errors.description = "Description must be less than 500 characters"
  }

  if (!values.projectId || typeof values.projectId !== "string") {
    errors.projectId = "Project is required"
  }

  if (!values.assignedTo || typeof values.assignedTo !== "string") {
    errors.assignedTo = "Assignee is required"
  }

  return errors
}
