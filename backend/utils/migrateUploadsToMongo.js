import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from '../config/db.js';
import Complaint from '../models/Complaint.js';
import LostFound from '../models/LostFound.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

const contentTypes = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const getUploadFile = (storedPath) => {
  const filename = path.basename(storedPath || '');
  if (!filename) return null;
  return path.join(uploadsDir, filename);
};

const migrateCollection = async ({ model, field, label, endpoint }) => {
  const items = await model.find({
    [field]: /^\/uploads\//,
    $or: [{ imageData: { $exists: false } }, { imageData: null }],
  });

  let migrated = 0;
  let missing = 0;

  for (const item of items) {
    const filePath = getUploadFile(item[field]);
    if (!filePath || !fs.existsSync(filePath)) {
      missing += 1;
      console.warn(`${label} ${item._id}: missing ${item[field]}`);
      continue;
    }

    item.imageData = fs.readFileSync(filePath);
    item.imageContentType = contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    item[field] = `/api/${endpoint}/${item._id}/image`;
    await item.save();
    migrated += 1;
  }

  console.log(`${label}: migrated ${migrated}, missing ${missing}`);
};

await connectDB();

await migrateCollection({
  model: Complaint,
  field: 'image',
  label: 'Complaints',
  endpoint: 'complaints',
});

await migrateCollection({
  model: LostFound,
  field: 'imageUrl',
  label: 'LostFound',
  endpoint: 'lost-found',
});

process.exit(0);
