import {
    ChromeStorageStore,
    KeyConfigSpec,
    LocalStorageStore,
    register,
} from 'key-config';

/**
 * Initialize the chrome extension page.
 */
export function initOptionsPage(): void {
    register();
}
/**
 * Spec for the extension.
 */
export const spec: KeyConfigSpec = [
    {
        default: {
            key: 'ArrowRight',
            shiftKey: true,
        },
        id: 'insert-last',
        name: chrome.i18n.getMessage('insert_last'),
    },
    {
        default: {
            ctrlKey: true,
            key: 'L',
            shiftKey: true,
        },
        id: 'insert-anywhere',
        name: chrome.i18n.getMessage('insert_anywhere'),
    },
];

/**
 * Initialize a store.
 */
export function initStore(): LocalStorageStore | ChromeStorageStore {
    if ('undefined' !== typeof chrome) {
        // If chrome extension environment is enabled, use
        // chrome.sync store.
        return new ChromeStorageStore('chrome-xxxx');
    } else {
        // Otherwise fall back to localStorage.
        return new LocalStorageStore('chrome-xxxx');
    }
}
