// Modal props interfaces
export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export interface FormModalProps<T> extends ModalProps {
  title: string;
  onSubmit: (data: T) => void;
  defaultValues?: Partial<T>;
  isLoading?: boolean;
}

export interface ViewModalProps<T> extends ModalProps {
  data: T | null;
  title: string;
}

export interface DeleteModalProps<T> extends ModalProps {
  data: T | null;
  title: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

// Form field configurations
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  description?: string;
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
}
