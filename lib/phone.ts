/**
 * Phone number validation and formatting utilities for Costa Rica (+506)
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formattedPhone: string | null;
  error?: string;
}

/**
 * Validates and formats a Costa Rican phone number
 * @param phone - The phone number to validate and format
 * @returns PhoneValidationResult with validation status and formatted number
 */
export function validateAndFormatPhone(phone: string): PhoneValidationResult {
  if (!phone || typeof phone !== "string") {
    return {
      isValid: false,
      formattedPhone: null,
      error: "Phone number is required and must be a string",
    };
  }

  // Remove all spaces, dashes, parentheses, and other non-numeric characters except +
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, "");

  // Check if it's already in the correct format (+506XXXXXXXXX)
  if (cleanedPhone.match(/^\+506\d{8}$/)) {
    return {
      isValid: true,
      formattedPhone: cleanedPhone,
    };
  }

  // Check if it starts with +506 but has wrong length
  if (cleanedPhone.startsWith("+506")) {
    const numberPart = cleanedPhone.substring(4);
    if (numberPart.length !== 8) {
      return {
        isValid: false,
        formattedPhone: null,
        error: `Invalid phone number length. Expected 8 digits after +506, got ${numberPart.length}`,
      };
    }
    if (!numberPart.match(/^\d{8}$/)) {
      return {
        isValid: false,
        formattedPhone: null,
        error: "Phone number must contain only digits after +506",
      };
    }
    return {
      isValid: true,
      formattedPhone: cleanedPhone,
    };
  }

  // Check if it's just 8 digits (Costa Rican mobile number)
  if (cleanedPhone.match(/^\d{8}$/)) {
    return {
      isValid: true,
      formattedPhone: `+506${cleanedPhone}`,
    };
  }

  // Check if it starts with 506 (without +)
  if (cleanedPhone.match(/^506\d{8}$/)) {
    return {
      isValid: true,
      formattedPhone: `+${cleanedPhone}`,
    };
  }

  // Check if it starts with 0 (local format like 084339541)
  if (cleanedPhone.match(/^0\d{8}$/)) {
    const numberPart = cleanedPhone.substring(1);
    return {
      isValid: true,
      formattedPhone: `+506${numberPart}`,
    };
  }

  // If none of the above patterns match, it's invalid
  return {
    isValid: false,
    formattedPhone: null,
    error:
      "Invalid phone number format. Expected formats: +506XXXXXXXXX, 506XXXXXXXXX, 0XXXXXXXX, or XXXXXXXX",
  };
}

/**
 * Validates a phone number without formatting it
 * @param phone - The phone number to validate
 * @returns boolean indicating if the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  return validateAndFormatPhone(phone).isValid;
}

/**
 * Formats a phone number for display (adds spaces for readability)
 * @param phone - The phone number to format
 * @returns Formatted phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  const validation = validateAndFormatPhone(phone);
  if (!validation.isValid || !validation.formattedPhone) {
    return phone; // Return original if invalid
  }

  // Format as +506 XXXX XXXX for display
  const numberPart = validation.formattedPhone.substring(4);
  return `+506 ${numberPart.substring(0, 4)} ${numberPart.substring(4)}`;
}

/**
 * Gets the phone number in E.164 format for WhatsApp/Twilio
 * @param phone - The phone number to format
 * @returns E.164 formatted phone number or null if invalid
 */
export function getE164Phone(phone: string): string | null {
  const validation = validateAndFormatPhone(phone);
  return validation.isValid ? validation.formattedPhone : null;
}
