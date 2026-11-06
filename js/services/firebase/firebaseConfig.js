/**
 * @file firebaseConfig.js
 * @description Firebase SDK 초기화 설정
 * 공식 CDN(v10 Modular)을 사용하여 별도 번들러 없이 브라우저에서 바로 동작합니다.
 * experimentalForceLongPolling: true 옵션을 강제하여
 * WebChannel 스트리밍 지연/버퍼링 없이 안정적인 HTTP 롱폴링으로 즉시 연결합니다.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { initializeFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// 사용자 제공 Firebase 프로젝트 설정값
export const firebaseConfig = {
  apiKey: "AIzaSyAt-qmXZ7miQdNcgtk9bBMf11wQtG7ZLCE",
  authDomain: "sso-wed-project.firebaseapp.com",
  projectId: "sso-wed-project",
  storageBucket: "sso-wed-project.firebasestorage.app",
  messagingSenderId: "42504746302",
  appId: "1:42504746302:web:e2ab5c06c7f233d2dea86f"
};

// Initialize Firebase App & Firestore (강제 롱폴링 설정)
export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
