// One-time script: bulk-replace old image domains with files.beyondspacework.in
// Run: node update-image-urls.js

const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const REPLACEMENTS = [
  ['files.yottascore.com', 'files.beyondspacework.in'],
  ['files.beyondspacework.com', 'files.beyondspacework.in'],
];

async function replaceInColumn(table, column) {
  let total = 0;
  for (const [from, to] of REPLACEMENTS) {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE \`${table}\` SET \`${column}\` = REPLACE(\`${column}\`, ?, ?) WHERE \`${column}\` LIKE ?`,
      from,
      to,
      `%${from}%`
    );
    if (result > 0) {
      console.log(`${table}.${column}: replaced ${from} -> ${to} in ${result} row(s)`);
      total += result;
    }
  }
  return total;
}

async function main() {
  console.log('Starting bulk domain replace...\n');

  let total = 0;
  total += await replaceInColumn('Property', 'image');
  total += await replaceInColumn('PropertyImage', 'imageUrl');
  total += await replaceInColumn('Testimonial', 'avatar');
  total += await replaceInColumn('SectionImage', 'imageUrl');
  total += await replaceInColumn('User', 'image');

  // propertyOptions is JSON text that may contain image URLs
  // Cast to CHAR for REPLACE, then back — MySQL JSON columns accept string assignment
  for (const [from, to] of REPLACEMENTS) {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE \`Property\` SET \`propertyOptions\` = REPLACE(CAST(\`propertyOptions\` AS CHAR), ?, ?) WHERE CAST(\`propertyOptions\` AS CHAR) LIKE ?`,
      from,
      to,
      `%${from}%`
    );
    if (result > 0) {
      console.log(`Property.propertyOptions: replaced ${from} -> ${to} in ${result} row(s)`);
      total += result;
    }
  }

  console.log(`\nDone. Total row updates: ${total}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
