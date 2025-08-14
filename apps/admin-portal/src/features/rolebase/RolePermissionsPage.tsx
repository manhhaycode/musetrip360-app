import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRoleById, useGetPermissions, useUpdateRolePermissions } from '@musetrip360/rolebase-management';
import { Permission } from '@musetrip360/user-management';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Button,
  Checkbox,
  Label,
  Badge,
  Separator,
} from '@musetrip360/ui-core';
import { ArrowLeft, Save, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';
import get from 'lodash/get';

const RolePermissionsPage = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [initialPermissions, setInitialPermissions] = useState<Set<string>>(new Set());

  const { data: role, isLoading: isLoadingRole, error: roleError, refetch: refetchRole } = useGetRoleById(roleId!);

  const { data: permissionsData, isLoading: isLoadingPermissions } = useGetPermissions({
    Page: 1,
    PageSize: 1000,
  });

  const updateRolePermissionsMutation = useUpdateRolePermissions({
    onSuccess: () => {
      toast.success('Role permissions updated successfully');
      refetchRole();
      // wait 1s
      setTimeout(() => {
        navigate('/rolebase/roles');
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update role permissions');
    },
  });

  const permissions = get(permissionsData, 'data', []) as Permission[];

  useEffect(() => {
    if (role?.permissions) {
      const currentPermissionIds = new Set(role.permissions.map((p) => p.id));
      setSelectedPermissions(currentPermissionIds);
      setInitialPermissions(currentPermissionIds);
    }
  }, [role]);

  const { addedPermissions, removedPermissions, hasChanges } = useMemo(() => {
    const added = Array.from(selectedPermissions).filter((id) => !initialPermissions.has(id));
    const removed = Array.from(initialPermissions).filter((id) => !selectedPermissions.has(id));
    const changes = added.length > 0 || removed.length > 0;

    return {
      addedPermissions: added,
      removedPermissions: removed,
      hasChanges: changes,
    };
  }, [selectedPermissions, initialPermissions]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(permissionId);
      } else {
        newSet.delete(permissionId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!roleId || !hasChanges) return;

    await updateRolePermissionsMutation.mutateAsync({
      roleId,
      addList: addedPermissions,
      removeList: removedPermissions,
    });
  };

  const handleReset = () => {
    setSelectedPermissions(new Set(initialPermissions));
  };

  if (isLoadingRole || isLoadingPermissions) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (roleError || !role) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Role Not Found</h3>
              <p>The requested role could not be found or you don't have permission to view it.</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/rolebase/roles')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/rolebase/roles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Role Permissions</h1>
            <p className="text-muted-foreground mt-1">
              Configure permissions for <span className="font-medium">{role.name}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              Reset Changes
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!hasChanges || updateRolePermissionsMutation.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {updateRolePermissionsMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Role Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground mt-1">{role.name}</p>
              </div>
              {role.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                </div>
              )}
              <Separator />
              <div>
                <Label className="text-sm font-medium">Current Permissions</Label>
                <Badge variant="secondary" className="mt-2">
                  {selectedPermissions.size} selected
                </Badge>
              </div>
              {hasChanges && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    {addedPermissions.length > 0 && (
                      <div>
                        <Badge variant="default" className="text-green-700 bg-green-50 border-green-200">
                          +{addedPermissions.length} added
                        </Badge>
                      </div>
                    )}
                    {removedPermissions.length > 0 && (
                      <div>
                        <Badge variant="destructive" className="text-red-700 bg-red-50 border-red-200">
                          -{removedPermissions.length} removed
                        </Badge>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Permissions List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Available Permissions ({permissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {permissions.map((permission) => {
                  const isSelected = selectedPermissions.has(permission.id);
                  const wasInitiallySelected = initialPermissions.has(permission.id);
                  const isAdded = isSelected && !wasInitiallySelected;
                  const isRemoved = !isSelected && wasInitiallySelected;

                  return (
                    <div
                      key={permission.id}
                      className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${
                        isAdded
                          ? 'border-green-200 bg-green-50'
                          : isRemoved
                            ? 'border-red-200 bg-red-50'
                            : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        id={permission.id}
                        checked={isSelected}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1 grid gap-1.5 leading-none">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                          {isAdded && (
                            <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                              Added
                            </Badge>
                          )}
                          {isRemoved && (
                            <Badge variant="outline" className="text-xs text-red-700 border-red-300">
                              Removed
                            </Badge>
                          )}
                        </div>
                        {permission.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">{permission.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsPage;
