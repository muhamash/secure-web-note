'use client';

import
  {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import
  {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
import
  {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import
  {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import
  {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { INTEREST_OPTIONS } from '@/lib/constants';
import { USER_ROLES } from '@/lib/constants/user.enums';
import { deleteUserAction } from '@/lib/services/admin/admin.service';
import { registerUser } from '@/lib/services/auth/auth.service';
import { validateForm } from '@/lib/services/auth/auth.validation';
import { Lock, Mail, MoreVertical, Shield, Trash2, User, UserCircle, UserPlus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function UsersPage({ allUsers, meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.USER,
    interests: [],
  });

  const [errors, setErrors] = useState({});

  console.log(meta, allUsers?.data);
  const currentPage = Number(searchParams.get('page')) || 1;
  const usersPerPage = meta?.limit || 1;
  const totalPages = meta?.totalPages || 1;

  const handleDelete = async (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    const res = await deleteUserAction(userToDelete?._id);
    if (res.success) {
      toast.success('User deleted successfully');
      window.location.reload();
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const updatePage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page);
    router.push(`/users?${params.toString()}`);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);

      if (exists) {
        return {
          ...prev,
          interests: prev.interests.filter((i) => i !== interest),
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest],
        };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: USER_ROLES.USER,
      interests: [],
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rules = {
      name: [
        { validate: (v) => v?.trim() !== '', message: 'Name is required' }
      ],
      email: [
        { validate: (v) => v?.trim() !== '', message: 'Email is required' },
        { validate: (v) => /\S+@\S+\.\S+/.test(v), message: 'Invalid email format' }
      ],
      password: [
        { validate: (v) => v?.length >= 6, message: 'Password must be at least 6 characters' }
      ],
      confirmPassword: [
        { validate: (v, data) => v === data.password, message: 'Passwords do not match' }
      ],
      interests: [
        {
          validate: (v) => Array.isArray(v) && v.length > 0,
          message: 'Please select at least one interest'
        }
      ]
    };

    // Validate form
    if (!validateForm(formData, setErrors, rules)) return;

    const newUser = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.confirmPassword,
      interests: formData.interests,
    };

    try {
      const registeredUser = await registerUser(newUser);

      if (registeredUser?.error || registeredUser?.statusCode !== 201) {
        toast.error(registeredUser.error || 'Failed to create user');
        return;
      }

      if (registeredUser?.statusCode === 201) {
        toast.success('User created successfully');
        setAddUserDialogOpen(false);
        resetForm();
        window.location.reload();
      }
    } catch (error) {
      console.error('User creation failed:', error.message);
      toast.error(error?.message || 'Failed to create user!');
      setErrors({ apiError: error.message });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            User Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage all users in the system
          </p>
        </div>
        <Button
          onClick={() => setAddUserDialogOpen(true)}
          className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Interests</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    No users found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              allUsers?.data?.map((user) => (
                <TableRow key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell className="font-medium text-slate-900 dark:text-white">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                      className={
                        user.role === 'ADMIN'
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700'
                          : 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.interests?.slice(0, 2).map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {user.interests?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.interests.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button disabled={user?.role === USER_ROLES.ADMIN} variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDelete(user)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => updatePage(page)}
              className={currentPage === page ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={(open) => {
        setAddUserDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with role and interests
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Role</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="pl-10 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={USER_ROLES.USER}>
                      <div className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4" />
                        User
                      </div>
                    </SelectItem>
                    <SelectItem value={USER_ROLES.ADMIN}>
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Interests</Label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = formData.interests.includes(interest);

                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1 rounded-full text-sm border transition-all
                        ${isSelected
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                        }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
              {errors.interests && (
                <p className="text-sm text-red-500">{errors.interests}</p>
              )}
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddUserDialogOpen(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user &quot;{userToDelete?.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}