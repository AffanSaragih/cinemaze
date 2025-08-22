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

# helper to ensure a file has a line at very top (without duplicating)
ensure_use_top () {
  local file="$1"
  local line='@use "@/scss/_shared" as *;'
  # skip base files (CSS emitters) – mereka di-load via globals.scss
  case "$file" in
    *"/base/"*) return 0;;
  esac
  [[ "$file" =~ \.scss$ ]] || return 0

  if grep -qF "$line" "$file"; then
    # pastikan baris tsb ada di paling atas (sebelum rules lain)
    local first_nonempty
    first_nonempty=$(awk 'NF{print;exit}' "$file")
    if [[ "$first_nonempty" != "$line" ]]; then
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
# 1) hapus semua baris @import (tanpa ripgrep)
mapfile -t import_files < <(grep -RIl --include='*.scss' '@import' src || true)
for f in "${import_files[@]:-}"; do
  sed -i '/@import/d' "$f"
done

# 2) pastikan @use hub ada di paling atas setiap .scss (kecuali /base/)
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
