# Obsidian Keyword Handler

This plugin is a pretty basic keyword handler for my own personal needs to automate a task that I do manually to save me some time. If it is useful for you, feel free to go ahead and use it.

## How it works

The plugin adds a command on load called `Add Keywords to YAML`. This command is an editor command. It does the following:
- Gets the text for the current editor
- Gets the current `keywords` value from the frontmatter if there is one
- Gets all markdown links in the current file from the cached metadata
- Gets the file and then the file metadata cache to check for the `keyword` key's value in the referenced file
- If the keyword has any spaces in it, it has double quotes used to escape the value
- If the keyword does not already exist in the list, it gets added
- Adds the keywords to the frontmatter if the value has changed

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js` and `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.
