// Regex for validating email, username, or phone number upon login
export interface IRegexValidator {
  regex: RegExp;
  message: string;
}

export const regexValidator: Record<string, IRegexValidator> = {
  identifier: {
    regex:
      /^([\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(^[a-zA-Z0-9_.-]+$)|(^[1-9]\d{9,14}$)/,
    message:
      "identifier must be a valid email, username, or phone number (not started with '0' or '+')",
  },
  password: {
    regex: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
    message:
      'password must be at least 8 characters long, contain at least one uppercase letter and one number',
  },
  openingHour: {
    regex: /^([01]\d|2[0-3]):([0-5]\d)$/,
    message: 'opening hour must be in HH:mm format',
  },
  closingHour: {
    regex: /^([01]\d|2[0-3]):([0-5]\d)$/,
    message: 'closing hour must be in HH:mm format',
  },
  checkInHour: {
    regex: /^([01]\d|2[0-3]):([0-5]\d)$/,
    message: 'check in hour must be in HH:mm format',
  },
  checkOutHour: {
    regex: /^([01]\d|2[0-3]):([0-5]\d)$/,
    message: 'check out hour must be in HH:mm format',
  },
};
