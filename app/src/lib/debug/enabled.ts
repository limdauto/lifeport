/** Debug previews — dev by default; set NEXT_PUBLIC_ENABLE_DEBUG=true to allow in production builds. */
export function isDebugEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true'
  );
}
