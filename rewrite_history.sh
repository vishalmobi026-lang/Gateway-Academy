#!/bin/bash
git filter-branch --force \
  --index-filter 'git rm --cached --ignore-unmatch backend/.env frontend/.env' \
  --env-filter '
    GIT_AUTHOR_NAME="vishalmobi026-lang"
    GIT_AUTHOR_EMAIL="vishalmobi026-lang@users.noreply.github.com"
    GIT_COMMITTER_NAME="vishalmobi026-lang"
    GIT_COMMITTER_EMAIL="vishalmobi026-lang@users.noreply.github.com"
  ' HEAD
