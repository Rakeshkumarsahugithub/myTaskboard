import fs from 'fs';
import path from 'path';
import { ensureTmpDirectory } from './vercel-utils';

/**
 * VERCEL DEPLOYMENT SOLUTION
 * 
 * This implementation solves the read-only filesystem issue on Vercel by:
 * 1. Using the writable /tmp directory in production (Vercel environment)
 * 2. Using the regular data.json file in development
 * 3. Copying initial data from the read-only data.json to /tmp on first run
 * 
 * LIMITATIONS:
 * - Data in /tmp may not persist between function invocations
 * - Limited to 512MB storage
 * - For a more robust solution, consider using Vercel KV, Postgres, or another database service
 */

// Use /tmp directory in production, regular path in development
const DB_PATH = process.env.VERCEL
  ? path.join('/tmp', 'data.json')
  : path.join(process.cwd(), 'data.json');

// Path to the original data.json for initialization in production
const ORIGINAL_DB_PATH = path.join(process.cwd(), 'data.json');

// Initialize database if it doesn't exist
function initDB() {
  // Ensure /tmp directory exists in Vercel environment
  if (process.env.VERCEL) {
    ensureTmpDirectory();
  }
  
  if (!fs.existsSync(DB_PATH)) {
    // If in production, copy from the original data.json if it exists
    if (process.env.VERCEL && fs.existsSync(ORIGINAL_DB_PATH)) {
      try {
        const originalData = fs.readFileSync(ORIGINAL_DB_PATH, 'utf8');
        fs.writeFileSync(DB_PATH, originalData);
        console.log('Initialized database from original data.json');
      } catch (error) {
        console.error('Error copying from original data.json:', error);
        createEmptyDB();
      }
    } else {
      createEmptyDB();
    }
  }
}

// Create an empty database structure
function createEmptyDB() {
  const initialData = {
    users: [],
    boards: [],
    tasks: []
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  console.log('Created empty database');
}

// Read data from database
function readDB() {
  initDB();
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

// Write data to database
function writeDB(data) {
  // Write to the temporary path
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  
  // In development, also sync back to the original data.json
  // This ensures data persistence between deployments
  if (!process.env.VERCEL) {
    try {
      fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error syncing to original data.json:', error);
    }
  }
}

// User operations
export function createUser(userData) {
  const db = readDB();
  const newUser = {
    id: userData.id,
    email: userData.email,
    password: userData.password,
    name: userData.name,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

export function findUserByEmail(email) {
  const db = readDB();
  return db.users.find(user => user.email === email);
}

export function findUserById(id) {
  const db = readDB();
  return db.users.find(user => user.id === id);
}

// Board operations
export function createBoard(boardData) {
  const db = readDB();
  const newBoard = {
    id: boardData.id,
    name: boardData.name,
    userId: boardData.userId,
    createdAt: new Date().toISOString()
  };
  db.boards.push(newBoard);
  writeDB(db);
  return newBoard;
}

export function getBoardsByUserId(userId) {
  const db = readDB();
  return db.boards.filter(board => board.userId === userId);
}

export function getBoardById(boardId) {
  const db = readDB();
  return db.boards.find(board => board.id === boardId);
}

export function updateBoard(boardId, updates) {
  const db = readDB();
  const boardIndex = db.boards.findIndex(board => board.id === boardId);
  if (boardIndex !== -1) {
    db.boards[boardIndex] = { ...db.boards[boardIndex], ...updates };
    writeDB(db);
    return db.boards[boardIndex];
  }
  return null;
}

export function deleteBoard(boardId) {
  const db = readDB();
  const boardIndex = db.boards.findIndex(board => board.id === boardId);
  if (boardIndex !== -1) {
    db.boards.splice(boardIndex, 1);
    // Also delete all tasks associated with this board
    db.tasks = db.tasks.filter(task => task.boardId !== boardId);
    writeDB(db);
    return true;
  }
  return false;
}

// Task operations
export function createTask(taskData) {
  const db = readDB();
  const newTask = {
    id: taskData.id,
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status || 'pending',
    completed: taskData.completed || false,
    priority: taskData.priority || 'medium',
    dueDate: taskData.dueDate || null,
    boardId: taskData.boardId,
    userId: taskData.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.tasks.push(newTask);
  writeDB(db);
  return newTask;
}

export function getTasksByBoardId(boardId) {
  const db = readDB();
  return db.tasks.filter(task => task.boardId === boardId);
}

export function getTaskById(taskId) {
  const db = readDB();
  return db.tasks.find(task => task.id === taskId);
}

export function updateTask(taskId, updates) {
  const db = readDB();
  const taskIndex = db.tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    db.tasks[taskIndex] = { 
      ...db.tasks[taskIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    writeDB(db);
    return db.tasks[taskIndex];
  }
  return null;
}

export function deleteTask(taskId) {
  const db = readDB();
  const taskIndex = db.tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    db.tasks.splice(taskIndex, 1);
    writeDB(db);
    return true;
  }
  return false;
}