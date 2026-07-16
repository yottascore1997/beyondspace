if (typeof URL !== 'undefined' && !URL.canParse) {
  URL.canParse = function (url: string | URL, base?: string | URL) {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}

export function register() {
  // Any startup/instrumentation code can go here
}
