#!/usr/bin/env node

/**
 * Cleanup Script for Expired Invitations
 * 
 * This script will:
 * 1. Find all invitations that have expired (expires_at < now)
 * 2. Delete associated uploaded files (photos, music)
 * 3. Delete the invitation and all related data
 * 
 * Usage:
 *   node scripts/cleanup-expired.js
 * 
 * Recommended: Run this script daily via cron job
 *   0 2 * * * cd /path/to/server && node scripts/cleanup-expired.js >> /var/log/kekkon-cleanup.log 2>&1
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database/wedding.db');
const uploadsPath = path.join(__dirname, '../uploads');

console.log(`\n[${new Date().toISOString()}] Starting cleanup of expired invitations...`);

// Check if database exists
if (!fs.existsSync(dbPath)) {
  console.log('Database not found. Nothing to clean up.');
  process.exit(0);
}

const db = new Database(dbPath);

try {
  // Find expired invitations
  const expiredInvitations = db.prepare(`
    SELECT i.id, i.slug, ic.bride_photo, ic.groom_photo, ic.music_url, ic.gallery_images
    FROM invitations i
    LEFT JOIN invitation_content ic ON i.id = ic.invitation_id
    WHERE i.expires_at < datetime('now')
  `).all();

  if (expiredInvitations.length === 0) {
    console.log('No expired invitations found.');
    process.exit(0);
  }

  console.log(`Found ${expiredInvitations.length} expired invitation(s) to clean up.`);

  let filesDeleted = 0;
  let invitationsDeleted = 0;

  for (const invitation of expiredInvitations) {
    console.log(`\nProcessing invitation ID ${invitation.id} (${invitation.slug})...`);

    // Collect all file paths to delete
    const filesToDelete = [];

    // Add bride photo
    if (invitation.bride_photo && invitation.bride_photo.startsWith('/uploads/')) {
      filesToDelete.push(path.join(__dirname, '..', invitation.bride_photo));
    }

    // Add groom photo
    if (invitation.groom_photo && invitation.groom_photo.startsWith('/uploads/')) {
      filesToDelete.push(path.join(__dirname, '..', invitation.groom_photo));
    }

    // Add music
    if (invitation.music_url && invitation.music_url.startsWith('/uploads/')) {
      filesToDelete.push(path.join(__dirname, '..', invitation.music_url));
    }

    // Add gallery images (handle both string URLs and {url, caption} objects)
    if (invitation.gallery_images) {
      try {
        const gallery = JSON.parse(invitation.gallery_images);
        if (Array.isArray(gallery)) {
          gallery.forEach(item => {
            const img = typeof item === 'string' ? item : item.url;
            if (img && img.startsWith('/uploads/')) {
              filesToDelete.push(path.join(__dirname, '..', img));
            }
          });
        }
      } catch (e) {
        console.log(`  Warning: Could not parse gallery images for invitation ${invitation.id}`);
      }
    }

    // Delete files
    for (const filePath of filesToDelete) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          filesDeleted++;
          console.log(`  Deleted: ${path.basename(filePath)}`);
        }
      } catch (err) {
        console.log(`  Warning: Could not delete ${filePath}: ${err.message}`);
      }
    }

    // Delete invitation from database (CASCADE will delete related records)
    try {
      db.prepare('DELETE FROM invitations WHERE id = ?').run(invitation.id);
      invitationsDeleted++;
      console.log(`  Deleted invitation record and related data`);
    } catch (err) {
      console.log(`  Error deleting invitation ${invitation.id}: ${err.message}`);
    }
  }

  console.log(`\n===========================================`);
  console.log(`Cleanup completed!`);
  console.log(`  Invitations deleted: ${invitationsDeleted}`);
  console.log(`  Files deleted: ${filesDeleted}`);
  console.log(`===========================================\n`);

} catch (error) {
  console.error('Cleanup error:', error);
  process.exit(1);
} finally {
  db.close();
}
