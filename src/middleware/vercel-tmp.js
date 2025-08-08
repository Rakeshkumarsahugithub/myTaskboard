/**
 * This middleware ensures the /tmp directory exists and has proper permissions on Vercel
 * It's used to help with the file-based database solution
 */

import fs from 'fs';
import path from 'path';

export function ensureTmpDirectory() {
  // Only run in Vercel environment
  if (!process.env.VERCEL) return;
  
  const tmpDir = '/tmp';
  
  try {
    // Check if /tmp exists
    if (!fs.existsSync(tmpDir)) {
      console.log('/tmp directory does not exist, attempting to create it');
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    // Check permissions
    try {
      // Test write permissions by creating a test file
      const testFile = path.join(tmpDir, '.test-write');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile); // Remove test file
      console.log('/tmp directory is writable');
    } catch (error) {
      console.error('Error writing to /tmp directory:', error);
    }
  } catch (error) {
    console.error('Error ensuring /tmp directory:', error);
  }
}