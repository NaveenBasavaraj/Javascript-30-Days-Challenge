'use strict';
/* ============================================================================
 * Browser APIs that Node does not provide, implemented to spec so topic 10
 * runs under plain `node`.
 *
 * Node 20 ALREADY has: URL, URLSearchParams, structuredClone, Intl,
 * TextEncoder, AbortController, EventTarget, fetch, crypto.randomUUID,
 * queueMicrotask, Blob and FormData. Only Storage is missing, so that is
 * all this file provides — plus a quota-limited variant for one exercise.
 * ==========================================================================*/

class Storage {
  #data = new Map();
  #quota;

  constructor({ quota = Infinity } = {}) {
    this.#quota = quota;
  }

  get length() { return this.#data.size; }

  key(index) {
    const keys = [...this.#data.keys()];
    return index < keys.length ? keys[index] : null;
  }

  /** Values are ALWAYS stored as strings — that is the real behaviour. */
  setItem(key, value) {
    const k = String(key);
    const v = String(value);
    const projected = this.#size() - (this.#data.get(k)?.length ?? 0) + v.length;
    if (projected > this.#quota) {
      const err = new Error('The quota has been exceeded.');
      err.name = 'QuotaExceededError';
      throw err;
    }
    this.#data.set(k, v);
  }

  getItem(key) {
    const k = String(key);
    return this.#data.has(k) ? this.#data.get(k) : null;
  }

  removeItem(key) { this.#data.delete(String(key)); }

  clear() { this.#data.clear(); }

  #size() { return [...this.#data.values()].reduce((n, v) => n + v.length, 0); }
}

/** A fresh pair of storages, so each exercise starts clean. */
function createStorages(options) {
  return {
    localStorage: new Storage(options),
    sessionStorage: new Storage(options),
  };
}

module.exports = { Storage, createStorages };
