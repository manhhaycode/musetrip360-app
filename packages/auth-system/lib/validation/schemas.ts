import { z } from 'zod';
import { AuthTypeEnum } from '../types';

/**
 * Password validation schema with comprehensive rules
 */
const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .max(128, 'Mật khẩu không được vượt quá 128 ký tự')
  .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái thường')
  .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái hoa')
  .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số')
  .regex(/[^a-zA-Z0-9]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt');

/**
 * Email validation schema
 */
const emailSchema = z
  .string()
  .min(1, 'Email là bắt buộc')
  .email('Vui lòng nhập địa chỉ email hợp lệ')
  .max(254, 'Email không được vượt quá 254 ký tự');

/**
 * Phone number validation schema
 */
const phoneSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), 'Vui lòng nhập số điện thoại hợp lệ');

/**
 * Full name validation schema
 */
const fullNameSchema = z
  .string()
  .min(1, 'Họ tên là bắt buộc')
  .max(100, 'Họ tên không được vượt quá 100 ký tự')
  .regex(/^[a-zA-ZÀ-ỹà-ỹ\s'-]+$/, 'Họ tên chỉ được chứa chữ cái, khoảng trắng, dấu gạch ngang và dấu nháy');

/**
 * OTP code validation schema
 */
const otpCodeSchema = z
  .string()
  .length(6, 'Mã OTP phải có đúng 6 chữ số')
  .regex(/^\d{6}$/, 'Mã OTP chỉ được chứa số');

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
  authType: z.nativeEnum(AuthTypeEnum).default(AuthTypeEnum.Email),
  redirect: z.string().optional(),
  firebaseToken: z.string().optional(),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    fullName: fullNameSchema,
    phoneNumber: phoneSchema,
    avatarUrl: z.string().url().optional().or(z.literal('')),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'Bạn phải đồng ý với các điều khoản và điều kiện',
    }),
    subscribeToNewsletter: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: otpCodeSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * OTP request form validation schema
 */
export const otpRequestSchema = z.object({
  email: emailSchema,
  type: z.string().optional(),
});

export type OTPRequestFormData = z.infer<typeof otpRequestSchema>;

/**
 * OTP verification form validation schema
 */
export const otpVerifySchema = z.object({
  email: emailSchema,
  otp: otpCodeSchema,
  type: z.string().optional(),
});

export type OTPVerifyFormData = z.infer<typeof otpVerifySchema>;

/**
 * Utility function to get password strength
 */
export const getPasswordStrength = (
  password: string
): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Ít nhất 8 ký tự');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Một chữ cái thường');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Một chữ cái hoa');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Một chữ số');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Một ký tự đặc biệt');

  return { score, feedback };
};

/**
 * Form field validation helpers
 */
export const formValidationHelpers = {
  /**
   * Check if email is already in use (for async validation)
   */
  isEmailAvailable: async (email: string): Promise<boolean> => {
    // This would typically call an API endpoint
    // For now, we'll simulate with a placeholder
    return !email.includes('test@example.com');
  },

  /**
   * Validate password strength in real-time
   */
  validatePasswordStrength: (password: string) => {
    const result = getPasswordStrength(password);
    return {
      isValid: result.score >= 4,
      strength: result.score,
      feedback: result.feedback,
    };
  },

  /**
   * Format phone number for display
   */
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  },
};
