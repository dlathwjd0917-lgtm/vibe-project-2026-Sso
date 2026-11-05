/**
 * @file firebaseConfig.js
 * @description Firebase SDK 초기화 설정 스텁
 * 추후 실제 Firebase 프로젝트 연동 시 아래 설정값을 입력하고 주석을 해제합니다.
 */

// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "vlast-shop.firebaseapp.com",
  projectId: "vlast-shop",
  storageBucket: "vlast-shop.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

export const db = null;
export const storage = null;

