export function safeCallbackUrl(
  url: string | undefined | null,
  fallback = "/book",
): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) {
    return fallback;
  }
  return url;
}
