# TableForm Module

Folder chứa các reusable form components sử dụng **full shadcn UI** để xử lý các thao tác CRUD.

## 📂 Cấu trúc

```
TableForm/
├── index.ts                  # Export module
├── types.ts                  # TypeScript interfaces và types
├── schemas.ts                # Zod validation schemas
├── MuseumForm.tsx           # Form component cho Museum
├── UserForm.tsx             # Form component cho User
├── ViewModal.tsx            # Modal component để xem chi tiết
├── DeleteConfirmModal.tsx   # Modal xác nhận xóa
└── README.md               # Documentation này
```

## 🎯 Mục đích

- **Tách biệt form logic** khỏi table logic (@tanstack/react-table)
- **Reusable components** có thể sử dụng cho nhiều entities khác nhau
- **Full shadcn integration** với consistent styling
- **Type-safe** với TypeScript và Zod validation

## 📦 Components

### 1. **MuseumForm**

Form component cho Museum entity với các tính năng:

- ✅ Comprehensive form fields (name, description, category, location, etc.)
- ✅ Section-based layout (Basic Info, Location, Contact, Operations)
- ✅ Dynamic category selection từ MUSEUM_CATEGORIES
- ✅ Validation với Zod schema
- ✅ Add/Edit modes

### 2. **UserForm**

Form component cho User entity với các tính năng:

- ✅ User information fields (name, email, role, status, etc.)
- ✅ Role selection từ USER_ROLES
- ✅ Avatar URL support
- ✅ Bio textarea
- ✅ Add/Edit modes

### 3. **ViewModal**

Generic modal để xem chi tiết data:

- ✅ **MuseumViewModal** - Specialized cho Museum
- ✅ **UserViewModal** - Specialized cho User
- ✅ **ViewModal<T>** - Generic cho bất kỳ type nào
- ✅ Formatted display với proper styling

### 4. **DeleteConfirmModal**

Reusable confirmation modal:

- ✅ Generic cho mọi entity type
- ✅ Extract name field tự động
- ✅ Warning styling với AlertTriangle icon
- ✅ Loading states

## 🔧 Cách sử dụng

### Import Components

```typescript
import {
  MuseumForm,
  UserForm,
  MuseumViewModal,
  UserViewModal,
  DeleteConfirmModal,
  MuseumFormData,
  UserFormData,
  museumFormSchema,
  userFormSchema,
} from '../TableForm';
```

### Sử dụng MuseumForm

```typescript
const [addModal, setAddModal] = useState(false);
const [editModal, setEditModal] = useState<{ open: boolean; museum: Museum | null }>({
  open: false,
  museum: null,
});

// Add Museum
<MuseumForm
  open={addModal}
  onClose={() => setAddModal(false)}
  title="Thêm Bảo tàng Mới"
  mode="add"
  onSubmit={(data) => {
    console.log('Add museum:', data);
    setAddModal(false);
  }}
/>

// Edit Museum
<MuseumForm
  open={editModal.open}
  onClose={() => setEditModal({ open: false, museum: null })}
  title="Cập nhật Bảo tàng"
  mode="edit"
  defaultValues={editModal.museum ? {
    name: editModal.museum.name,
    description: editModal.museum.description,
    category: editModal.museum.category,
    // ... other fields
  } : undefined}
  onSubmit={(data) => {
    console.log('Update museum:', data);
    setEditModal({ open: false, museum: null });
  }}
/>
```

### Sử dụng ViewModal

```typescript
const [viewModal, setViewModal] = useState<{ open: boolean; museum: Museum | null }>({
  open: false,
  museum: null,
});

<MuseumViewModal
  open={viewModal.open}
  onClose={() => setViewModal({ open: false, museum: null })}
  data={viewModal.museum}
  title="Chi tiết Bảo tàng"
/>
```

### Sử dụng DeleteConfirmModal

```typescript
const [deleteModal, setDeleteModal] = useState<{ open: boolean; museum: Museum | null }>({
  open: false,
  museum: null,
});

<DeleteConfirmModal
  open={deleteModal.open}
  onClose={() => setDeleteModal({ open: false, museum: null })}
  data={deleteModal.museum}
  title="Xóa Bảo tàng"
  onConfirm={() => {
    console.log('Delete museum:', deleteModal.museum?.id);
    setDeleteModal({ open: false, museum: null });
  }}
/>
```

## 🎨 Styling

Tất cả components sử dụng **full shadcn UI** với:

- ✅ Consistent color scheme theo memory preferences
- ✅ White background cards [[memory:2732405]]
- ✅ Black icons without background [[memory:2738144]]
- ✅ Professional admin dashboard styling
- ✅ Responsive design với grid layouts
- ✅ Proper spacing và typography

## 🔄 Integration với Admin Tables

Components này được thiết kế để integrate seamlessly với admin table components:

```typescript
// Trong admin/MuseumList.tsx
import { MuseumForm, MuseumViewModal, DeleteConfirmModal } from '../TableForm';

// Table chỉ focus vào @tanstack/react-table logic
// Forms được handle bởi TableForm components
```

## 📋 Schema Validation

Tất cả forms sử dụng Zod schemas với:

- ✅ Required field validation
- ✅ Email format validation
- ✅ URL format validation
- ✅ Minimum length requirements
- ✅ Enum validation cho categories và statuses
- ✅ Vietnamese error messages

## 🚀 Benefits

1. **Separation of Concerns**: Table logic tách biệt với form logic
2. **Reusability**: Components có thể reuse cho nhiều entities
3. **Type Safety**: Full TypeScript support với proper types
4. **Consistent UI**: Shadcn components đảm bảo consistent styling
5. **Maintainability**: Dễ maintain và extend
6. **Performance**: Optimized với proper state management
