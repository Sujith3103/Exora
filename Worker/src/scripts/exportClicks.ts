import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';
import { prisma } from '../utils/prisma';

async function exportClicks() {
  try {
    // 1️⃣ Fetch all click data from Supabase
    const data = await prisma.userClick.findMany()

    if (!data || data.length === 0) {
      console.log('No click data found.');
      return;
    }

    // 2️⃣ Convert JSON to CSV
    const fields = ['userId','targetId','type','categoryId','instructorId','action','timestamp','metadata'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    // 3️⃣ Create folder for exports if it doesn't exist
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // 4️⃣ Write CSV file
    const filePath = path.join(exportDir, `clicks_export_${Date.now()}.csv`);
    fs.writeFileSync(filePath, csv);

    console.log('Click data exported successfully to:', filePath);
  } catch (err) {
    console.error('Error exporting clicks:', err);
  }
}

// Run the export
exportClicks();
