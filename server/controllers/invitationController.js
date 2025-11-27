import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

function generateSlug(brideName, groomName) {
  const names = `${brideName}-${groomName}`.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${names}-${uuidv4().slice(0, 8)}`;
}

export function getInvitations(req, res) {
  try {
    const invitations = db.prepare(`
      SELECT i.*, ic.bride_name, ic.groom_name, ic.wedding_date,
        (SELECT COUNT(*) FROM guests WHERE invitation_id = i.id) as guest_count,
        (SELECT COUNT(*) FROM guests WHERE invitation_id = i.id AND rsvp_status = 'attending') as attending_count,
        (SELECT COUNT(*) FROM page_views WHERE invitation_id = i.id) as view_count
      FROM invitations i
      LEFT JOIN invitation_content ic ON i.id = ic.invitation_id
      WHERE i.user_id = ?
      ORDER BY i.updated_at DESC
    `).all(req.user.userId);

    res.json({ invitations });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ error: 'Failed to get invitations' });
  }
}

export function getInvitation(req, res) {
  try {
    const invitation = db.prepare(`
      SELECT i.*, ic.*
      FROM invitations i
      LEFT JOIN invitation_content ic ON i.id = ic.invitation_id
      WHERE i.id = ? AND i.user_id = ?
    `).get(req.params.id, req.user.userId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.gallery_images) {
      invitation.gallery_images = JSON.parse(invitation.gallery_images);
    }
    if (invitation.custom_fields) {
      invitation.custom_fields = JSON.parse(invitation.custom_fields);
    }
    if (invitation.gift_bank_accounts) {
      invitation.gift_bank_accounts = JSON.parse(invitation.gift_bank_accounts);
    }
    if (invitation.gift_ewallets) {
      invitation.gift_ewallets = JSON.parse(invitation.gift_ewallets);
    }

    res.json({ invitation });
  } catch (error) {
    console.error('Get invitation error:', error);
    res.status(500).json({ error: 'Failed to get invitation' });
  }
}

export function createInvitation(req, res) {
  try {
    const {
      template_id = 'geometric-modern',
      primary_color,
      secondary_color,
      font_family,
      bride_name,
      bride_parents,
      bride_photo,
      bride_instagram,
      groom_name,
      groom_parents,
      groom_photo,
      groom_instagram,
      wedding_date,
      akad_time,
      akad_venue,
      akad_address,
      akad_lat,
      akad_lng,
      reception_time,
      reception_venue,
      reception_address,
      reception_lat,
      reception_lng,
      music_url,
      story_text,
      gallery_images,
      custom_fields,
      gift_bank_accounts,
      gift_ewallets,
      gift_address,
      enable_rsvp = 1,
      enable_messages = 1,
      enable_countdown = 1,
      enable_gift = 1,
    } = req.body;

    const slug = generateSlug(bride_name, groom_name);

    const invResult = db.prepare(`
      INSERT INTO invitations (user_id, slug, template_id, primary_color, secondary_color, font_family, enable_rsvp, enable_messages, enable_countdown)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.userId,
      slug,
      template_id,
      primary_color || '#D4A373',
      secondary_color || '#FEFAE0',
      font_family || 'playfair',
      enable_rsvp ? 1 : 0,
      enable_messages ? 1 : 0,
      enable_countdown ? 1 : 0
    );

    const invitationId = invResult.lastInsertRowid;

    db.prepare(`
      INSERT INTO invitation_content (
        invitation_id, bride_name, bride_parents, bride_photo, bride_instagram,
        groom_name, groom_parents, groom_photo, groom_instagram,
        wedding_date, akad_time, akad_venue, akad_address, akad_lat, akad_lng,
        reception_time, reception_venue, reception_address, reception_lat, reception_lng,
        music_url, story_text, gallery_images, custom_fields,
        gift_bank_accounts, gift_ewallets, gift_address, enable_gift
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      invitationId,
      bride_name,
      bride_parents || null,
      bride_photo || null,
      bride_instagram || null,
      groom_name,
      groom_parents || null,
      groom_photo || null,
      groom_instagram || null,
      wedding_date,
      akad_time || null,
      akad_venue || null,
      akad_address || null,
      akad_lat || null,
      akad_lng || null,
      reception_time || null,
      reception_venue || null,
      reception_address || null,
      reception_lat || null,
      reception_lng || null,
      music_url || null,
      story_text || null,
      gallery_images ? JSON.stringify(gallery_images) : null,
      custom_fields ? JSON.stringify(custom_fields) : null,
      gift_bank_accounts ? JSON.stringify(gift_bank_accounts) : null,
      gift_ewallets ? JSON.stringify(gift_ewallets) : null,
      gift_address || null,
      enable_gift ? 1 : 0
    );

    res.status(201).json({
      message: 'Invitation created successfully',
      invitation: {
        id: invitationId,
        slug,
      },
    });
  } catch (error) {
    console.error('Create invitation error:', error);
    res.status(500).json({ error: 'Failed to create invitation' });
  }
}

export function updateInvitation(req, res) {
  try {
    const { id } = req.params;
    
    const existing = db.prepare('SELECT id FROM invitations WHERE id = ? AND user_id = ?')
      .get(id, req.user.userId);
    
    if (!existing) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const {
      template_id,
      primary_color,
      secondary_color,
      font_family,
      status,
      bride_name,
      bride_parents,
      bride_photo,
      bride_instagram,
      groom_name,
      groom_parents,
      groom_photo,
      groom_instagram,
      wedding_date,
      akad_time,
      akad_venue,
      akad_address,
      akad_lat,
      akad_lng,
      reception_time,
      reception_venue,
      reception_address,
      reception_lat,
      reception_lng,
      music_url,
      story_text,
      gallery_images,
      custom_fields,
      gift_bank_accounts,
      gift_ewallets,
      gift_address,
      enable_rsvp,
      enable_messages,
      enable_countdown,
      enable_gift,
    } = req.body;

    db.prepare(`
      UPDATE invitations SET
        template_id = COALESCE(?, template_id),
        primary_color = COALESCE(?, primary_color),
        secondary_color = COALESCE(?, secondary_color),
        font_family = COALESCE(?, font_family),
        status = COALESCE(?, status),
        enable_rsvp = COALESCE(?, enable_rsvp),
        enable_messages = COALESCE(?, enable_messages),
        enable_countdown = COALESCE(?, enable_countdown),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      template_id,
      primary_color,
      secondary_color,
      font_family,
      status,
      enable_rsvp !== undefined ? (enable_rsvp ? 1 : 0) : null,
      enable_messages !== undefined ? (enable_messages ? 1 : 0) : null,
      enable_countdown !== undefined ? (enable_countdown ? 1 : 0) : null,
      id
    );

    db.prepare(`
      UPDATE invitation_content SET
        bride_name = COALESCE(?, bride_name),
        bride_parents = COALESCE(?, bride_parents),
        bride_photo = COALESCE(?, bride_photo),
        bride_instagram = COALESCE(?, bride_instagram),
        groom_name = COALESCE(?, groom_name),
        groom_parents = COALESCE(?, groom_parents),
        groom_photo = COALESCE(?, groom_photo),
        groom_instagram = COALESCE(?, groom_instagram),
        wedding_date = COALESCE(?, wedding_date),
        akad_time = COALESCE(?, akad_time),
        akad_venue = COALESCE(?, akad_venue),
        akad_address = COALESCE(?, akad_address),
        akad_lat = COALESCE(?, akad_lat),
        akad_lng = COALESCE(?, akad_lng),
        reception_time = COALESCE(?, reception_time),
        reception_venue = COALESCE(?, reception_venue),
        reception_address = COALESCE(?, reception_address),
        reception_lat = COALESCE(?, reception_lat),
        reception_lng = COALESCE(?, reception_lng),
        music_url = COALESCE(?, music_url),
        story_text = COALESCE(?, story_text),
        gallery_images = COALESCE(?, gallery_images),
        custom_fields = COALESCE(?, custom_fields),
        gift_bank_accounts = COALESCE(?, gift_bank_accounts),
        gift_ewallets = COALESCE(?, gift_ewallets),
        gift_address = COALESCE(?, gift_address),
        enable_gift = COALESCE(?, enable_gift)
      WHERE invitation_id = ?
    `).run(
      bride_name,
      bride_parents,
      bride_photo,
      bride_instagram,
      groom_name,
      groom_parents,
      groom_photo,
      groom_instagram,
      wedding_date,
      akad_time,
      akad_venue,
      akad_address,
      akad_lat,
      akad_lng,
      reception_time,
      reception_venue,
      reception_address,
      reception_lat,
      reception_lng,
      music_url,
      story_text,
      gallery_images ? JSON.stringify(gallery_images) : null,
      custom_fields ? JSON.stringify(custom_fields) : null,
      gift_bank_accounts ? JSON.stringify(gift_bank_accounts) : null,
      gift_ewallets ? JSON.stringify(gift_ewallets) : null,
      gift_address,
      enable_gift !== undefined ? (enable_gift ? 1 : 0) : null,
      id
    );

    res.json({ message: 'Invitation updated successfully' });
  } catch (error) {
    console.error('Update invitation error:', error);
    res.status(500).json({ error: 'Failed to update invitation' });
  }
}

export function deleteInvitation(req, res) {
  try {
    const { id } = req.params;
    
    const result = db.prepare('DELETE FROM invitations WHERE id = ? AND user_id = ?')
      .run(id, req.user.userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    res.json({ message: 'Invitation deleted successfully' });
  } catch (error) {
    console.error('Delete invitation error:', error);
    res.status(500).json({ error: 'Failed to delete invitation' });
  }
}

export function publishInvitation(req, res) {
  try {
    const { id } = req.params;
    
    const result = db.prepare(`
      UPDATE invitations SET status = 'published', updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(id, req.user.userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const invitation = db.prepare('SELECT slug FROM invitations WHERE id = ?').get(id);

    res.json({ 
      message: 'Invitation published successfully',
      slug: invitation.slug,
    });
  } catch (error) {
    console.error('Publish invitation error:', error);
    res.status(500).json({ error: 'Failed to publish invitation' });
  }
}

export function getPublicInvitation(req, res) {
  try {
    const { slug } = req.params;
    const guestName = req.query.to;

    const invitation = db.prepare(`
      SELECT i.*, ic.*
      FROM invitations i
      LEFT JOIN invitation_content ic ON i.id = ic.invitation_id
      WHERE i.slug = ? AND i.status = 'published'
    `).get(slug);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    db.prepare(`
      INSERT INTO page_views (invitation_id, guest_name, ip_address, user_agent)
      VALUES (?, ?, ?, ?)
    `).run(invitation.id, guestName || null, req.ip, req.get('User-Agent'));

    if (invitation.gallery_images) {
      invitation.gallery_images = JSON.parse(invitation.gallery_images);
    }
    if (invitation.custom_fields) {
      invitation.custom_fields = JSON.parse(invitation.custom_fields);
    }
    if (invitation.gift_bank_accounts) {
      invitation.gift_bank_accounts = JSON.parse(invitation.gift_bank_accounts);
    }
    if (invitation.gift_ewallets) {
      invitation.gift_ewallets = JSON.parse(invitation.gift_ewallets);
    }

    delete invitation.user_id;

    res.json({ 
      invitation,
      guestName: guestName || null,
    });
  } catch (error) {
    console.error('Get public invitation error:', error);
    res.status(500).json({ error: 'Failed to get invitation' });
  }
}

export function getAnalytics(req, res) {
  try {
    const { id } = req.params;

    const invitation = db.prepare('SELECT id FROM invitations WHERE id = ? AND user_id = ?')
      .get(id, req.user.userId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const totalViews = db.prepare('SELECT COUNT(*) as count FROM page_views WHERE invitation_id = ?')
      .get(id).count;

    const rsvpStats = db.prepare(`
      SELECT 
        rsvp_status,
        COUNT(*) as count,
        SUM(attendance_count) as total_attendance
      FROM guests 
      WHERE invitation_id = ?
      GROUP BY rsvp_status
    `).all(id);

    const recentMessages = db.prepare(`
      SELECT name, message, created_at 
      FROM guests 
      WHERE invitation_id = ? AND message IS NOT NULL AND message != ''
      ORDER BY created_at DESC
      LIMIT 10
    `).all(id);

    const viewsByDay = db.prepare(`
      SELECT DATE(viewed_at) as date, COUNT(*) as count
      FROM page_views
      WHERE invitation_id = ?
      GROUP BY DATE(viewed_at)
      ORDER BY date DESC
      LIMIT 30
    `).all(id);

    res.json({
      totalViews,
      rsvpStats,
      recentMessages,
      viewsByDay,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
}
