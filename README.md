# dotfiles

## Stow
Use [stow](https://www.gnu.org/software/stow/) to install the desired packages in this repo.  
  - `brew install stow` to get stow on a mac
  - the repo should be in `~/dotfiles` because stow needs to put symlinks into the home directory
  - cd into the repo, then `stow bash git vim` to install configurations in the bash, git, and vim directories.  Add any others you need.

## Vim
  - make sure vim config are installed with `stow vim`
  - run `./install_vundle.sh`
  - execute `:PluginInstall` inside vim

## Phoenix
OSX window manager - [phoenix](https://github.com/jasonm23/phoenix)

- load this config with `stow phoenix`
- install phoenix via homebrew/cask `brew tap caskroom/cask && brew cask install phoenix`

## iTerm themes
- `stow themes` if you want base16 themes to be loaded into the shell

## Files outside of this repo
For convenience, `~/.extra` and any file beginning with `.extra` will be sourced.
