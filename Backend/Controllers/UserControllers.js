const User = require("../Model/UserModel");
const nodemailer = require("nodemailer");
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Get all users
const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
    }

    // not found
    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    // Display all users
    return res.status(200).json({ users });
};

// Add user
const addUser = async (req, res, next) => {
    const { full_name, email, uni_id, password, role, contact_no, faculty } = req.body;

    console.log('Received add user request:', { full_name, email, uni_id, role, contact_no, faculty, hasPassword: !!password });

    try {
        // Check for existing email or uni_id
        const existingUser = await User.findOne({ $or: [{ email }, { uni_id }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email is already registered" });
            }
            if (existingUser.uni_id === uni_id) {
                return res.status(400).json({ message: "University ID is already registered" });
            }
        }

        const user = new User({
            full_name,
            email,
            uni_id,
            password,
            role,
            contact_no,
            faculty
        });
        await user.save();

        // Send welcome email
        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Welcome to Helpdesk Management System',
            text: `Hello ${full_name},\n\nYour account has been created successfully!\n\nUsername: ${email}\n\nThank you for registering.\n\n- Helpdesk Team`,
            html: `
              <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
                <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(44,62,80,0.07); padding: 32px;">
                  <h2 style="color: #2980b9; margin-bottom: 16px;">Welcome to Helpdesk Management System!</h2>
                  <p style="font-size: 1.1rem; color: #222;">Hello <b>${full_name}</b>,</p>
                  <p style="font-size: 1.05rem; color: #333; margin-bottom: 18px;">
                    Your account has been created successfully.<br>
                    <b>Username:</b> <span style="color:#2980b9">${email}</span>
                  </p>
                  <div style="background: #eaf6fb; border-radius: 6px; padding: 16px; margin-bottom: 18px;">
                    <p style="margin:0; color:#2980b9; font-weight:600;">You can now log in and start using the Helpdesk platform.</p>
                  </div>
                  <p style="font-size: 1rem; color: #555;">Thank you for registering.<br>- Helpdesk Team</p>
                  <div style="margin-top: 32px; text-align: center; color: #aaa; font-size: 0.95rem;">
                    &copy; ${new Date().getFullYear()} Helpdesk Management System
                  </div>
                </div>
              </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        return res.status(201).json({ user });
    } catch (err) {
        console.log('Error adding user:', err);
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        
        // Handle duplicate key errors
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern)[0];
            return res.status(400).json({ 
                message: `${duplicateField === 'email' ? 'Email' : 'University ID'} is already registered` 
            });
        }
        
        return res.status(500).json({ message: "Unable to add user. Please try again." });
    }
};
//Get by Id
const getById = async(req, res, next) =>{
    const id = req.params.id;
    let user;
    try{
        user = await User.findById(id);
    }catch(err){
        console.log(err);
    }
    //not available users
     if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
};
//update User Details
const updateUser = async (req,res,next) =>{
     const id = req.params.id;
     const { full_name, email, uni_id, password, role, contact_no, faculty } = req.body;

     let user;

      try{
        // Use {new: true} to return the updated document
        user = await User.findByIdAndUpdate(
            id,
            {full_name:full_name, email:email, uni_id:uni_id, password:password, role:role, contact_no:contact_no, faculty:faculty},
            {new: true}
        );
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error updating user details" });
    }
     if (!user) {
        return res.status(404).json({ message: "Unable to update user details" });
    }

    return res.status(200).json({ user });
};
//Delete User Details
const deleteUser = async (req,res,next) =>{
    const id = req.params.id;

    let user;
    try{
        user= await User.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }
    if (!user) {
        return res.status(404).json({ message: "Unableto to delete " });
    }

    return res.status(200).json({ user });
};
// Login user
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    let user;
    try {
        user = await User.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    // Simple password check (for demo; use hashing in production!)
    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    // You can add JWT here if needed
    return res.status(200).json({ message: "Login successful", user });
};

// Change password (for users)
const changePassword = async (req, res, next) => {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        if (user.password !== currentPassword) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to change password" });
    }
};

// Reset password (for admin)
const resetPassword = async (req, res, next) => {
    const id = req.params.id;
    const { newPassword } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update password directly (admin action)
        user.password = newPassword;
        await user.save();

        // Send email notification to user
        const mailOptions = {
            from: EMAIL_USER,
            to: user.email,
            subject: 'Password Reset - Helpdesk Management System',
            text: `Hello ${user.full_name},\n\nYour password has been reset by an administrator.\n\nPlease log in with your new password and consider changing it for security.\n\n- Helpdesk Team`,
            html: `
              <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
                <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(44,62,80,0.07); padding: 32px;">
                  <h2 style="color: #e74c3c; margin-bottom: 16px;">Password Reset Notification</h2>
                  <p style="font-size: 1.1rem; color: #222;">Hello <b>${user.full_name}</b>,</p>
                  <p style="font-size: 1.05rem; color: #333; margin-bottom: 18px;">
                    Your password has been reset by an administrator.
                  </p>
                  <div style="background: #fef5e7; border-radius: 6px; padding: 16px; margin-bottom: 18px;">
                    <p style="margin:0; color:#d68910; font-weight:600;">Please log in with your new password and consider changing it for security.</p>
                  </div>
                  <p style="font-size: 1rem; color: #555;">If you did not request this change, please contact the administrator immediately.<br>- Helpdesk Team</p>
                  <div style="margin-top: 32px; text-align: center; color: #aaa; font-size: 0.95rem;">
                    &copy; ${new Date().getFullYear()} Helpdesk Management System
                  </div>
                </div>
              </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending password reset email:', error);
            } else {
                console.log('Password reset email sent:', info.response);
            }
        });

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to reset password" });
    }
};

exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
exports.changePassword = changePassword;
exports.resetPassword = resetPassword;
