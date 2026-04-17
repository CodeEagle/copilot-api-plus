#!/bin/sh
if [ "$1" = "--auth" ]; then
  # Run auth command
  exec bun run dist/main.js auth
else
  # Start server without requiring GH_TOKEN — accounts are added via web UI
  exec bun run dist/main.js start "$@"
fi

