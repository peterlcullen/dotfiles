# Agent Instructions

## Overview
macOS dotfiles managed with [GNU Stow](https://www.gnu.org/software/stow/). Each top-level directory is a stow package symlinked into `~`.

## Installation
Repo must live at `~/dotfiles`.
```bash
brew install stow
cd ~/dotfiles
stow git tmux nvim starship  # symlink chosen packages
```

## Stow Packages
- **git** — `.gitconfig`, `.gitignore_global`, `.git-completion.bash`
- **nvim** — kickstart.nvim config at `.config/nvim/`
- **tmux** — `.tmux.conf` (prefix: `C-f`, TPM + dracula theme)
- **starship** — `.config/starship.toml`

## Commit Attribution
AI commits MUST include:
```
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Key Conventions
- Shell uses vi mode (`set -o vi`) and starship prompt
- Tmux prefix is `C-f`
- Config uses 2-space indentation (tabs in gitconfig per git convention)
- New stow packages: create `<name>/` mirroring target path from `~`
