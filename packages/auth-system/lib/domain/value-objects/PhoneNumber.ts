export class PhoneNumber {
  private readonly _value: string;
  private readonly _countryCode: string;
  private readonly _nationalNumber: string;

  constructor(value: string, countryCode?: string) {
    if (!value) {
      throw new Error('Phone number cannot be empty');
    }

    const sanitized = this.sanitizePhoneNumber(value);

    if (!this.isValidPhoneNumber(sanitized)) {
      throw new Error('Invalid phone number format');
    }

    // Extract country code and national number
    const parsed = this.parsePhoneNumber(sanitized, countryCode);

    this._value = sanitized;
    this._countryCode = parsed.countryCode;
    this._nationalNumber = parsed.nationalNumber;
  }

  get value(): string {
    return this._value;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get nationalNumber(): string {
    return this._nationalNumber;
  }

  // Business methods
  private sanitizePhoneNumber(phone: string): string {
    // Remove all non-digit characters except +
    return phone.replace(/[^\d+]/g, '');
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Basic validation - should start with + and have 7-15 digits
    const phoneRegex = /^\+\d{7,15}$/;
    return phoneRegex.test(phone) || /^\d{7,15}$/.test(phone);
  }

  private parsePhoneNumber(
    phone: string,
    providedCountryCode?: string
  ): { countryCode: string; nationalNumber: string } {
    // If starts with +, extract country code
    if (phone.startsWith('+')) {
      // Try to determine country code (simplified approach)
      for (let i = 1; i <= 3; i++) {
        const potentialCountryCode = phone.substring(0, i + 1);
        if (this.isValidCountryCode(potentialCountryCode.substring(1))) {
          return {
            countryCode: potentialCountryCode,
            nationalNumber: phone.substring(i + 1),
          };
        }
      }
      // Fallback - assume single digit country code
      return {
        countryCode: phone.substring(0, 2),
        nationalNumber: phone.substring(2),
      };
    }

    // If no + prefix, use provided country code or default
    const defaultCountryCode = providedCountryCode || '+1'; // Default to US
    return {
      countryCode: defaultCountryCode.startsWith('+') ? defaultCountryCode : `+${defaultCountryCode}`,
      nationalNumber: phone,
    };
  }

  private isValidCountryCode(code: string): boolean {
    // Simplified list of common country codes
    const commonCodes = [
      '1',
      '7',
      '20',
      '27',
      '30',
      '31',
      '32',
      '33',
      '34',
      '36',
      '39',
      '40',
      '41',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '51',
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '58',
      '60',
      '61',
      '62',
      '63',
      '64',
      '65',
      '66',
      '81',
      '82',
      '84',
      '86',
      '90',
      '91',
      '92',
      '93',
      '94',
      '95',
      '98',
    ];

    return commonCodes.includes(code);
  }

  isUS(): boolean {
    return this._countryCode === '+1';
  }

  isInternational(): boolean {
    return this._countryCode !== '+1'; // Assuming default is US
  }

  isMobile(): boolean {
    // Simplified mobile detection based on country code and number patterns
    if (this.isUS()) {
      // US mobile numbers don't have specific prefixes, all could be mobile
      return true;
    }

    // Add more country-specific mobile detection logic here
    return true; // Placeholder
  }

  formatInternational(): string {
    return `${this._countryCode} ${this.formatNationalNumber()}`;
  }

  formatNational(): string {
    if (this.isUS() && this._nationalNumber.length === 10) {
      return `(${this._nationalNumber.substring(0, 3)}) ${this._nationalNumber.substring(3, 6)}-${this._nationalNumber.substring(6)}`;
    }

    return this.formatNationalNumber();
  }

  private formatNationalNumber(): string {
    const num = this._nationalNumber;

    // Different formatting based on length
    if (num.length <= 3) return num;
    if (num.length <= 6) return `${num.substring(0, 3)} ${num.substring(3)}`;
    if (num.length <= 10) return `${num.substring(0, 3)} ${num.substring(3, 6)} ${num.substring(6)}`;

    // For longer numbers, group in chunks of 3-4
    const chunks = [];
    for (let i = 0; i < num.length; i += 3) {
      chunks.push(num.substring(i, i + 3));
    }
    return chunks.join(' ');
  }

  formatE164(): string {
    return `${this._countryCode}${this._nationalNumber}`;
  }

  maskNumber(): string {
    const formatted = this.formatNational();
    if (formatted.length <= 4) return formatted;

    // Show only last 4 digits
    const lastFour = formatted.slice(-4);
    const masked = '*'.repeat(formatted.length - 4);

    return masked + lastFour;
  }

  getCarrier(): string | null {
    // This would typically integrate with a carrier lookup service
    // For now, return null
    return null;
  }

  getRegion(): string | null {
    // Map country codes to regions
    const regionMap: Record<string, string> = {
      '+1': 'North America',
      '+44': 'United Kingdom',
      '+49': 'Germany',
      '+33': 'France',
      '+81': 'Japan',
      '+86': 'China',
      '+91': 'India',
      // Add more mappings as needed
    };

    return regionMap[this._countryCode] || null;
  }

  // Equality
  equals(other: PhoneNumber): boolean {
    return this.formatE164() === other.formatE164();
  }

  toString(): string {
    return this.formatInternational();
  }

  toJSON(): string {
    return this.formatE164();
  }

  // Factory methods
  static fromString(value: string, countryCode?: string): PhoneNumber {
    return new PhoneNumber(value, countryCode);
  }

  static fromE164(e164: string): PhoneNumber {
    if (!e164.startsWith('+')) {
      throw new Error('E164 format must start with +');
    }
    return new PhoneNumber(e164);
  }

  static isValid(value: string, countryCode?: string): boolean {
    try {
      new PhoneNumber(value, countryCode);
      return true;
    } catch {
      return false;
    }
  }

  // Generate test phone numbers
  static generateTest(countryCode: string = '+1'): PhoneNumber {
    const testNumbers: Record<string, string> = {
      '+1': '5551234567', // US test number
      '+44': '7911123456', // UK test number
      '+49': '15112345678', // Germany test number
    };

    const testNumber = testNumbers[countryCode] || '1234567890';
    return new PhoneNumber(testNumber, countryCode);
  }
}
