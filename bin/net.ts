import { SocksProxyAgent } from "socks-proxy-agent";
import WebSocket from "ws";
import fetch from "node-fetch";
const proxyHost = "127.0.0.1";
const net: any = {
  proxyPort: "7890",
  httpAgent: null,
  httpsAgent: null,
  wsAgent: null,
}
export const getAgent = (a:
  "httpAgent" |
  "httpsAgent" |
  "wsAgent"
) => {
  return net[a];
}
export function initPort(port) {
  net.proxyPort = port;
  net.httpAgent = new SocksProxyAgent(`socks5://${proxyHost}:${net.proxyPort}`, {
    keepAlive: true,
  });
  net.httpsAgent = new SocksProxyAgent(`socks5://${proxyHost}:${net.proxyPort}`, {
    keepAlive: true,
  });
  net.wsAgent = new SocksProxyAgent(`socks5://${proxyHost}:${net.proxyPort}`, {
    keepAlive: true,
  });
}

export const getFetch = () => (
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
) => {
  console.log("myfetch");
  if (typeof input === "string") {
    if (input.startsWith("http://")) {
      init && (init["agent"] = net.httpAgent);
      return fetch(input, init as any);
    } else {
      init && (init["agent"] = net.httpsAgent);
      return fetch(input, init as any);
    }
  } else {
    return fetch(input as any, init as any);
  }
};

export class ProxyWebSocket extends WebSocket {
  constructor(address: string | URL, options?: any) {
    if (!options) options = {};
    options.agent = getAgent("wsAgent");
    super(address, options);
  }
}
