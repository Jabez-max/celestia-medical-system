import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// 1. Siguraduhin na may JWT_SECRET sa .env para hindi mag-crash ang app
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET is missing in your .env file!");
}
const key = new TextEncoder().encode(secretKey);

// 2. Encryption (JWT Generator)
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') 
    .sign(key);
}

// 3. Decryption (Verification)
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // Kung peke ang token, ibabalik as null
    return null;
  }
}

// 4. Session Manager
export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 
  const session = await encrypt({ userId, expires });

  const cookieStore = await cookies();
  cookieStore.set('session', session, { expires, httpOnly: true, secure: true });
}

// 5. Getter (Para malaman kung sino ang naka-login)
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

// 6. Logout (Delete Session) - Importante para sa Security!
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}