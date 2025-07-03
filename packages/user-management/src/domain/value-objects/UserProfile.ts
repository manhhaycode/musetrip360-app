import { Email } from './Email';
import { PhoneNumber } from './PhoneNumber';

export interface UserProfileData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  birthDate?: Date;
  metadata?: Record<string, any>;
}

export class UserProfile {
  private readonly _email: Email;
  private readonly _phoneNumber?: PhoneNumber;

  constructor(
    public readonly fullName: string,
    email: string,
    phoneNumber?: string,
    public readonly avatarUrl?: string,
    public readonly birthDate?: Date,
    public readonly metadata: Record<string, any> = {}
  ) {
    if (!fullName?.trim()) {
      throw new Error('Full name is required and cannot be empty');
    }

    this._email = new Email(email);
    this._phoneNumber = phoneNumber ? new PhoneNumber(phoneNumber) : undefined;

    if (birthDate && birthDate > new Date()) {
      throw new Error('Birth date cannot be in the future');
    }
  }

  get email(): string {
    return this._email.toString();
  }

  get emailObj(): Email {
    return this._email;
  }

  get phoneNumber(): string | undefined {
    return this._phoneNumber?.toString();
  }

  get phoneNumberObj(): PhoneNumber | undefined {
    return this._phoneNumber;
  }

  get formattedPhoneNumber(): string | undefined {
    return this._phoneNumber?.formatted;
  }

  get age(): number | null {
    if (!this.birthDate) return null;

    const today = new Date();
    const age = today.getFullYear() - this.birthDate.getFullYear();
    const monthDiff = today.getMonth() - this.birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
      return age - 1;
    }
    return age;
  }

  get isProfileComplete(): boolean {
    return !!(this.fullName?.trim() && this.email && this.phoneNumber);
  }

  get hasAvatar(): boolean {
    return !!this.avatarUrl?.trim();
  }

  get displayName(): string {
    return this.fullName.trim() || this._email.localPart;
  }

  updateProfile(updates: Partial<UserProfileData>): UserProfile {
    return new UserProfile(
      updates.fullName ?? this.fullName,
      updates.email ?? this.email,
      updates.phoneNumber ?? this.phoneNumber,
      updates.avatarUrl ?? this.avatarUrl,
      updates.birthDate ?? this.birthDate,
      { ...this.metadata, ...updates.metadata }
    );
  }

  toJSON(): UserProfileData {
    return {
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      avatarUrl: this.avatarUrl,
      birthDate: this.birthDate,
      metadata: this.metadata,
    };
  }

  static fromData(data: UserProfileData): UserProfile {
    return new UserProfile(data.fullName, data.email, data.phoneNumber, data.avatarUrl, data.birthDate, data.metadata);
  }

  static isValidData(data: Partial<UserProfileData>): boolean {
    try {
      if (!data.fullName?.trim() || !data.email) {
        return false;
      }

      new Email(data.email);

      if (data.phoneNumber) {
        new PhoneNumber(data.phoneNumber);
      }

      if (data.birthDate && data.birthDate > new Date()) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}
