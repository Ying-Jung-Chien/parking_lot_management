export function IDValidator(ID) {
    if (!ID) return "ID can't be empty."
    if (ID.length != 9) return 'Ooops! We need a valid ID.'
    return ''
  }
  