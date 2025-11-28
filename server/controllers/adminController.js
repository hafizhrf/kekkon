import db from '../config/database.js';
import jwt from 'jsonwebtoken';

export function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    const superadminEmail = process.env.SUPERADMIN_EMAIL;
    const superadminPassword = process.env.SUPERADMIN_PASSWORD;

    if (!superadminEmail || !superadminPassword) {
      return res.status(500).json({ error: 'Superadmin credentials not configured' });
    }

    if (email !== superadminEmail || password !== superadminPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { isAdmin: true, email: superadminEmail },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: { email: superadminEmail },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

export function getAllUsers(req, res) {
  try {
    const users = db.prepare(`
      SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.created_at,
        (SELECT COUNT(*) FROM invitations WHERE user_id = u.id) as invitation_count
      FROM users u
      ORDER BY u.created_at DESC
    `).all() || [];

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users', details: error.message });
  }
}

export function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

export function getAllInvitations(req, res) {
  try {
    const invitations = db.prepare(`
      SELECT 
        i.id,
        i.slug,
        i.template_id,
        i.status,
        i.created_at,
        i.updated_at,
        i.expires_at,
        u.email as user_email,
        u.name as user_name,
        ic.bride_name,
        ic.groom_name,
        ic.wedding_date,
        (SELECT COUNT(*) FROM guests WHERE invitation_id = i.id) as guest_count,
        (SELECT COUNT(*) FROM page_views WHERE invitation_id = i.id) as view_count
      FROM invitations i
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN invitation_content ic ON i.id = ic.invitation_id
      ORDER BY i.created_at DESC
    `).all() || [];

    res.json({ invitations });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ error: 'Failed to get invitations', details: error.message });
  }
}

export function deleteInvitationAdmin(req, res) {
  try {
    const { id } = req.params;

    const invitation = db.prepare('SELECT id FROM invitations WHERE id = ?').get(id);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    db.prepare('DELETE FROM invitations WHERE id = ?').run(id);

    res.json({ message: 'Invitation deleted successfully' });
  } catch (error) {
    console.error('Delete invitation error:', error);
    res.status(500).json({ error: 'Failed to delete invitation' });
  }
}

export function getDashboardStats(req, res) {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get()?.count || 0;
    const totalInvitations = db.prepare('SELECT COUNT(*) as count FROM invitations').get()?.count || 0;
    const publishedInvitations = db.prepare("SELECT COUNT(*) as count FROM invitations WHERE status = 'published'").get()?.count || 0;
    const totalPageViews = db.prepare('SELECT COUNT(*) as count FROM page_views').get()?.count || 0;
    const totalGuests = db.prepare('SELECT COUNT(*) as count FROM guests').get()?.count || 0;

    const recentUsers = db.prepare(`
      SELECT id, email, name, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all() || [];

    const recentInvitations = db.prepare(`
      SELECT 
        i.id, i.slug, i.status, i.created_at,
        ic.bride_name, ic.groom_name
      FROM invitations i
      LEFT JOIN invitation_content ic ON i.id = ic.invitation_id
      ORDER BY i.created_at DESC 
      LIMIT 5
    `).all() || [];

    res.json({
      stats: {
        totalUsers,
        totalInvitations,
        publishedInvitations,
        totalPageViews,
        totalGuests,
      },
      recentUsers,
      recentInvitations,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get stats', details: error.message });
  }
}
