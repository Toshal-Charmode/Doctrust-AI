import db from '../db/index.js';
import { answerUserQuestion } from '../services/chat/chatService.js';

export async function chat(req, res, next) {
  try {
    const userId = req.user.id;
    const { message, documentIds } = req.body;

    // Save user message to database
    await db.query(
      `INSERT INTO chat_messages (user_id, role, content, context_document_ids)
       VALUES ($1, 'user', $2, $3)`,
      [userId, message, JSON.stringify(documentIds || [])]
    );

    // Answer grounded in documents
    const result = await answerUserQuestion(userId, message, documentIds);

    // Save assistant reply
    const assistantRes = await db.query(
      `INSERT INTO chat_messages (user_id, role, content, context_document_ids)
       VALUES ($1, 'assistant', $2, $3)
       RETURNING id, role, content, created_at`,
      [userId, result.answer, JSON.stringify(documentIds || [])]
    );

    return res.status(200).json({
      success: true,
      data: {
        message: assistantRes.rows[0],
        groundedDocs: result.groundedDocs || [],
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getChatHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT id, role, content, created_at
       FROM chat_messages
       WHERE user_id = $1
       ORDER BY created_at ASC
       LIMIT 50`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      data: {
        messages: result.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  chat,
  getChatHistory,
};
