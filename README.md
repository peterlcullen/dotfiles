# dotfiles

## Stow
Use [stow](https://www.gnu.org/software/stow/) to install the desired packages in this repo.
  - `brew install stow` to get stow on a mac
  - the repo should be at `~/dotfiles` because stow will place the symlinks up one directory (and we want them in `~`)
  - cd into the repo, then `stow git tmux nvim starship ghostty` to install configurations. Add any others you need.

## TPM (Tmux Plugin Manager)
  - `git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm`
  - Reload tmux config, then `prefix + I` to install plugins
