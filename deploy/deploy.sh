#!/usr/bin/env bash
# The only command the deploy key may run on the prod-vm (forced command in authorized_keys).
#   deploy <sha>    images from `docker save` on stdin, then migrate and start them
#   rollback <sha>  start a version that is still on the VM
#   status          running version, recent versions and checksums of the installed files
# This script and compose.yml are installed by hand, owned by root. They never come in over SSH,
# so the deploy key can't change what runs or with which privileges.
set -euo pipefail

dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# compose needs a readable working directory. By hand (sudo -u deploy) it would be the caller's home.
cd "$dir"
compose=(docker compose --project-directory "$dir" -f "$dir/compose.yml")
# Every successful start, newest at the bottom. Image build times can't order versions:
# a commit that doesn't touch the code reuses the cached image with its old timestamp.
history=${XDG_STATE_HOME:-$HOME/.local/state}/helthtw-deploys
keep=5

die() {
  echo "deploy: $*" >&2
  exit 1
}

# Over SSH the request is in SSH_ORIGINAL_COMMAND, by hand it comes as arguments.
read -r action sha extra <<<"${SSH_ORIGINAL_COMMAND:-$*}"
[[ -z $extra ]] || die "too many arguments"

# One deploy at a time.
exec 9<"$dir/deploy.sh"
flock -n 9 || die "another deploy is running"

running() {
  docker inspect --format '{{.Config.Image}}' helthtw-prod-backend-1 2>/dev/null | sed 's/.*://' || true
}

# Returns 2 if nothing was changed, 1 if the new version was started but didn't come up healthy.
start() {
  docker image inspect "helthtw-backend:$1" "helthtw-web:$1" >/dev/null 2>&1 || {
    echo "deploy: images for $1 are not on this VM" >&2
    return 2
  }
  export IMAGE_TAG=$1
  # Migrate on its own first: if it fails, the running version stays untouched.
  "${compose[@]}" run --rm migrate || {
    echo "deploy: migration failed, running version unchanged" >&2
    return 2
  }
  "${compose[@]}" up -d --wait --wait-timeout 120 --remove-orphans || return 1
  mkdir -p "$(dirname "$history")"
  echo "$1" >>"$history"
  echo "deploy: running $1"
}

recent() {
  [[ -f $history ]] || return 0
  tac "$history" | awk '!seen[$0]++' | head -n "$keep"
}

cleanup() {
  # Keeps the images of the last $keep started versions and removes all other commit-hash tags.
  local keep_tags
  keep_tags=$(recent)
  docker image ls --format '{{.Tag}}' helthtw-backend | { grep -E '^[0-9a-f]{40}$' || true; } | while read -r tag; do
    grep -qx "$tag" <<<"$keep_tags" || docker image rm "helthtw-backend:$tag" "helthtw-web:$tag" >/dev/null 2>&1 || true
  done
  docker image prune -f >/dev/null
}

check_sha() {
  [[ $sha =~ ^[0-9a-f]{40}$ ]] || die "usage: $action <40-character commit hash>"
}

case $action in
  deploy)
    check_sha
    loaded=$(docker load)
    # docker save embeds image names. Anything but our two images means a broken or tampered upload.
    if grep -vxq -e "Loaded image: helthtw-backend:$sha" -e "Loaded image: helthtw-web:$sha" <<<"$loaded"; then
      die "unexpected images in upload: $loaded"
    fi
    previous=$(running)
    result=0
    start "$sha" || result=$?
    if ((result == 1)) && [[ -n $previous && $previous != "$sha" ]]; then
      echo "deploy: $sha didn't come up, going back to $previous" >&2
      start "$previous" || true
    fi
    ((result == 0)) || die "deploy of $sha failed"
    cleanup
    ;;
  rollback)
    check_sha
    start "$sha" || die "rollback to $sha failed"
    ;;
  status)
    echo "running: $(running)"
    echo "recent:"
    recent | sed 's/^/  /'
    (cd "$dir" && sha256sum compose.yml deploy.sh)
    ;;
  *)
    die "usage: deploy <sha> | rollback <sha> | status"
    ;;
esac
