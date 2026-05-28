#!/usr/bin/env bash
# DEVOPS-205: Sync Wave 5 labels to GitHub from .github/wave5-labels.yml
# Usage: bash scripts/sync-labels.sh [--repo owner/repo]
set -euo pipefail

REPO="${REPO:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
LABELS_FILE="$(dirname "$0")/../.github/wave5-labels.yml"

if ! command -v gh &>/dev/null; then
  echo "ERROR: gh CLI not found. Install from https://cli.github.com" >&2
  exit 1
fi

if ! command -v yq &>/dev/null; then
  echo "ERROR: yq not found. Install from https://github.com/mikefarah/yq" >&2
  exit 1
fi

echo "Syncing Wave 5 labels to ${REPO}..."

yq e '.labels[]' -o=json "$LABELS_FILE" | while IFS= read -r label; do
  name=$(echo "$label" | yq e '.name' -)
  color=$(echo "$label" | yq e '.color' -)
  description=$(echo "$label" | yq e '.description' -)

  if gh label list --repo "$REPO" --json name -q '.[].name' | grep -qx "$name"; then
    gh label edit "$name" --repo "$REPO" --color "$color" --description "$description" \
      && echo "  updated: $name" \
      || echo "  WARN: could not update $name"
  else
    gh label create "$name" --repo "$REPO" --color "$color" --description "$description" \
      && echo "  created: $name" \
      || echo "  WARN: could not create $name"
  fi
done

echo "Done."
