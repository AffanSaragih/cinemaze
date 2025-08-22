#!/usr/bin/env bash
set -euo pipefail

ROOT="src/scss"

echo "===> Ensuring directory structure..."
mkdir -p "$ROOT"/{base,functions,mixins,variables}

echo "===> Write/overwrite index aggregators..."
cat > "$ROOT/variables/_index.scss" <<'EOF'
@forward "./fonts";
@forward "./spacing";
@forward "./colors";
@forward "./radius";
EOF

cat > "$ROOT/functions/_index.scss" <<'EOF'
@forward "./rem-calc";
@forward "./get-spacing";
@forward "./get-color";
@forward "./get-radius";
EOF

cat > "$ROOT/mixins/_index.scss" <<'EOF'
@forward "./breakpoints";
@forward "./typography";
EOF

cat > "$ROOT/base/_index.scss" <<'EOF'
@forward "./reset";
@forward "./normalize";
@forward "./fontFamily";
@forward "./general";
@forward "./base.background";
EOF

echo "===> Create/overwrite hub _shared.scss..."
cat > "$ROOT/_shared.scss" <<'EOF'
@forward "variables/index";
@forward "functions/index";
@forward "mixins/index";
EOF

echo "===> Remove redundant variables/_shared.scss if exists..."
rm -f "$ROOT/variables/_shared.scss" || true

# helper: pastikan baris @use hub ada di paling atas (tanpa duplikasi)
ensure_use_top () {
  local file="$1"
  local line='@use "@/scss/_shared" as *;'
  case "$file" in
    *"/base/"*) return 0;;   # skip file base (CSS emitter)
  esac
  [[ "$file" =~ \.scss$ ]] || return 0

  if grep -qF "$line" "$file"; then
    # pastikan berada di paling atas
    local first_nonempty
    first_nonempty=$(awk 'NF{print;exit}' "$file")
    if [[ "${first_nonempty:-}" != "$line" ]]; then
      tmp=$(mktemp)
      { echo "$line"; echo; grep -vF "$line" "$file"; } > "$tmp"
      mv "$tmp" "$file"
    fi
  else
    tmp=$(mktemp)
    { echo "$line"; echo; cat "$file"; } > "$tmp"
    mv "$tmp" "$file"
  fi
}

echo "===> Convert legacy @import and inject hub usage..."

# 1) Hapus semua baris @import (robust; aman kalau tidak ada hasil)
mapfile -d '' -t import_files < <(grep -RIZl --include='*.scss' '@import' src || true)
if ((${#import_files[@]} > 0)); then
  for f in "${import_files[@]}"; do
    [[ -n "$f" && -f "$f" ]] || continue
    sed -i '/@import/d' "$f"
  done
else
  echo "    (no @import found)"
fi

# 2) Pastikan @use hub ada di paling atas setiap .scss (kecuali /base/)
while IFS= read -r -d '' f; do
  ensure_use_top "$f"
done < <(find src -type f -name '*.scss' -print0)

echo "===> Ensure globals.scss and app-layout.scss import the hub and base..."
# globals.scss
if [[ -f "$ROOT/globals.scss" ]]; then
  if ! grep -q '@use "@/scss/_shared" as \*;' "$ROOT/globals.scss"; then
    sed -i '1i @use "@/scss/_shared" as *;' "$ROOT/globals.scss"
  fi
  if ! grep -q '@use "./base/index" as \*;' "$ROOT/globals.scss"; then
    sed -i '1i @use "./base/index" as *;' "$ROOT/globals.scss"
  fi
fi

# app-layout.scss (opsional)
if [[ -f "$ROOT/app-layout.scss" ]]; then
  if ! grep -q '@use "@/scss/_shared" as \*;' "$ROOT/app-layout.scss"; then
    sed -i '1i @use "@/scss/_shared" as *;' "$ROOT/app-layout.scss"
  fi
fi

echo "===> Final tree:"
if command -v tree >/dev/null 2>&1; then
  tree "$ROOT"
else
  find "$ROOT" -maxdepth 2 -type f | sort
fi

echo "===> Done. Re-run dev server/build."
