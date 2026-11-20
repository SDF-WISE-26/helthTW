#!/usr/bin/env bash
# Usage: pr-comment.sh <pr> <key> [body-file]. Keeps one bot comment per key on the PR:
# creates or updates it with the file's text, deletes it when no file is given.
# Needs GH_TOKEN (github.token) and GITHUB_REPOSITORY.
set -euo pipefail
pr=$1
key=$2
file=${3:-}
marker="<!-- $key -->"

id=$(gh api "repos/$GITHUB_REPOSITORY/issues/$pr/comments" --paginate \
  --jq '.[] | select(.user.login == "github-actions[bot]" and (.body | startswith("'"$marker"'"))) | .id' |
  head -n 1)

if [ -z "$file" ]; then
  if [ -n "$id" ]; then gh api -X DELETE "repos/$GITHUB_REPOSITORY/issues/comments/$id"; fi
  exit 0
fi
body=$(printf '%s\n%s' "$marker" "$(cat "$file")")
if [ -n "$id" ]; then
  gh api -X PATCH "repos/$GITHUB_REPOSITORY/issues/comments/$id" -f body="$body" > /dev/null
else
  gh api "repos/$GITHUB_REPOSITORY/issues/$pr/comments" -f body="$body" > /dev/null
fi
