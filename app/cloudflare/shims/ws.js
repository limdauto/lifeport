/** Cloudflare Workers WebSocket shim (replaces Node `ws` in the OpenNext bundle). */
const Ws = typeof WebSocket !== 'undefined' ? WebSocket : class {};

export default Ws;
