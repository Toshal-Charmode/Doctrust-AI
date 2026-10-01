import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_PATH = path.resolve(__dirname, 'face_processor.py');

const DEFAULT_THRESHOLD = parseFloat(process.env.FACE_AUTH_THRESHOLD || '0.96');

/**
 * Executes the Python AI Face Processor engine securely via stdin/stdout IPC.
 * Prevents writing sensitive biometric images or raw embeddings to disk or logs.
 */
function runProcessorCommand(command, inputPayload, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    let resolved = false;

    // Use python executable
    const pythonExe = process.env.PYTHON_PATH || 'python';
    const proc = spawn(pythonExe, [SCRIPT_PATH, command], {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    let stdoutData = '';
    let stderrData = '';

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        proc.kill('SIGKILL');
        reject(new Error(`Face processing timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    proc.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    proc.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (resolved) return;
      resolved = true;

      if (code !== 0) {
        return reject(new Error(`Face engine process exited with code ${code}: ${stderrData || stdoutData}`));
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse face engine response: ${err.message} \nRaw output: ${stdoutData.slice(0, 200)}`));
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      if (!resolved) {
        resolved = true;
        reject(new Error(`Failed to launch face processor engine: ${err.message}`));
      }
    });

    // Write input payload safely via stdin
    try {
      proc.stdin.write(JSON.stringify(inputPayload));
      proc.stdin.end();
    } catch (err) {
      clearTimeout(timer);
      proc.kill();
      reject(new Error(`Failed to transmit biometric payload: ${err.message}`));
    }
  });
}

/**
 * Detects face, verifies image quality, checks liveness, and extracts 128-d embedding.
 * @param {string} base64Image - Captured selfie in data URI or raw base64 format.
 */
export async function detectAndExtractEmbedding(base64Image) {
  if (!base64Image || typeof base64Image !== 'string') {
    return {
      success: false,
      error_code: 'INVALID_IMAGE',
      message: 'A valid base64 image capture is required.',
    };
  }

  const result = await runProcessorCommand('detect_and_embed', { image: base64Image });

  if (result.success && Array.isArray(result.embedding)) {
    // Validate embedding integrity
    if (result.embedding.length !== 128) {
      throw new Error(`Invalid embedding vector dimension: expected 128, received ${result.embedding.length}`);
    }
    const hasInvalid = result.embedding.some((val) => typeof val !== 'number' || isNaN(val) || !isFinite(val));
    if (hasInvalid) {
      throw new Error('Embedding contains invalid non-numeric or non-finite values');
    }
  }

  return result;
}

/**
 * Compares two 128-dimensional biometric embeddings using cosine similarity.
 * @param {number[]} liveEmbedding - The freshly captured live embedding.
 * @param {number[]} enrolledEmbedding - The decrypted stored template embedding.
 * @param {number} [customThreshold] - Optional threshold override.
 */
export async function compareEmbeddings(liveEmbedding, enrolledEmbedding, customThreshold = DEFAULT_THRESHOLD) {
  if (!Array.isArray(liveEmbedding) || !Array.isArray(enrolledEmbedding)) {
    throw new Error('Both embeddings must be valid numeric arrays');
  }

  const response = await runProcessorCommand('compare', {
    embedding1: liveEmbedding,
    embedding2: enrolledEmbedding,
    threshold: customThreshold,
  });

  if (!response.success || !response.result) {
    throw new Error(response.error || 'Failed to compare biometric embeddings');
  }

  return response.result;
}

export default {
  detectAndExtractEmbedding,
  compareEmbeddings,
  DEFAULT_THRESHOLD,
};
