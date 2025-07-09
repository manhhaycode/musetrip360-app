export interface PasswordStrength {
  score: number; // 0-4 (0: very weak, 4: very strong)
  feedback: string[];
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export class Password {
  private readonly _value: string;
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;

  constructor(value: string) {
    if (!value) {
      throw new Error('Password cannot be empty');
    }

    if (value.length < Password.MIN_LENGTH) {
      throw new Error(`Password must be at least ${Password.MIN_LENGTH} characters long`);
    }

    if (value.length > Password.MAX_LENGTH) {
      throw new Error(`Password must be no more than ${Password.MAX_LENGTH} characters long`);
    }

    this._value = value;
  }

  // We don't expose the raw password value for security
  // Only provide methods to validate and check strength

  // Business methods
  validateAgainst(hashedPassword: string): boolean {
    // This would typically use bcrypt or similar hashing library
    // For now, return false as we don't implement actual hashing here
    return false;
  }

  getStrength(): PasswordStrength {
    const hasMinLength = this._value.length >= Password.MIN_LENGTH;
    const hasUppercase = /[A-Z]/.test(this._value);
    const hasLowercase = /[a-z]/.test(this._value);
    const hasNumber = /\d/.test(this._value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this._value);

    let score = 0;
    const feedback: string[] = [];

    // Basic requirements
    if (hasMinLength) score++;
    else feedback.push(`Password must be at least ${Password.MIN_LENGTH} characters long`);

    if (hasUppercase) score++;
    else feedback.push('Password should contain at least one uppercase letter');

    if (hasLowercase) score++;
    else feedback.push('Password should contain at least one lowercase letter');

    if (hasNumber) score++;
    else feedback.push('Password should contain at least one number');

    if (hasSpecialChar) score++;
    else feedback.push('Password should contain at least one special character');

    // Additional checks
    if (this._value.length >= 12) score = Math.min(score + 1, 4);

    if (this.hasCommonPatterns()) {
      score = Math.max(score - 1, 0);
      feedback.push('Password contains common patterns');
    }

    if (this.isCommonPassword()) {
      score = Math.max(score - 2, 0);
      feedback.push('Password is too common');
    }

    return {
      score: Math.min(score, 4),
      feedback,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    };
  }

  isWeak(): boolean {
    return this.getStrength().score < 2;
  }

  isStrong(): boolean {
    return this.getStrength().score >= 3;
  }

  private hasCommonPatterns(): boolean {
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /(\w)\1{2,}/, // repeated characters
      /\d{4,}/, // long sequences of numbers
    ];

    return commonPatterns.some((pattern) => pattern.test(this._value));
  }

  private isCommonPassword(): boolean {
    const commonPasswords = [
      'password',
      '123456',
      '12345678',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
    ];

    return commonPasswords.some(
      (common) => this._value.toLowerCase() === common || this._value.toLowerCase().includes(common)
    );
  }

  getComplexityScore(): number {
    let complexity = 0;

    // Length bonus
    complexity += Math.min(this._value.length * 0.5, 10);

    // Character variety bonus
    if (/[a-z]/.test(this._value)) complexity += 5;
    if (/[A-Z]/.test(this._value)) complexity += 5;
    if (/\d/.test(this._value)) complexity += 5;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this._value)) complexity += 10;

    // Uniqueness bonus
    const uniqueChars = new Set(this._value).size;
    complexity += uniqueChars * 0.5;

    // Penalty for common patterns
    if (this.hasCommonPatterns()) complexity -= 10;
    if (this.isCommonPassword()) complexity -= 20;

    return Math.max(0, Math.min(100, complexity));
  }

  // Factory methods
  static fromString(value: string): Password {
    return new Password(value);
  }

  static isValid(value: string): boolean {
    try {
      new Password(value);
      return true;
    } catch {
      return false;
    }
  }

  static generateStrong(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*(),.?":{}|<>';

    const allChars = lowercase + uppercase + numbers + special;

    // Ensure at least one character from each category
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  // For logging/debugging (never expose actual password)
  toString(): string {
    return '[PROTECTED PASSWORD]';
  }

  toJSON(): string {
    return '[PROTECTED PASSWORD]';
  }

  // Get length without exposing password
  get length(): number {
    return this._value.length;
  }

  // For actual password operations (hashing, etc.)
  getValue(): string {
    return this._value;
  }
}
