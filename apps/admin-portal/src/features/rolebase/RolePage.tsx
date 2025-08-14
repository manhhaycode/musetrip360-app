import React, { useState } from 'react';
import {
  useGetRoles,
  useCreateRole,
  useUpdateRole,
  useUpdateRolePermissions,
  useGetPermissions,
} from '@musetrip360/rolebase-management/api';
import { Role } from '@musetrip360/rolebase-management';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Textarea,
  Checkbox,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@musetrip360/ui-core';
import { Plus, Edit, Users, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import get from 'lodash/get';
import { Permission } from '@musetrip360/user-management';

const roleFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

const RolePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsSheetOpen, setIsPermissionsSheetOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    refetch: refetchRoles,
  } = useGetRoles({
    Page: 1,
    PageSize: 100,
    Search: searchTerm,
  });

  const { data: permissionsData } = useGetPermissions({ Page: 1, PageSize: 1000 });

  const createRoleMutation = useCreateRole({
    onSuccess: () => {
      toast.success('Role created successfully');
      setIsCreateDialogOpen(false);
      refetchRoles();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create role');
    },
  });

  const updateRoleMutation = useUpdateRole({
    onSuccess: () => {
      toast.success('Role updated successfully');
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      refetchRoles();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update role');
    },
  });

  const updateRolePermissionsMutation = useUpdateRolePermissions({
    onSuccess: () => {
      toast.success('Role permissions updated successfully');
      setIsPermissionsSheetOpen(false);
      setSelectedRole(null);
      refetchRoles();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update role permissions');
    },
  });

  const createForm = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const editForm = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleCreateRole = async (data: RoleFormData) => {
    await createRoleMutation.mutateAsync(data);
    createForm.reset();
  };

  const handleEditRole = async (data: RoleFormData) => {
    if (!selectedRole) return;
    await updateRoleMutation.mutateAsync({
      roleId: selectedRole.id,
      ...data,
    });
    editForm.reset();
  };

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    editForm.setValue('name', role.name);
    editForm.setValue('description', role.description || '');
    setIsEditDialogOpen(true);
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionsSheetOpen(true);
  };

  const handlePermissionsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRole) return;

    const formData = new FormData(event.currentTarget);
    const selectedPermissionIds = Array.from(formData.getAll('permissions')).map(String);

    await updateRolePermissionsMutation.mutateAsync({
      roleId: selectedRole.id,
      permissionIds: selectedPermissionIds,
    });
  };

  const roles = get(rolesData, 'data', []) as Role[];
  const permissions = get(permissionsData, 'data', []) as Permission[];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground mt-2">Manage system roles and their permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateRole)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Role name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Role description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createRoleMutation.isPending}>
                    {createRoleMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles ({rolesData?.totalItems || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRoles ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell className="text-muted-foreground">{role.description || 'No description'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{role.permissions?.length || 0} permissions</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(role)} className="gap-1">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManagePermissions(role)}
                            className="gap-1"
                          >
                            <Users className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditRole)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Role name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Role description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateRoleMutation.isPending}>
                  {updateRoleMutation.isPending ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Manage Permissions Sheet */}
      <Sheet open={isPermissionsSheetOpen} onOpenChange={setIsPermissionsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Manage Permissions - {selectedRole?.name}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <form onSubmit={handlePermissionsSubmit} className="space-y-4">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {permissions.map((permission) => {
                  const isChecked = selectedRole?.permissions?.some((p) => p.id === permission.id) || false;

                  return (
                    <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={permission.id}
                        name="permissions"
                        value={permission.id}
                        defaultChecked={isChecked}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </Label>
                        {permission.description && (
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsPermissionsSheetOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateRolePermissionsMutation.isPending}>
                  {updateRolePermissionsMutation.isPending ? 'Updating...' : 'Update Permissions'}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RolePage;
