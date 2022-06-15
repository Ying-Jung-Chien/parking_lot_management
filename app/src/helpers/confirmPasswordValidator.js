export function confirmPasswordValidator(newPassword, confirmPassword) {
    if (newPassword != confirmPassword) return "Not match new password."
    return ''
  }
  