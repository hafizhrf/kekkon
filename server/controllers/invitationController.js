import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    if (invitation.gift_wishlist) {
      invitation.gift_wishlist = JSON.parse(invitation.gift_wishlist);
    }
    if (invitation.custom_colors) {
      invitation.custom_colors = JSON.parse(invitation.custom_colors);
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
      custom_colors,
      is_muslim = 1,
      bride_name,
      bride_parents,
      bride_photo,
      bride_instagram,
      groom_name,
      groom_parents,
      groom_photo,
      groom_instagram,
      main_image_1,
      main_image_2,
      home_image,
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
      gift_wishlist,
      enable_rsvp = 1,
      enable_messages = 1,
      enable_countdown = 1,
      enable_gift = 1,
    } = req.body;

    const slug = generateSlug(bride_name, groom_name);

    const invResult = db.prepare(`
      INSERT INTO invitations (user_id, slug, template_id, primary_color, secondary_color, font_family, custom_colors, enable_rsvp, enable_messages, enable_countdown)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.userId,
      slug,
      template_id,
      primary_color || '#D4A373',
      secondary_color || '#FEFAE0',
      font_family || 'playfair',
      custom_colors ? JSON.stringify(custom_colors) : null,
      enable_rsvp ? 1 : 0,
      enable_messages ? 1 : 0,
      enable_countdown ? 1 : 0
    );

    const invitationId = invResult.lastInsertRowid;

    db.prepare(`
      INSERT INTO invitation_content (
        invitation_id, is_muslim, bride_name, bride_parents, bride_photo, bride_instagram,
        groom_name, groom_parents, groom_photo, groom_instagram,
        main_image_1, main_image_2, home_image,
        wedding_date, akad_time, akad_venue, akad_address, akad_lat, akad_lng,
        reception_time, reception_venue, reception_address, reception_lat, reception_lng,
        music_url, story_text, gallery_images, custom_fields,
        gift_bank_accounts, gift_ewallets, gift_address, gift_wishlist, enable_gift
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      invitationId,
      is_muslim ? 1 : 0,
      bride_name,
      bride_parents || null,
      bride_photo || null,
      bride_instagram || null,
      groom_name,
      groom_parents || null,
      groom_photo || null,
      groom_instagram || null,
      main_image_1 || null,
      main_image_2 || null,
      home_image || null,
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
      gift_wishlist ? JSON.stringify(gift_wishlist) : null,
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
      custom_colors,
      status,
      is_muslim,
      bride_name,
      bride_parents,
      bride_photo,
      bride_instagram,
      groom_name,
      groom_parents,
      groom_photo,
      groom_instagram,
      main_image_1,
      main_image_2,
      home_image,
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
      gift_wishlist,
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
        custom_colors = COALESCE(?, custom_colors),
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
      custom_colors ? JSON.stringify(custom_colors) : null,
      status,
      enable_rsvp !== undefined ? (enable_rsvp ? 1 : 0) : null,
      enable_messages !== undefined ? (enable_messages ? 1 : 0) : null,
      enable_countdown !== undefined ? (enable_countdown ? 1 : 0) : null,
      id
    );

    db.prepare(`
      UPDATE invitation_content SET
        is_muslim = COALESCE(?, is_muslim),
        bride_name = COALESCE(?, bride_name),
        bride_parents = COALESCE(?, bride_parents),
        bride_photo = COALESCE(?, bride_photo),
        bride_instagram = COALESCE(?, bride_instagram),
        groom_name = COALESCE(?, groom_name),
        groom_parents = COALESCE(?, groom_parents),
        groom_photo = COALESCE(?, groom_photo),
        groom_instagram = COALESCE(?, groom_instagram),
        main_image_1 = COALESCE(?, main_image_1),
        main_image_2 = COALESCE(?, main_image_2),
        home_image = COALESCE(?, home_image),
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
        gift_wishlist = COALESCE(?, gift_wishlist),
        enable_gift = COALESCE(?, enable_gift)
      WHERE invitation_id = ?
    `).run(
      is_muslim !== undefined ? (is_muslim ? 1 : 0) : null,
      bride_name,
      bride_parents,
      bride_photo,
      bride_instagram,
      groom_name,
      groom_parents,
      groom_photo,
      groom_instagram,
      main_image_1,
      main_image_2,
      home_image,
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
      gift_wishlist ? JSON.stringify(gift_wishlist) : null,
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
    if (invitation.gift_wishlist) {
      invitation.gift_wishlist = JSON.parse(invitation.gift_wishlist);
    }
    if (invitation.custom_colors) {
      invitation.custom_colors = JSON.parse(invitation.custom_colors);
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

// Generate OG Image for social sharing
export async function getOGImage(req, res) {
  try {
    const { slug } = req.params;
    
    const invitation = db.prepare(`
      SELECT ic.bride_name, ic.groom_name, ic.bride_photo, ic.groom_photo, 
             ic.wedding_date, ic.primary_color, ic.secondary_color
      FROM invitations i
      LEFT JOIN invitation_content ic ON i.id = ic.invitation_id
      WHERE i.slug = ?
    `).get(slug);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const width = 1200;
    const height = 630; // 1.91:1 ratio (standard OG image)
    
    const primaryColor = invitation.primary_color || '#D4A373';
    const secondaryColor = invitation.secondary_color || '#FEFAE0';
    
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 212, g: 163, b: 115 };
    };
    
    const primary = hexToRgb(primaryColor);
    const secondary = hexToRgb(secondaryColor);

    // Create base image with gradient background
    const svgBackground = `
      <svg width="${width}" height="${height}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(${secondary.r},${secondary.g},${secondary.b});stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(${Math.max(0, secondary.r - 20)},${Math.max(0, secondary.g - 20)},${Math.max(0, secondary.b - 10)});stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        
        <!-- Decorative circles -->
        <circle cx="100" cy="100" r="150" fill="rgb(${primary.r},${primary.g},${primary.b})" opacity="0.1"/>
        <circle cx="1100" cy="530" r="200" fill="rgb(${primary.r},${primary.g},${primary.b})" opacity="0.1"/>
        
        <!-- Center heart icon -->
        <g transform="translate(600, 315)">
          <path d="M0,-15 C-15,-35 -45,-20 -45,5 C-45,35 0,55 0,55 C0,55 45,35 45,5 C45,-20 15,-35 0,-15" 
                fill="rgb(${primary.r},${primary.g},${primary.b})" opacity="0.3" transform="scale(1.5)"/>
        </g>
        
        <!-- Text: The Wedding of -->
        <text x="600" y="180" font-family="Georgia, serif" font-size="28" fill="rgb(${primary.r},${primary.g},${primary.b})" text-anchor="middle" opacity="0.8">The Wedding of</text>
        
        <!-- Names -->
        <text x="600" y="340" font-family="Georgia, serif" font-size="72" fill="rgb(${Math.max(0, primary.r - 40)},${Math.max(0, primary.g - 40)},${Math.max(0, primary.b - 40)})" text-anchor="middle" font-weight="600">${invitation.bride_name || 'Bride'}</text>
        <text x="600" y="400" font-family="Georgia, serif" font-size="36" fill="rgb(${primary.r},${primary.g},${primary.b})" text-anchor="middle">&amp;</text>
        <text x="600" y="470" font-family="Georgia, serif" font-size="72" fill="rgb(${Math.max(0, primary.r - 40)},${Math.max(0, primary.g - 40)},${Math.max(0, primary.b - 40)})" text-anchor="middle" font-weight="600">${invitation.groom_name || 'Groom'}</text>
        
        <!-- Date -->
        <text x="600" y="550" font-family="Arial, sans-serif" font-size="24" fill="rgb(${primary.r},${primary.g},${primary.b})" text-anchor="middle" opacity="0.7">${invitation.wedding_date ? new Date(invitation.wedding_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</text>
        
        <!-- Kekkon branding -->
        <text x="600" y="610" font-family="Arial, sans-serif" font-size="16" fill="rgb(${primary.r},${primary.g},${primary.b})" text-anchor="middle" opacity="0.5">kekkon.hafizhrf.me</text>
      </svg>
    `;

    let finalImage = sharp(Buffer.from(svgBackground));
    const composites = [];

    // Try to add bride photo
    if (invitation.bride_photo) {
      try {
        const bridePath = path.join(__dirname, '..', invitation.bride_photo);
        if (fs.existsSync(bridePath)) {
          const bridePhoto = await sharp(bridePath)
            .resize(180, 180, { fit: 'cover' })
            .composite([{
              input: Buffer.from(`<svg><circle cx="90" cy="90" r="90" fill="white"/></svg>`),
              blend: 'dest-in'
            }])
            .png()
            .toBuffer();
          
          composites.push({
            input: bridePhoto,
            left: 180,
            top: 225
          });
          
          // Add border circle
          composites.push({
            input: Buffer.from(`<svg width="190" height="190"><circle cx="95" cy="95" r="93" fill="none" stroke="rgb(${primary.r},${primary.g},${primary.b})" stroke-width="4"/></svg>`),
            left: 175,
            top: 220
          });
        }
      } catch (e) {
        console.error('Error processing bride photo:', e.message);
      }
    }

    // Try to add groom photo
    if (invitation.groom_photo) {
      try {
        const groomPath = path.join(__dirname, '..', invitation.groom_photo);
        if (fs.existsSync(groomPath)) {
          const groomPhoto = await sharp(groomPath)
            .resize(180, 180, { fit: 'cover' })
            .composite([{
              input: Buffer.from(`<svg><circle cx="90" cy="90" r="90" fill="white"/></svg>`),
              blend: 'dest-in'
            }])
            .png()
            .toBuffer();
          
          composites.push({
            input: groomPhoto,
            left: 830,
            top: 225
          });
          
          // Add border circle
          composites.push({
            input: Buffer.from(`<svg width="190" height="190"><circle cx="95" cy="95" r="93" fill="none" stroke="rgb(${primary.r},${primary.g},${primary.b})" stroke-width="4"/></svg>`),
            left: 825,
            top: 220
          });
        }
      } catch (e) {
        console.error('Error processing groom photo:', e.message);
      }
    }

    if (composites.length > 0) {
      finalImage = finalImage.composite(composites);
    }

    const buffer = await finalImage.png().toBuffer();

    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    });
    res.send(buffer);
    
  } catch (error) {
    console.error('Generate OG image error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}
