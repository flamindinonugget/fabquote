export const storageWarningEvent = "fabquote:storage-warning";

type StorageWarningDetail = {
  message: string;
};

export function readJson<T>(key: string, fallback: T): T {
  const value = readString(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    dispatchStorageWarning(
      "Some saved local data could not be read. New changes will still work, but corrupted records were skipped.",
    );
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  return writeString(key, JSON.stringify(value));
}

export function readString(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    dispatchStorageWarning(
      "FabQuote could not read local browser storage. Saved workspace data may be unavailable in this browser mode.",
    );
    return null;
  }
}

export function writeString(key: string, value: string) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    dispatchStorageWarning(
      "FabQuote could not save to local browser storage. Check browser privacy settings or available storage space.",
    );
    return false;
  }
}

export function removeStoredItem(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    dispatchStorageWarning(
      "FabQuote could not update local browser storage in this browser mode.",
    );
  }
}

function dispatchStorageWarning(message: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<StorageWarningDetail>(storageWarningEvent, {
      detail: { message },
    }),
  );
}
