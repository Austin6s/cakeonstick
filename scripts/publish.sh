#!/usr/bin/env bash
# Publishes the built site in dist/ to the gh-pages branch, which GitHub Pages serves.
#
#   production  ->  the root of the branch (everything except the dev/ folder)
#   dev         ->  the dev/ folder
#
# Each environment only ever replaces its own files, so a dev deploy can't touch
# production and a production deploy leaves dev alone. Run by the deploy workflow;
# needs GITHUB_TOKEN (with contents: write) and GITHUB_REPOSITORY.
#
# CUSTOM_DOMAIN (optional, for example cakeonstick.com) is written to the CNAME file
# at the root of the branch, which is how GitHub Pages knows the site's own domain.
# Without it the file is removed and the site is served from github.io.
set -euo pipefail

target="${1:?usage: publish.sh production|dev}"
dist="$(pwd)/dist"
: "${GITHUB_TOKEN:?GITHUB_TOKEN is not set}" "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is not set}"

[ -f "$dist/index.html" ] || { echo "dist/index.html is missing: build the site first" >&2; exit 1; }

# Refuse to put a build in the wrong place: only production builds are indexable.
if grep -q '<meta name="robots" content="noindex' "$dist/index.html"; then built=dev; else built=production; fi
if [ "$built" != "$target" ]; then
  echo "dist/ is a $built build but the target is $target: refusing to publish" >&2
  exit 1
fi

repo_url="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
work="$(mktemp -d)"
git clone --quiet --depth 1 --branch gh-pages "$repo_url" "$work"
cd "$work"

case "$target" in
  production)
    find . -mindepth 1 -maxdepth 1 ! -name .git ! -name dev -exec rm -rf {} +
    cp -a "$dist"/. .
    ;;
  dev)
    rm -rf dev
    mkdir dev
    cp -a "$dist"/. dev/
    ;;
  *)
    echo "unknown target: $target" >&2
    exit 1
    ;;
esac
touch .nojekyll # GitHub Pages must not run Jekyll: it would drop the _astro folder
rm -f CNAME
if [ -n "${CUSTOM_DOMAIN:-}" ]; then printf '%s\n' "$CUSTOM_DOMAIN" > CNAME; fi

git add -A
if git diff --cached --quiet; then
  echo "gh-pages already matches this build: nothing to publish"
  exit 0
fi
git -c user.name="github-actions[bot]" \
    -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
    commit --quiet -m "Deploy $target from ${GITHUB_SHA:-local}"
git push --quiet origin gh-pages
echo "Published $target to gh-pages"
