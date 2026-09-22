import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { restoreHubBaseUrl } from "./lib/hub-base";

const handle = createStartHandler(defaultStreamHandler);

/**
 * Production router basepath is `/logolab`. The hub strips that prefix, so
 * restore it before TanStack matches routes.
 */
export default {
  async fetch(request: Request, requestOpts?: Parameters<typeof handle>[1]) {
    return handle(restoreHubBaseUrl(request, process.env.TSS_ROUTER_BASEPATH), requestOpts);
  },
};
