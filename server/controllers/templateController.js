import db from '../config/database.js';

export function getTemplates(req, res) {
  try {
    const templates = db.prepare(`
      SELECT * FROM templates WHERE is_active = 1
      ORDER BY name
    `).all();

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
}

export function getTemplate(req, res) {
  try {
    const { id } = req.params;

    const template = db.prepare(`
      SELECT * FROM templates WHERE id = ? AND is_active = 1
    `).get(id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to get template' });
  }
}
