#!/usr/bin/env bash
# Raises Linux inotify limits so Turbopack/Next dev can watch node_modules.
# Run once with sudo: sudo ./scripts/increase-file-watch-limit.sh

set -euo pipefail

sysctl -w fs.inotify.max_user_watches=524288
sysctl -w fs.inotify.max_user_instances=512

CONF_FILE="/etc/sysctl.d/99-increase-inotify.conf"
if [[ -w /etc/sysctl.d ]]; then
  cat >"$CONF_FILE" <<'EOF'
fs.inotify.max_user_watches=524288
fs.inotify.max_user_instances=512
EOF
  echo "Persisted settings in $CONF_FILE"
else
  echo "Add these lines to /etc/sysctl.conf to persist after reboot:"
  echo "fs.inotify.max_user_watches=524288"
  echo "fs.inotify.max_user_instances=512"
fi

echo "Current limits:"
sysctl fs.inotify.max_user_watches fs.inotify.max_user_instances
