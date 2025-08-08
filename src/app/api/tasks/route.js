import { NextResponse } from 'next/server';
import { 
  createTask, 
  getTasksByBoardId, 
  getTaskById, 
  updateTask, 
  deleteTask,
  getBoardById
} from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { generateId } from '@/lib/utils';
import { ensureTmpDirectory } from '@/lib/vercel-utils';

// GET - Get all tasks for a specific board
export const GET = requireAuth(async (req) => {
  try {
    // Ensure /tmp directory exists in Vercel environment
    if (process.env.VERCEL) {
      ensureTmpDirectory();
    }
    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get('boardId');

    if (!boardId) {
      return NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      );
    }

    // Check if board exists and belongs to user
    const board = getBoardById(boardId);
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

    const tasks = getTasksByBoardId(boardId);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// POST - Create a new task
export const POST = requireAuth(async (req) => {
  try {
    // Ensure /tmp directory exists in Vercel environment
    if (process.env.VERCEL) {
      ensureTmpDirectory();
    }
    const { title, description, dueDate, boardId } = await req.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    if (!boardId) {
      return NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      );
    }

    // Check if board exists and belongs to user
    const board = getBoardById(boardId);
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

    const taskData = {
      id: generateId(),
      title: title.trim(),
      description: description?.trim() || '',
      dueDate: dueDate || null,
      boardId,
      userId: req.userId
    };

    const newTask = createTask(taskData);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// PUT - Update a task
export const PUT = requireAuth(async (req) => {
  try {
    // Ensure /tmp directory exists in Vercel environment
    if (process.env.VERCEL) {
      ensureTmpDirectory();
    }
    const { id, title, description, status, dueDate, completed, priority } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Check if task exists and belongs to user
    const task = getTaskById(id);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (task.userId !== req.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (completed !== undefined) updates.completed = completed;
    if (priority !== undefined) updates.priority = priority;

    const updatedTask = updateTask(id, updates);
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// DELETE - Delete a task
export const DELETE = requireAuth(async (req) => {
  try {
    // Ensure /tmp directory exists in Vercel environment
    if (process.env.VERCEL) {
      ensureTmpDirectory();
    }
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Check if task exists and belongs to user
    const task = getTaskById(id);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (task.userId !== req.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const success = deleteTask(id);
    if (success) {
      return NextResponse.json({ message: 'Task deleted successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});