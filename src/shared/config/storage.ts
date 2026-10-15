// localStorageに保存する際のキー

const STORAGE_PREFIX = 'sales-manager';

export const storageKey = (name: string) => `${STORAGE_PREFIX}:${name}`;
