import { readFileSync } from "node:fs"
import { join } from "node:path"
import { Hono } from "hono"
import { cors } from "hono/cors"

import { apiKeyAuthMiddleware } from "./lib/api-key-auth"
import { modelLogger } from "./lib/model-logger"
import { adminRoutes } from "./routes/admin/route"
import { completionRoutes } from "./routes/chat-completions/route"
import { embeddingRoutes } from "./routes/embeddings/route"
import { messageRoutes } from "./routes/messages/route"
import { modelRoutes } from "./routes/models/route"
import { tokenRoute } from "./routes/token/route"
import { usageRoute } from "./routes/usage/route"

export const server = new Hono()

server.use(modelLogger())
server.use(cors())
server.use(apiKeyAuthMiddleware)

// Serve embedded web management UI
server.get("/", (c) => {
  try {
    const uiPath = join(process.cwd(), "pages", "index.html")
    const html = readFileSync(uiPath, "utf8")
    return c.html(html)
  } catch {
    return c.text("Server running")
  }
})

// Chat completions
server.route("/chat/completions", completionRoutes)

// Models
server.route("/models", modelRoutes)

server.route("/embeddings", embeddingRoutes)
server.route("/usage", usageRoute)
server.route("/token", tokenRoute)

// Compatibility with tools that expect v1/ prefix
server.route("/v1/chat/completions", completionRoutes)
server.route("/v1/models", modelRoutes)
server.route("/v1/embeddings", embeddingRoutes)

// Anthropic compatible endpoints
server.route("/v1/messages", messageRoutes)

// Admin API (Usage Viewer UI)
server.route("/api", adminRoutes)
