'use server';

import { deleteSession } from '../lib/session';
import { redirect } from 'next/navigation';

export async function logout() {
  // 1. Burahin ang session cookie gamit yung function na ginawa natin dati
  await deleteSession();
  
  // 2. I-redirect ang user pabalik sa login page
  redirect('/login');
}