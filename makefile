install:
	npm run compile
	vsce package
	code --extensions-dir ~/code_profiles/c/exts --install-extension kokonoepc-0.0.1.vsix