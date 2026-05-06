import { auth } from './firebase-config.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  await signInWithPopup(auth, provider);
}

export async function logout() {
  await signOut(auth);
  window.location.href = 'index.html';
}

export async function getToken() {
  return auth.currentUser?.getIdToken() ?? null;
}

export function requireAuth() {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (!user) {
        window.location.href = 'index.html';
        reject(new Error('Not authenticated'));
      } else {
        resolve(user);
      }
    });
  });
}

export function redirectIfLoggedIn(target = 'dashboard.html') {
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = target;
  });
}

export { onAuthStateChanged, auth };
