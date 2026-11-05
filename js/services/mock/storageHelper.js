/**
 * @file storageHelper.js
 * @description LocalStorage 래퍼 도우미 (네트워크 레이턴시 시뮬레이션 및 JSON 직렬화 안전 처리)
 */

/**
 * 인위적 지연 (네트워크 레이턴시 시뮬레이션)
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let inMemoryStore = {};

export const storageHelper = {
  /**
   * 데이터 조회
   * @template T
   * @param {string} key
   * @param {T} defaultValue
   * @returns {Promise<T>}
   */
  get: async (key, defaultValue) => {
    await delay(120);
    try {
      if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return inMemoryStore[key] !== undefined ? inMemoryStore[key] : defaultValue;
    } catch (error) {
      console.error(`[storageHelper] getItem error for ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * 데이터 저장
   * @template T
   * @param {string} key
   * @param {T} value
   * @returns {Promise<void>}
   */
  set: async (key, value) => {
    await delay(120);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        inMemoryStore[key] = value;
      }
    } catch (error) {
      console.error(`[storageHelper] setItem error for ${key}:`, error);
      throw error;
    }
  },

  /**
   * 데이터 삭제
   * @param {string} key
   * @returns {Promise<void>}
   */
  remove: async (key) => {
    await delay(60);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      delete inMemoryStore[key];
    }
  }
};

