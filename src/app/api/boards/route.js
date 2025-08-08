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

// GET - Get all boards for the authenticated user
export const GET = requireAuth(async (req) => {
  try {
    const boards = getBoardsByUserId(req.userId);
    return NextResponse.json(boards);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
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
    const { name } = await req.json();
    if (!name || name.trim().length === 0) {
      const response = NextResponse.json(
        { error: 'Board name is required' },
        { status: 400 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      return response;
    }
    const boardData = {
      id: generateId(),
      name: name.trim(),
      userId: req.userId
    };
    const newBoard = createBoard(boardData);
    const response = NextResponse.json(newBoard, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
  } catch (error) {
    console.error('Create board error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
  }
});

// PUT - Update a board
export const PUT = requireAuth(async (req) => {
  try {
    const { id, name } = await req.json();
    if (!id || !name || name.trim().length === 0) {
      const response = NextResponse.json(
        { error: 'Board ID and name are required' },
        { status: 400 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      return response;
    }
    const board = getBoardById(id);
    if (!board) {
      const response = NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      return response;
    }
    if (board.userId !== req.userId) {
      const response = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      return response;
    }
    const updatedBoard = updateBoard(id, { name: name.trim() });
    return NextResponse.json(updatedBoard);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
  } catch (error) {
    console.error('Update board error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
  }
});

// DELETE - Delete a board
export const DELETE = requireAuth(async (req) => {
  try {
    const { id } = await req.json();
    if (!id) {
      const response = NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      return response;
    }
    const board = getBoardById(id);
    if (!board) {
      const response = NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      return response;
    }
    if (board.userId !== req.userId) {
      const response = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      return response;
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
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
  }
});