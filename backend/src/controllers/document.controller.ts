import { Request, Response, NextFunction } from 'express';
import documentService from '../services/documents/document.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

export async function uploadDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

    if (!files || files.length === 0) {
      sendError(res, 'No files were provided for upload.', 400);
      return;
    }

    const createdDocs: any[] = [];
    for (const file of files) {
      const doc = await documentService.createDocumentRecord(userId, file);
      createdDocs.push({
        id: doc.id,
        filename: doc.filename,
        originalFilename: doc.original_filename,
        mimeType: doc.mime_type,
        fileSize: doc.file_size,
        status: doc.status,
        createdAt: doc.created_at,
      });
    }

    logger.info(`User ${userId} uploaded ${createdDocs.length} document(s)`);

    sendSuccess(
      res,
      {
        documents: createdDocs,
        count: createdDocs.length,
      },
      `${createdDocs.length} file(s) uploaded successfully`,
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { page, limit, status, type, search } = req.query;

    const result = await documentService.getUserDocuments(userId, {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
      status: status as string,
      type: type as string,
      search: search as string,
    });

    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const doc = await documentService.getDocumentById(userId, id);
    if (!doc) {
      sendError(res, 'Document not found or access unauthorized.', 404);
      return;
    }

    sendSuccess(res, { document: doc });
  } catch (err) {
    next(err);
  }
}

export async function processDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const processed = await documentService.processDocument(userId, id);
    sendSuccess(res, processed, 'Document processed successfully');
  } catch (err: any) {
    if (err.message?.includes('not found') || err.message?.includes('unauthorized')) {
      sendError(res, err.message, 404);
    } else {
      sendError(res, `Document processing error: ${err.message}`, 422);
    }
  }
}

export async function deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const deleted = await documentService.deleteDocument(userId, id);
    if (!deleted) {
      sendError(res, 'Document not found or access unauthorized.', 404);
      return;
    }

    sendSuccess(res, { id }, 'Document deleted successfully');
  } catch (err) {
    next(err);
  }
}

export default {
  uploadDocuments,
  getDocuments,
  getDocumentById,
  processDocument,
  deleteDocument,
};
