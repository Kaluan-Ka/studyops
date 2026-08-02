#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
runtime_project="/tmp/supabase"

mkdir -p "$runtime_project/migrations" "$runtime_project/snippets"
cp "$project_root/supabase/config.toml" "$runtime_project/config.toml"
cp "$project_root"/supabase/migrations/*.sql "$runtime_project/migrations/"

exec "$project_root/node_modules/.bin/supabase" --workdir /tmp "$@"
