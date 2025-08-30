import React, { useState } from 'react';
import {
  useGetPermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from '@musetrip360/rolebase-management/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Permission } from '@musetrip360/rolebase-management';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Button,
  Input,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@musetrip360/ui-core';
import { Plus, Edit, Trash2, Key, Search } from 'lucide-react';
import { toast } from '@musetrip360/ui-core/sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import get from 'lodash/get';

const permissionFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  resourceGroup: z.string().min(1, 'Resource Group is required'),
});

type PermissionFormData = z.infer<typeof permissionFormSchema>;

const PermissionPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions,
  } = useGetPermissions({
    Page: page,
    PageSize: pageSize,
    Search: searchTerm,
  });

  const createPermissionMutation = useCreatePermission({
    onSuccess: () => {
      toast.success('Permission created successfully');
      setIsCreateDialogOpen(false);
      refetchPermissions();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create permission');
    },
  });

  const updatePermissionMutation = useUpdatePermission({
    onSuccess: () => {
      toast.success('Permission updated successfully');
      setIsEditDialogOpen(false);
      setSelectedPermission(null);
      refetchPermissions();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update permission');
    },
  });

  const deletePermissionMutation = useDeletePermission({
    onSuccess: () => {
      toast.success('Permission deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedPermission(null);
      refetchPermissions();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete permission');
    },
  });

  const createForm = useForm<PermissionFormData>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: '',
      description: '',
      resourceGroup: '',
    },
  });

  const editForm = useForm<PermissionFormData>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: '',
      description: '',
      resourceGroup: '',
    },
  });

  const handleCreatePermission = async (data: PermissionFormData) => {
    await createPermissionMutation.mutateAsync(data);
    createForm.reset();
  };

  const handleEditPermission = async (data: PermissionFormData) => {
    if (!selectedPermission) return;
    await updatePermissionMutation.mutateAsync({
      id: selectedPermission.id,
      ...data,
    });
    editForm.reset();
  };

  const handleEditClick = (permission: Permission) => {
    setSelectedPermission(permission);
    editForm.setValue('name', permission.name);
    editForm.setValue('description', permission.description || '');
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPermission) return;
    await deletePermissionMutation.mutateAsync(selectedPermission.id);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  const permissions = get(permissionsData, 'data', []) as Permission[];
  const totalPages = Math.ceil(get(permissionsData, 'total', 0) / pageSize);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
          <p className="text-muted-foreground mt-2">Manage system permissions and access controls</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Permission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreatePermission)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Permission name (e.g., users.create)" {...field} />
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
                        <Textarea placeholder="Describe what this permission allows" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="resourceGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Group</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the resource group" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createPermissionMutation.isPending}>
                    {createPermissionMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Key className="h-3 w-3" />
            {get(permissionsData, 'total', 0)} Total
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPermissions ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : permissions.length === 0 ? (
            <div className="text-center py-8">
              <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No permissions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? `No permissions match "${searchTerm}"` : 'Get started by creating your first permission'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Permission
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource Group</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-medium">
                              {permission.resourceGroup}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-medium">{permission.name}</code>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-muted-foreground text-sm">
                            {permission.description || 'No description provided'}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(permission)}
                              className="gap-1"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(permission)}
                              className="gap-1 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, get(permissionsData, 'total', 0))}{' '}
                    of {get(permissionsData, 'total', 0)} permissions
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = i + Math.max(1, page - 2);
                        if (pageNumber > totalPages) return null;

                        return (
                          <Button
                            key={pageNumber}
                            variant={page === pageNumber ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Permission Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditPermission)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Permission name" {...field} />
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
                      <Textarea placeholder="Describe what this permission allows" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="resourceGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Group</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the resource group" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updatePermissionMutation.isPending}>
                  {updatePermissionMutation.isPending ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Permission Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the permission
              <strong> "{selectedPermission?.name}"</strong> and remove it from all roles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletePermissionMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePermissionMutation.isPending ? 'Deleting...' : 'Delete Permission'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PermissionPage;
