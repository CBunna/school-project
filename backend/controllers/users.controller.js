const pool = require('../config/database');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, email, first_name, last_name, role, created_at, updated_at
             FROM users
             ORDER BY created_at DESC`
        );

        res.json({
            users: result.rows,
            count: result.rows.length
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// Update user (Admin can update any user, users can update themselves)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, role } = req.body;

        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Only admin can change roles
        if (role && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can change user roles' });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (first_name) {
            updates.push(`first_name = $${paramCount++}`);
            values.push(first_name);
        }
        if (last_name) {
            updates.push(`last_name = $${paramCount++}`);
            values.push(last_name);
        }
        if (email) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (role && req.user.role === 'admin') {
            updates.push(`role = $${paramCount++}`);
            values.push(role);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE users
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, email, first_name, last_name, role, updated_at
        `;

        const result = await pool.query(query, values);

        res.json({
            message: 'User updated successfully',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Error updating user:', error);

        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }

        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING email',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: `User ${result.rows[0].email} deleted successfully`
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// Get user statistics (Admin only)
const getUserStats = async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT
                COUNT(*) as total_users,
                COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
                COUNT(*) FILTER (WHERE role = 'user') as user_count,
                COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30days,
                COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_users_7days
            FROM users
        `);

        res.json({ stats: stats.rows[0] });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserStats
};
