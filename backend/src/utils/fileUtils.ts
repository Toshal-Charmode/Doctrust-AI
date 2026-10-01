import path from 'path';
import fs from 'fs';
import config from '../config/env.js';

/**
 * Ensure user-specific directory exists: uploads/<userId>/
 */
export function getUserUploadDir(userId: string): string {
  // Sanitize userId to prevent path traversal
  const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
  const userDir = path.resolve(config.uploadDir, sanitizedUserId);
  
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  
  return userDir;
}

/**
 * Safely generate unique filename
 */
export function generateSafeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const rawBase = path.basename(originalName, ext);
  const sanitizedBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
  const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${sanitizedBase}-${uniqueId}${ext}`;
}

/**
 * Safe path resolution preventing directory traversal
 */
export function resolveUserFilePath(userId: string, filename: string): string {
  const userDir = getUserUploadDir(userId);
  const resolved = path.resolve(userDir, path.basename(filename));
  
  // Verify resolved path stays strictly within userDir
  if (!resolved.startsWith(userDir)) {
    throw new Error('Access denied: Path traversal detected.');
  }
  
  return resolved;
}

/**
 * Remove file from disk safely
 */
export function deleteFileSafely(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (err: any) {
    console.warn(`Failed to delete file ${filePath}:`, err.message);
  }
  return false;
}

export const safeUnlink = deleteFileSafely;

export default {
  getUserUploadDir,
  generateSafeFilename,
  resolveUserFilePath,
  deleteFileSafely,
  safeUnlink,
};
