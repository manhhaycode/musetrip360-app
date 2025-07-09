export class PhoneNumber {
  private readonly value: string;

  constructor(phoneNumber: string) {
    const cleaned = this.cleanPhoneNumber(phoneNumber);
    if (!this.isValid(cleaned)) {
      throw new Error(`Invalid phone number format: ${phoneNumber}`);
    }
    this.value = cleaned;
  }

  private cleanPhoneNumber(phone: string): string {
    // Remove all non-digit characters except + at the beginning
    return phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
  }

  private isValid(phone: string): boolean {
    // Basic validation: should be 7-15 digits, optionally starting with +
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    return phoneRegex.test(phone);
  }

  get countryCode(): string | null {
    if (this.value.startsWith('+')) {
      // Extract country code (1-4 digits after +)
      const match = this.value.match(/^\+(\d{1,4})/);
      return match?.[1] || null;
    }
    return null;
  }

  get nationalNumber(): string {
    if (this.value.startsWith('+')) {
      const countryCode = this.countryCode;
      return countryCode ? this.value.substring(countryCode.length + 1) : this.value.substring(1);
    }
    return this.value;
  }

  get formatted(): string {
    // Basic formatting for display
    if (this.value.startsWith('+')) {
      const countryCode = this.countryCode;
      const national = this.nationalNumber;
      return countryCode ? `+${countryCode} ${this.formatNational(national)}` : this.value;
    }
    return this.formatNational(this.value);
  }

  private formatNational(number: string): string {
    // Simple formatting for national numbers
    if (number.length === 10) {
      return `(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6)}`;
    }
    if (number.length === 11) {
      return `${number.substring(0, 1)} (${number.substring(1, 4)}) ${number.substring(4, 7)}-${number.substring(7)}`;
    }
    return number;
  }

  toString(): string {
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }

  static isValid(phoneNumber: string): boolean {
    try {
      new PhoneNumber(phoneNumber);
      return true;
    } catch {
      return false;
    }
  }
}
