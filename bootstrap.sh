#!/usr/bin/env bash

# thanks to https://github.com/mathiasbynens/dotfiles

cd "$(dirname "${BASH_SOURCE}")";

function doIt() {
	rsync --exclude ".git/" --exclude ".gitignore" --exclude ".DS_Store" --exclude "bootstrap.sh" \
		--exclude "README.md" --exclude "LICENSE-MIT.txt" --exclude "themes/" -avh --no-perms . ~;
	source ~/.bash_profile;
}

if [ "$1" == "--force" -o "$1" == "-f" ]; then
	doIt;
else
	read -p "This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1;
	echo "";
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		doIt;
	fi;
fi;
unset doIt;