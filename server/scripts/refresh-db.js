#!/usr/bin/env node

/**
 * Database Refresh Script for Production Deployment
 * 
 * This script will:
 * 1. Reset the database (delete all data)
 * 2. Re-initialize all tables
 * 3. Seed with default templates
 * 
 * Usage:
 *   node scripts/refresh-db.js
 * 
 * Environment variables required:
 *   - SUPERADMIN_EMAIL (optional, for logging purposes)
 *   - SUPERADMIN_PASSWORD (optional, for logging purposes)
 * 
 * WARNING: This will DELETE ALL DATA in the database!
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbPath = path.join(__dirname, '../../database/wedding.db');

console.log('\n===========================================');
console.log('   KEKKON Database Refresh Script');
console.log('===========================================\n');

// Check for confirmation flag
const args = process.argv.slice(2);
const forceFlag = args.includes('--force') || args.includes('-f');

if (!forceFlag) {
  console.log('WARNING: This script will DELETE ALL DATA in the database!\n');
  console.log('To proceed, run with --force or -f flag:');
  console.log('  node scripts/refresh-db.js --force\n');
  process.exit(1);
}

console.log('Starting database refresh...\n');

// Delete existing database files
const dbFiles = [
  dbPath,
  `${dbPath}-shm`,
  `${dbPath}-wal`,
];

dbFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted: ${path.basename(file)}`);
  }
});

// Create new database
console.log('\nCreating new database...');
const db = new Database(dbPath);

// Optimize SQLite
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = 10000');
db.pragma('temp_store = MEMORY');

// Create tables
console.log('Creating tables...');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    template_id TEXT NOT NULL DEFAULT 'geometric-modern',
    status TEXT DEFAULT 'draft',
    primary_color TEXT DEFAULT '#D4A373',
    secondary_color TEXT DEFAULT '#FEFAE0',
    font_family TEXT DEFAULT 'playfair',
    enable_rsvp INTEGER DEFAULT 1,
    enable_messages INTEGER DEFAULT 1,
    enable_countdown INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME DEFAULT (datetime('now', '+3 months')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS invitation_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitation_id INTEGER NOT NULL UNIQUE,
    is_muslim INTEGER DEFAULT 1,
    bride_name TEXT NOT NULL,
    bride_parents TEXT,
    bride_photo TEXT,
    bride_instagram TEXT,
    groom_name TEXT NOT NULL,
    groom_parents TEXT,
    groom_photo TEXT,
    groom_instagram TEXT,
    wedding_date TEXT NOT NULL,
    akad_time TEXT,
    akad_venue TEXT,
    akad_address TEXT,
    akad_lat REAL,
    akad_lng REAL,
    reception_time TEXT,
    reception_venue TEXT,
    reception_address TEXT,
    reception_lat REAL,
    reception_lng REAL,
    music_url TEXT,
    story_text TEXT,
    gallery_images TEXT,
    custom_fields TEXT,
    gift_bank_accounts TEXT,
    gift_ewallets TEXT,
    gift_address TEXT,
    enable_gift INTEGER DEFAULT 1,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitation_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    rsvp_status TEXT DEFAULT 'pending',
    attendance_count INTEGER DEFAULT 1,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    preview_url TEXT,
    category TEXT,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitation_id INTEGER NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    guest_name TEXT,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
  );

  -- Indexes for faster queries
  CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);
  CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
  CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
  CREATE INDEX IF NOT EXISTS idx_invitation_content_invitation_id ON invitation_content(invitation_id);
  CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON guests(invitation_id);
  CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(invitation_id, name);
  CREATE INDEX IF NOT EXISTS idx_page_views_invitation_id ON page_views(invitation_id);
`);

console.log('Tables created successfully.');

// Seed templates
console.log('Seeding templates...');
const insertTemplate = db.prepare(`
  INSERT INTO templates (id, name, description, category, is_active)
  VALUES (?, ?, ?, ?, 1)
`);

const templates = [
  ['geometric-modern', 'Geometric Modern', 'Clean lines with abstract geometric shapes and bold colors', 'geometric'],
  ['minimalist-elegant', 'Minimalist Elegant', 'White space with serif typography and monochrome palette', 'minimalist'],
  ['colorful-playful', 'Colorful Playful', 'Vibrant gradients with rounded shapes and fun animations', 'colorful'],
];

templates.forEach(t => insertTemplate.run(...t));
console.log(`Inserted ${templates.length} templates.`);

// Close database
db.close();

console.log('\n===========================================');
console.log('   Database refresh completed!');
console.log('===========================================\n');

// Show superadmin info
const superadminEmail = process.env.SUPERADMIN_EMAIL;
const superadminPassword = process.env.SUPERADMIN_PASSWORD;

if (superadminEmail && superadminPassword) {
  console.log('Superadmin credentials (from .env):');
  console.log(`  Email: ${superadminEmail}`);
  console.log(`  Password: ${superadminPassword.substring(0, 3)}${'*'.repeat(superadminPassword.length - 3)}`);
  console.log('\nNote: Superadmin login is handled via environment variables.');
  console.log('No database entry is needed for superadmin.\n');
} else {
  console.log('WARNING: Superadmin credentials not found in .env file!');
  console.log('Please add SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD to your .env file.\n');
}

console.log('Next steps:');
console.log('1. Ensure .env file has correct SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD');
console.log('2. Start the server: npm run dev');
console.log('3. Access superadmin dashboard at: /superadmin\n');
