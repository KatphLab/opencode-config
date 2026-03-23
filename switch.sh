#!/usr/bin/env bash
set -euo pipefail

main_file="opencode.json"
copilot_file="opencode.json.copilot"
api_file="opencode.json.api"

if [[ ! -f "$main_file" ]]; then
    echo "Missing $main_file" >&2
    exit 1
fi

if grep -q 'copilot' "$main_file"; then
    mv "$main_file" "$copilot_file"
    mv "$api_file" "$main_file"
else
    mv "$main_file" "$api_file"
    mv "$copilot_file" "$main_file"
fi
