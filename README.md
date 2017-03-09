# dotfiles

## Stow
Use [stow](https://www.gnu.org/software/stow/) to install the desired packages in this repo.  
  - `brew install stow` to get stow on a mac
  - the repo should be at `~/dotfiles` because stow will place the symlinks up one directory (and we want them in `~`)
  - cd into the repo, then `stow bash git vim` to install configurations in the bash, git, and vim directories.  Add any others you need.

## Vim
  - make sure vim config are installed with `stow vim`
  - run `./install_vundle.sh`
  - execute `:PluginInstall` inside vim

## Phoenix
OSX window manager - [phoenix](https://github.com/jasonm23/phoenix)

- load this config with `stow phoenix`
- install phoenix via homebrew/cask `brew tap caskroom/cask && brew cask install phoenix`

## base16-shell
- `stow base16-shell` if you want to use this
- this is a git submodule so you also need to run `git submodule init && git submodule update`

## Files outside of this repo
For convenience, the `.bash_profile` in this repo will source any files matching the glob `~/.extra*`
