# Agent Instructions

## Overview
macOS dotfiles managed with [GNU Stow](https://www.gnu.org/software/stow/). Each top-level directory is a stow package symlinked into `~`.

## Installation
Repo must live at `~/dotfiles`.
```bash
brew install stow
cd ~/dotfiles
stow bash git vim tmux nvim starship  # symlink chosen packages
```

## Stow Packages
- **bash** — `.bash_profile`, `.bashrc`, `.aliases`, `.bash_prompt`. Sources `~/.extra*` for machine-local config.
- **git** — `.gitconfig`, `.gitignore_global`, `.git-completion.bash`
- **vim** — `.vimrc`, `.vimrc.bundles` (Vundle)
- **nvim** — kickstart.nvim config at `.config/nvim/`
- **tmux** — `.tmux.conf` (prefix: `C-f`, TPM + dracula theme)
- **starship** — `.config/starship.toml`
- **bin** — utility scripts in `~/bin`
- **themes** — base16 iTerm color schemes
- **guard** — Ruby Guard config
- **base16** — base16-shell (git submodule: `git submodule init && git submodule update`)

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
