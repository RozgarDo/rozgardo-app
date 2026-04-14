const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Login endpoint supporting both Password and Mock-OTP flows
router.post('/login', async (req, res) => {
    const { loginId, password, otp, type } = req.body;
    
    try {
        // Find user by either phone or email
        let query = supabase.from('users').select('*');
        if (loginId.includes('@')) {
            query = query.eq('email', loginId);
        } else {
            query = query.eq('phone', loginId);
        }

        const { data: user, error } = await query.single();
        
        if (error || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (type === 'password') {
            // Check password (In real app, compare hashed password)
            // If they don't have a password column, we'll bypass it for demo if it's undefined
            if (user.password && user.password !== password) {
                return res.status(401).json({ message: 'Incorrect password' });
            }
        } else if (type === 'otp') {
            // Mock OTP verification
            if (otp !== '123456') {
                 return res.status(401).json({ message: 'Invalid OTP entered' });
            }
        }

        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mock sending OTP
router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    // Here you would integrate Twilio or Supabase Auth to actually send the SMS
    // We will just verify if the user exists for the sake of the login flow.
    try {
        const { data, error } = await supabase.from('users').select('*').eq('phone', phone).single();
        if (error) return res.status(404).json({ message: 'User not found. Please register first.' });
        
        // Mock successful OTP dispatch
        res.json({ message: 'OTP Sent successfully (Use 123456 for testing)' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Register: creates a new user profile
router.post('/register', async (req, res) => {
    const { phone, email, password, role, name, skills, location, experience, salary } = req.body;
    try {
        // Safely try inserting basic columns, adding email/password if the DB supports it
        const payload = { phone, role, name, skills, location, experience, salary };
        if (email) payload.email = email;
        if (password) payload.password = password; // In production, hash this!

        const { data, error } = await supabase
            .from('users')
            .insert([payload])
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ message: 'User created successfully', user: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile details
router.put('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Profile updated', user: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch all users for admin management
router.get('/users', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
         res.status(500).json({ error: err.message });
    }
});

module.exports = router;
