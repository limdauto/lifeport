/** Stub for Cloudflare Workers — use the runtime WebSocket instead of Node `ws`. */
const Ws = typeof WebSocket !== 'undefined' ? WebSocket : class {} as typeof WebSocket;

export default Ws;
