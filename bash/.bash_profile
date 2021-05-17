#!/bin/bash

# Add `~/bin` to the `$PATH`
export PATH="$HOME/bin:$PATH";
export PATH="$HOME/go/bin:$PATH";

eval "$(starship init bash)"

[ -f ~/.fzf.bash ] && source ~/.fzf.bash

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

# don't automatically logout on ctrlD
# https://news.ycombinator.com/item?id=18249088
set -o ignoreeof

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

# Load up Base16 Shell (for color fanciness)
BASE16_SHELL=$HOME/base16-shell/
[ -n "$PS1" ] && [ -s $BASE16_SHELL/profile_helper.sh ] && eval "$($BASE16_SHELL/profile_helper.sh)"

# bash_history settings
export HISTTIMEFORMAT='%F %T ' # timestamp in history to improve task tracking
export HISTSIZE=100000         # big history
export HISTFILESIZE=100000     # big history
shopt -s histappend            # append to history, rather than overrite

# The next line updates PATH for the Google Cloud SDK.
if [ -f '~/google-cloud-sdk/path.bash.inc' ]; then source '~/google-cloud-sdk/path.bash.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '~/google-cloud-sdk/completion.bash.inc' ]; then source '~/google-cloud-sdk/completion.bash.inc'; fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

