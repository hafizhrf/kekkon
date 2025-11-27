import db from '../config/database.js';

export function getGuests(req, res) {
  try {
    const { id } = req.params;

    const invitation = db.prepare('SELECT id FROM invitations WHERE id = ? AND user_id = ?')
      .get(id, req.user.userId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const guests = db.prepare(`
      SELECT * FROM guests 
      WHERE invitation_id = ?
      ORDER BY created_at DESC
    `).all(id);

    res.json({ guests });
  } catch (error) {
    console.error('Get guests error:', error);
    res.status(500).json({ error: 'Failed to get guests' });
  }
}

export function addGuest(req, res) {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    const invitation = db.prepare('SELECT id FROM invitations WHERE id = ? AND user_id = ?')
      .get(id, req.user.userId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const result = db.prepare(`
      INSERT INTO guests (invitation_id, name, phone)
      VALUES (?, ?, ?)
    `).run(id, name, phone || null);

    res.status(201).json({
      message: 'Guest added successfully',
      guest: {
        id: result.lastInsertRowid,
        name,
        phone,
      },
    });
  } catch (error) {
    console.error('Add guest error:', error);
    res.status(500).json({ error: 'Failed to add guest' });
  }
}

export function bulkAddGuests(req, res) {
  try {
    const { id } = req.params;
    const { guests } = req.body;

    const invitation = db.prepare('SELECT id FROM invitations WHERE id = ? AND user_id = ?')
      .get(id, req.user.userId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const insertGuest = db.prepare(`
      INSERT INTO guests (invitation_id, name, phone)
      VALUES (?, ?, ?)
    `);

    const insertMany = db.transaction((guestList) => {
      for (const guest of guestList) {
        insertGuest.run(id, guest.name, guest.phone || null);
      }
    });

    insertMany(guests);

    res.status(201).json({
      message: `${guests.length} guests added successfully`,
    });
  } catch (error) {
    console.error('Bulk add guests error:', error);
    res.status(500).json({ error: 'Failed to add guests' });
  }
}

export function updateGuest(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, rsvp_status, attendance_count, message } = req.body;

    const guest = db.prepare(`
      SELECT g.* FROM guests g
      JOIN invitations i ON g.invitation_id = i.id
      WHERE g.id = ? AND i.user_id = ?
    `).get(id, req.user.userId);

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    db.prepare(`
      UPDATE guests SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        rsvp_status = COALESCE(?, rsvp_status),
        attendance_count = COALESCE(?, attendance_count),
        message = COALESCE(?, message)
      WHERE id = ?
    `).run(name, phone, rsvp_status, attendance_count, message, id);

    res.json({ message: 'Guest updated successfully' });
  } catch (error) {
    console.error('Update guest error:', error);
    res.status(500).json({ error: 'Failed to update guest' });
  }
}

export function deleteGuest(req, res) {
  try {
    const { id } = req.params;

    const result = db.prepare(`
      DELETE FROM guests WHERE id = ? AND invitation_id IN (
        SELECT id FROM invitations WHERE user_id = ?
      )
    `).run(id, req.user.userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Delete guest error:', error);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
}

export function submitRSVP(req, res) {
  try {
    const { slug } = req.params;
    const { name, rsvp_status, message, attendance_count = 1 } = req.body;

    const invitation = db.prepare(`
      SELECT id, enable_rsvp, enable_messages FROM invitations 
      WHERE slug = ? AND status = 'published'
    `).get(slug);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (!invitation.enable_rsvp) {
      return res.status(400).json({ error: 'RSVP is disabled for this invitation' });
    }

    const existingGuest = db.prepare(`
      SELECT id FROM guests WHERE invitation_id = ? AND name = ?
    `).get(invitation.id, name);

    if (existingGuest) {
      db.prepare(`
        UPDATE guests SET
          rsvp_status = ?,
          attendance_count = ?,
          message = ?
        WHERE id = ?
      `).run(
        rsvp_status,
        attendance_count,
        invitation.enable_messages ? message : null,
        existingGuest.id
      );
    } else {
      db.prepare(`
        INSERT INTO guests (invitation_id, name, rsvp_status, attendance_count, message)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        invitation.id,
        name,
        rsvp_status,
        attendance_count,
        invitation.enable_messages ? message : null
      );
    }

    res.json({ message: 'RSVP submitted successfully' });
  } catch (error) {
    console.error('Submit RSVP error:', error);
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
}

export function getMessages(req, res) {
  try {
    const { slug } = req.params;

    const invitation = db.prepare(`
      SELECT id FROM invitations WHERE slug = ? AND status = 'published'
    `).get(slug);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const messages = db.prepare(`
      SELECT name, message, created_at 
      FROM guests 
      WHERE invitation_id = ? AND message IS NOT NULL AND message != ''
      ORDER BY created_at DESC
    `).all(invitation.id);

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}
