import {
  createDocumentRecord,
  processDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
} from '../services/documents/documentService.js';

export async function uploadDocuments(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded. Please select at least one document.',
      });
    }

    const userId = req.user.id;
    const uploadedDocs = [];

    // Save initial records
    for (const file of req.files) {
      const record = await createDocumentRecord(userId, file);
      uploadedDocs.push(record);
    }

    // Process each document asynchronously or synchronously
    const processedResults = [];
    for (const doc of uploadedDocs) {
      try {
        const processed = await processDocument(doc.id, userId);
        processedResults.push({
          id: doc.id,
          originalName: doc.original_name,
          success: true,
          document: processed,
        });
      } catch (procErr) {
        console.error(`Failed to process uploaded doc #${doc.id}:`, procErr.message);
        processedResults.push({
          id: doc.id,
          originalName: doc.original_name,
          success: false,
          error: procErr.message,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: `Successfully uploaded and processed ${processedResults.length} document(s).`,
      data: {
        results: processedResults,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getDocuments(req, res, next) {
  try {
    const userId = req.user.id;
    const { type, status, search } = req.query;

    const documents = await getUserDocuments(userId, { type, status, search });

    return res.status(200).json({
      success: true,
      data: {
        documents,
        total: documents.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const documentId = parseInt(req.params.id, 10);

    const document = await getDocumentById(documentId, userId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or access denied',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        document,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function reprocessDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const documentId = parseInt(req.params.id, 10);

    const updated = await processDocument(documentId, userId);

    return res.status(200).json({
      success: true,
      message: 'Document reprocessed successfully with Gemini AI',
      data: {
        document: updated,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function removeDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const documentId = parseInt(req.params.id, 10);

    await deleteDocument(documentId, userId);

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  uploadDocuments,
  getDocuments,
  getDocument,
  reprocessDocument,
  removeDocument,
};
