// Simple in-memory cache for prefetched category data - speeds up navigation
const cache = new Map<string, unknown>();

export function getCachedProperties(category: string, city: string): unknown | null {
  const key = `${category}|${city}`;
  return cache.get(key) ?? null;
}

export function setCachedProperties(category: string, city: string, data: unknown): void {
  const key = `${category}|${city}`;
  cache.set(key, data);
}

export function prefetchCategoryData(category: string, city = 'Mumbai'): void {
  const key = `${category}|${city}`;
  if (cache.has(key)) return; // Already cached
  const url = `/api/properties?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}`;
  fetch(url)
    .then((res) => res.ok ? res.json() : null)
    .then((data) => data && cache.set(key, data))
    .catch(() => {});
}
