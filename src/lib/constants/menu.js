import { USER_ROLES } from '@/lib/constants/user.enums';
import
  {
    BookOpen,
    FileText,
    Heart,
    Newspaper,
    PlusCircle,
    Users
  } from 'lucide-react';


export const menuItems = [
  {
    title: 'My Notes',
    icon: FileText,
    href: '/',
    roles: [ USER_ROLES.USER, USER_ROLES.ADMIN ],
  },
  {
    title: 'Create Note',
    icon: PlusCircle,
    href: '/create-note',
    roles: [ USER_ROLES.USER, USER_ROLES.ADMIN ],
  },
  {
    title: 'All Posts',
    icon: Newspaper,
    href: '/posts',
    roles: [ USER_ROLES.USER, USER_ROLES.ADMIN ],
  },
  {
    title: 'My Posts',
    icon: BookOpen,
    href: '/my-posts',
    roles: [ USER_ROLES.USER, USER_ROLES.ADMIN ],
  },
  {
    title: 'Interests',
    icon: Heart,
    href: '/interests',
    roles: [ USER_ROLES.USER, USER_ROLES.ADMIN ],
  },
  {
    title: 'User Management',
    icon: Users,
    href: '/users',
    roles: [ USER_ROLES.ADMIN ],
  },
];