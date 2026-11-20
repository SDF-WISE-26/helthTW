#!/usr/bin/env bash
# Usage: move-ticket.sh <issue> <status>. Moves the ticket on board 1 to that column.
# Needs GH_TOKEN with project write access (the app token) and GITHUB_REPOSITORY.
set -euo pipefail
issue=$1
status=$2

read -r project field option item < <(gh api graphql \
  -f org="${GITHUB_REPOSITORY%/*}" -f repo="${GITHUB_REPOSITORY#*/}" -F issue="$issue" \
  -f query='query($org: String!, $repo: String!, $issue: Int!) {
    organization(login: $org) {
      projectV2(number: 1) {
        id
        field(name: "Status") { ... on ProjectV2SingleSelectField { id options { id name } } }
      }
    }
    repository(owner: $org, name: $repo) {
      issue(number: $issue) { projectItems(first: 20) { nodes { id project { number } } } }
    }
  }' \
  --jq '.data as $d | $d.organization.projectV2 as $p | [
    $p.id, $p.field.id,
    ($p.field.options[] | select(.name == "'"$status"'") | .id),
    ($d.repository.issue.projectItems.nodes[] | select(.project.number == 1) | .id)
  ] | @tsv')
if [ -z "${item:-}" ]; then
  echo "::error::Ticket #$issue ist nicht auf dem Board oder die Spalte '$status' fehlt"
  exit 1
fi
gh api graphql -f project="$project" -f item="$item" -f field="$field" -f option="$option" \
  -f query='mutation($project: ID!, $item: ID!, $field: ID!, $option: String!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $project, itemId: $item, fieldId: $field, value: { singleSelectOptionId: $option }
    }) { projectV2Item { id } }
  }' > /dev/null
echo "Ticket #$issue wurde nach '$status' verschoben"
