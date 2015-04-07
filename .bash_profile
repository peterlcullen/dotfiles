#!/bin/bash

# Add `~/bin` to the `$PATH`
export PATH="$HOME/bin:$PATH";

# Load the shell dotfiles, and then some:
# * ~/.path can be used to extend `$PATH`.
for file in ~/.{path,bash_prompt,exports,aliases,functions,git-completion.bash}; do
	[ -r "$file" ] && [ -f "$file" ] && source "$file";
done;
unset file;

# * ~/.extra* can be used for other settings you don’t want to commit.
for file in ~/.extra*; do
	[ -r "$file" ] && [ -f "$file" ] && source "$file";
done;
unset file;

# use vi mode on prompt
set -o vi

# npm bins
export PATH="/usr/local/share/npm/bin:$PATH"

# Added by the Heroku Toolbelt
export PATH="/usr/local/heroku/bin:$PATH"

# homebrew bins
export PATH="/usr/local/bin:$PATH"

# rbenv shims and autocompletion
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

# pyenv shims, autocomplete, etc
if which pyenv > /dev/null; then eval "$(pyenv init -)"; fi

# Base16 Shell
# BASE16_SHELL="$HOME/dotfiles/themes/base16-default.dark.sh"
BASE16_SHELL="$HOME/dotfiles/themes/base16-default.dark.sh"
[[ -s $BASE16_SHELL ]] && source $BASE16_SHELL

