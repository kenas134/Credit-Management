// src/tests/unit/auth.test.js
// Unit tests for auth service utilities

const { hashPassword, comparePassword } = require('../../utils/hashPassword');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../../utils/generateToken');

// Set required env variables for tests
process.env.JWT_SECRET = 'test_secret_key_minimum_32_characters_long';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_minimum_32_characters_long';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

describe('Password Hashing', () => {
  it('should hash a password', async () => {
    const hash = await hashPassword('password123');
    expect(hash).toBeDefined();
    expect(hash).not.toBe('password123');
    expect(hash.length).toBeGreaterThan(20);
  });

  it('should correctly compare valid password', async () => {
    const hash = await hashPassword('mypassword');
    const result = await comparePassword('mypassword', hash);
    expect(result).toBe(true);
  });

  it('should reject wrong password', async () => {
    const hash = await hashPassword('correctpassword');
    const result = await comparePassword('wrongpassword', hash);
    expect(result).toBe(false);
  });
});

describe('JWT Token Generation', () => {
  const payload = { userId: 'user-123', role: 'OWNER' };

  it('should generate a valid access token', () => {
    const token = generateAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should generate a valid refresh token', () => {
    const token = generateRefreshToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should verify and decode a valid access token', () => {
    const token = generateAccessToken(payload);
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe('user-123');
    expect(decoded.role).toBe('OWNER');
  });

  it('should throw on invalid token', () => {
    expect(() => verifyToken('invalid.token.here', process.env.JWT_SECRET)).toThrow();
  });
});
