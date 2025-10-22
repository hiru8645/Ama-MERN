// Role-based access control middleware
const adminAuth = (req, res, next) => {
  // For now, we'll use a simple check, but this should be enhanced with JWT tokens
  const userRole = req.headers['user-role'];
  const userEmail = req.headers['user-email'];
  
  // Check if user is admin
  if (userRole === 'admin' || userEmail === 'admin@gmail.com') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

const userAuth = (req, res, next) => {
  // Check if user is authenticated (basic check)
  const userId = req.headers['user-id'];
  
  if (userId) {
    req.userId = userId;
    next();
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required.' 
    });
  }
};

const ownerOrAdmin = (req, res, next) => {
  const userRole = req.headers['user-role'];
  const userEmail = req.headers['user-email'];
  const userId = req.headers['user-id'];
  
  // Admin can access anything
  if (userRole === 'admin' || userEmail === 'admin@gmail.com') {
    req.isAdmin = true;
    next();
  }
  // Users can only access their own resources
  else if (userId) {
    req.userId = userId;
    req.isAdmin = false;
    next();
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required.' 
    });
  }
};

module.exports = {
  adminAuth,
  userAuth,
  ownerOrAdmin
};