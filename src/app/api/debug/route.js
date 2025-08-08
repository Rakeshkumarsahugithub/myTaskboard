import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Support both GET and POST methods for flexibility
export async function GET() {
  return handleRequest();
}

export async function POST() {
  return handleRequest();
}

// Common handler function for both methods
async function handleRequest() {
  // For security in a real app, add authentication here
  // This is just for debugging purposes
  
  try {
    // Determine the database path based on environment
    const dbPath = process.env.VERCEL
      ? path.join('/tmp', 'data.json')
      : path.join(process.cwd(), 'data.json');
    
    // Read the database file directly
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: 'Database file not found' }, { status: 404 });
    }
    
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}