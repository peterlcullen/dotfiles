#!/usr/bin/env bash

# thanks to https://github.com/mathiasbynens/dotfiles

cd "$(dirname "${BASH_SOURCE}")";

function doIt() {
	rsync --exclude ".git/" --exclude ".gitignore" --exclude ".DS_Store" --exclude "bootstrap.sh" \
		--exclude "README.md" --exclude "LICENSE-MIT.txt" --exclude "themes/" -avh --no-perms . ~;
	source ~/.bash_profile;
}

function installVundle() {
	# install if it doesn't already exist
	if [ ! -d "${HOME}/.vim/bundle/Vundle.vim" ]; then
		echo "";
		echo -n "installing vundle ...";
		mkdir -p ~/.vim/bundle > /dev/null 2>&1;
		git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim > /dev/null 2>&1;
		echo " done";
	fi
}

if [ "$1" == "--force" -o "$1" == "-f" ]; then
	doIt;
	installVundle;
else
	read -p "This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1;
	echo "";
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		doIt;
		installVundle;
	fi;
fi;
unset doIt;
unset installVundle;
