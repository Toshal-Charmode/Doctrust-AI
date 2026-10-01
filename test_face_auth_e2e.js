// test_face_auth_e2e.js
// Comprehensive End-to-End Automated Test Suite for DocuTrust AI Face Authentication System
import assert from 'assert';
import { spawn } from 'child_process';

const BASE_URL = 'http://localhost:5001/api';

// Helper to generate a realistic synthetic face image base64
function generateSyntheticFaceBase64(skinColor = [140, 170, 220], eyeY = 170, mouthY = 250, wFace = 90, hFace = 120, eyeRadius = 12) {
  return new Promise((resolve, reject) => {
    const pythonCode = `
import cv2, numpy as np, base64
img = np.zeros((400, 400, 3), dtype=np.uint8) + 60
cv2.ellipse(img, (200, 200), (${wFace}, ${hFace}), 0, 0, 360, (${skinColor.join(',')}), -1)
cv2.circle(img, (150, ${eyeY}), ${eyeRadius}, (40, 40, 40), -1)
cv2.circle(img, (250, ${eyeY}), ${eyeRadius}, (40, 40, 40), -1)
cv2.line(img, (200, 185), (200, 215), (100, 130, 180), 3)
cv2.ellipse(img, (200, ${mouthY}), (40, 15), 0, 0, 180, (70, 80, 160), -1)
_, buffer = cv2.imencode('.jpg', img)
print(base64.b64encode(buffer).decode('utf-8'))
`;
    const proc = spawn('python', ['-c', pythonCode]);
    let out = '';
    proc.stdout.on('data', (d) => { out += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error('Python image generation failed'));
    });
  });
}


async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   DOCUTRUST AI - FACE AUTHENTICATION TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      process.stdout.write(`[Test ${total}] ${name} ... `);
      await fn();
      console.log('PASSED ✓');
      passed++;
    } catch (err) {
      console.log('FAILED ✗');
      console.error('   Error:', err.message);
    }
  }

  const testUser = {
    name: 'Biometric Test User',
    email: `biometric_${Date.now()}@docutrust.ai`,
    password: 'SecurePassword123!',
  };
  let userToken = null;
  let faceImageBase64 = null;
  let differentFaceBase64 = null;
  let activeChallengeId = null;

  // 1. Health check
  await test('Server health check', async () => {
    const res = await request('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'healthy');
  });

  // 2. Generate synthetic images
  await test('Generate high-fidelity test face images', async () => {
    faceImageBase64 = await generateSyntheticFaceBase64([140, 170, 220], 170, 250, 90, 120, 12);
    differentFaceBase64 = await generateSyntheticFaceBase64([130, 160, 210], 150, 270, 75, 105, 10);
    assert(faceImageBase64.length > 500, 'Face image was generated');
    assert(differentFaceBase64.length > 500, 'Different face was generated');
  });



  // 3. User Registration
  await test('Register new user account', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser),
    });
    assert.strictEqual(res.status, 201);
    assert(res.data.data?.token, 'Token returned on registration');
    userToken = res.data.data.token;
  });

  // 4. Initial Face Auth Status
  await test('Initial Face Auth Status is NONE', async () => {
    const res = await request('/face-auth/status', {
      method: 'GET',
      token: userToken,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.isEnrolled, false);
    assert.strictEqual(res.data.data.status, 'NONE');
  });

  // 5. Enrollment without Consent -> Rejection
  await test('Enrollment rejected when consent is false', async () => {
    const res = await request('/face-auth/enroll', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({
        image: faceImageBase64,
        consent: false,
      }),
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.error_code, 'CONSENT_REQUIRED');
  });

  // 6. Enrollment without Image -> Rejection
  await test('Enrollment rejected when image is missing', async () => {
    const res = await request('/face-auth/enroll', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({
        image: null,
        consent: true,
      }),
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.error_code, 'IMAGE_REQUIRED');
  });

  // 7. Successful Face Enrollment
  await test('Successful Face Enrollment with valid consent and capture', async () => {
    const res = await request('/face-auth/enroll', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({
        image: faceImageBase64,
        consent: true,
      }),
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.enrollmentStatus, 'ACTIVE');
    assert.strictEqual(res.data.data.modelVersion, 'docutrust-cv-facenet-v1.0');
  });

  // 8. Face Auth Status is ACTIVE
  await test('Face Auth Status is now ACTIVE with timestamp', async () => {
    const res = await request('/face-auth/status', {
      method: 'GET',
      token: userToken,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.isEnrolled, true);
    assert.strictEqual(res.data.data.status, 'ACTIVE');
    assert(res.data.data.enrolledAt, 'Has enrolledAt timestamp');
  });

  // 9. Login with Incorrect Password does NOT reveal face auth status
  await test('Incorrect password returns generic 401 without revealing face auth', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword!',
      }),
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.message, 'Invalid email or password');
    assert.strictEqual(res.data.requiresFaceAuth, undefined);
  });

  // 10. Login with Correct Password triggers Face Auth Challenge
  await test('Valid password triggers Face Challenge without issuing session token', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.requiresFaceAuth, true);
    assert(res.data.data.challengeId, 'Issued single-use challengeId');
    assert.strictEqual(res.data.data.attemptsLeft, 3);
    assert.strictEqual(res.data.data.token, undefined); // Token must NOT be issued yet!
    activeChallengeId = res.data.data.challengeId;
  });

  // 11. Face Verification with Invalid/Expired Challenge -> Rejection
  await test('Face verification fails on nonexistent challenge ID', async () => {
    const res = await request('/face-auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'fac_fake_challenge_id_123',
        image: faceImageBase64,
      }),
    });
    assert.strictEqual(res.status, 404);
  });

  // 12. Face Verification with Mismatched/Different Face -> Rejection with retry decrement
  await test('Face verification fails on mismatched biometric profile with retry count decrement', async () => {
    const res = await request('/face-auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: activeChallengeId,
        image: differentFaceBase64,
      }),
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.verified, false);
    assert.strictEqual(res.data.fallbackAvailable, true);
    assert.strictEqual(res.data.attemptsLeft, 2);
  });

  // 13. Face Verification with Matching Face -> Succeeded and issues full JWT
  await test('Face verification succeeds with matching face and issues full JWT session', async () => {
    const res = await request('/face-auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: activeChallengeId,
        image: faceImageBase64,
      }),
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.verified, true);
    assert(res.data.data.token, 'Issued authenticated JWT session token');
    assert.strictEqual(res.data.data.user.email, testUser.email);
    assert(res.data.data.similarityScore >= 0.85, `Similarity score ${res.data.data.similarityScore} >= 0.85`);
  });

  // 14. Replay Attack Protection: Reusing the same challengeId is rejected
  await test('Replay attack protection: Reusing completed challenge is rejected', async () => {
    const res = await request('/face-auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: activeChallengeId,
        image: faceImageBase64,
      }),
    });
    assert.strictEqual(res.status, 400);
    assert(res.data.message.includes('completed') || res.data.message.includes('invalid'));
  });

  // 15. Fallback Password Authentication Pathway
  await test('Fallback password authentication pathway allows sign-in when camera fails', async () => {
    // Generate new challenge
    const chalRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    const fallbackChallengeId = chalRes.data.data.challengeId;

    // Use fallback endpoint
    const fallbackRes = await request('/face-auth/fallback', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: fallbackChallengeId,
        password: testUser.password,
      }),
    });
    assert.strictEqual(fallbackRes.status, 200);
    assert.strictEqual(fallbackRes.data.success, true);
    assert(fallbackRes.data.data.token, 'Fallback issued session token');
  });

  // 16. Disable Face Login
  await test('Disable face login requires password confirmation', async () => {
    // Wrong password -> fails
    const badRes = await request('/face-auth/disable', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({ password: 'WrongPassword' }),
    });
    assert.strictEqual(badRes.status, 401);

    // Correct password -> succeeds
    const goodRes = await request('/face-auth/disable', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({ password: testUser.password }),
    });
    assert.strictEqual(goodRes.status, 200);
    assert.strictEqual(goodRes.data.success, true);

    // Verify status is now DISABLED
    const statusRes = await request('/face-auth/status', {
      method: 'GET',
      token: userToken,
    });
    assert.strictEqual(statusRes.data.data.isEnrolled, false);
    assert.strictEqual(statusRes.data.data.status, 'DISABLED');
  });

  // 17. Standard login succeeds directly when face login is disabled
  await test('Standard login directly issues session when face auth is disabled', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.requiresFaceAuth, false);
    assert(res.data.data.token, 'Direct token issued');
  });

  // 18. Re-enroll Face Profile
  await test('Re-enroll face profile updates biometric template', async () => {
    const res = await request('/face-auth/reenroll', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({
        password: testUser.password,
        image: faceImageBase64,
        consent: true,
      }),
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);

    const statusRes = await request('/face-auth/status', {
      method: 'GET',
      token: userToken,
    });
    assert.strictEqual(statusRes.data.data.isEnrolled, true);
    assert.strictEqual(statusRes.data.data.status, 'ACTIVE');
  });

  // 19. Revoke Biometric Consent & Permanently Purge Templates
  await test('Revoke biometric consent completely purges templates from database', async () => {
    const res = await request('/face-auth/revoke-consent', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({ password: testUser.password }),
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);

    const statusRes = await request('/face-auth/status', {
      method: 'GET',
      token: userToken,
    });
    assert.strictEqual(statusRes.data.data.isEnrolled, false);
    assert.strictEqual(statusRes.data.data.status, 'NONE');
  });

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log('======================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
