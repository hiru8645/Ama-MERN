// Enhanced role management utility
export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN: 'super_admin',
  INVENTORY_MANAGER: 'inventory_manager'
};

export const AdminTypes = {
  GENERAL: 'general',
  INVENTORY_MANAGER: 'inventory_manager'
};

export const checkUserRole = (user) => {
  if (!user) return null;
  
  // Check for inventory manager admin
  if (user.email === 'ransharipremarathna@gmail.com' || user.adminType === 'inventory_manager') {
    return UserRoles.INVENTORY_MANAGER;
  }
  
  // Check for general admin email (hardcoded admin)
  if (user.email === 'admin@gmail.com') {
    return UserRoles.ADMIN;
  }
  
  // Check role from database
  if (user.role === 'admin' || user.role === 'super_admin') {
    return UserRoles.ADMIN;
  }
  
  return UserRoles.USER;
};

export const isAdmin = (user) => {
  const role = checkUserRole(user);
  return role === UserRoles.ADMIN || role === UserRoles.SUPER_ADMIN || role === UserRoles.INVENTORY_MANAGER;
};

export const isInventoryManager = (user) => {
  const role = checkUserRole(user);
  return role === UserRoles.INVENTORY_MANAGER;
};

export const hasPermission = (user, permission) => {
  const role = checkUserRole(user);
  
  const permissions = {
    [UserRoles.ADMIN]: [
      'view_all_orders',
      'approve_orders',
      'reject_orders',
      'delete_orders',
      'manage_users',
      'view_analytics',
      'export_data',
      'access_inventory',
      'manage_inventory'
    ],
    [UserRoles.INVENTORY_MANAGER]: [
      'access_inventory',
      'manage_inventory',
      'view_inventory_analytics',
      'manage_books',
      'view_orders',
      'export_inventory_data'
    ],
    [UserRoles.USER]: [
      'view_own_orders',
      'place_orders',
      'cancel_own_orders',
      'view_books',
      'view_all_orders'  // Add this permission for users to access Order panel
    ]
  };
  
  return permissions[role]?.includes(permission) || false;
};