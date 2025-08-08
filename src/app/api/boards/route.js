import { NextResponse } from 'next/server';
import { 
  createBoard, 
  getBoardsByUserId, 
  getBoardById, 
  updateBoard, 
  deleteBoard 
} from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { generateId } from '@/lib/utils';
import { ensureTmpDirectory } from '@/lib/vercel-utils';

// GET - Get all boards for the authenticated user
export const GET = requireAuth(async (req) => {
  try {
    // Ensure /tmp directory exists in Vercel environment
    if (process.env.VERCEL) {
      ensureTmpDirectory();
    }
    const boards = getBoardsByUserId(req.userId);
    return NextResponse.json(boards);
  } catch (error) {
    console.error('Get boards error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// POST - Create a new board
export const POST = requireAuth(async (req) => {
  try {
    // Ensure /tmp directory exists in Vercel environment
    if (process.env.VERCEL) {
      ensureTmpDirectory();
    }
    const { name } = await req.json();
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Board name is required' },
        { status: 400 }
      );
    }
    const boardData = {
      id: generateId(),
      name: name.trim(),
      userId: req.userId
    };
    const newBoard = createBoard(boardData);
    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    console.error('Create board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// PUT - Update a board
export const PUT = requireAuth(async (req) => {
  try {
    // Ensure /tmp directory exists in Vercel environment
    if (process.env.VERCEL) {
      ensureTmpDirectory();
    }
    const { id, name } = await req.json();
    if (!id || !name || name.trim().length === 0) {
      const response = NextResponse.json(
        { error: 'Board ID and name are required' },
        { status: 400 }
      );
    }
    const board = getBoardById(id);
    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }
    if (board.userId !== req.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    const updatedBoard = updateBoard(id, { name: name.trim() });
    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error('Update board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// DELETE - Delete a board
export const DELETE = requireAuth(async (req) => {
  try {
    // Ensure /tmp directory exists in Vercel environment
    if (process.env.VERCEL) {
      ensureTmpDirectory();
    }
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      );
    }
    const board = getBoardById(id);
    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }
    if (board.userId !== req.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    const success = deleteBoard(id);
    if (success) {
      return NextResponse.json({ message: 'Board deleted successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete board' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Delete board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});