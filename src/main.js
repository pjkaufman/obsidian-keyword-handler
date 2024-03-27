import {Plugin, TFile, normalizePath} from 'obsidian';
import {splitValueIfSingleOrMultilineArray, getYamlSectionValue} from './yaml';

/** @type {string} */
const keywordSourceKey = 'keyword_name';
/** @type {string} */
const destinationKey = 'keyword';

// based on https://davidwells.io/snippets/regex-match-markdown-links
export const genericLinkRegex = /\[([^[]*)\]\((.*\.md).*\)/g;

/**
 * @type {import("obsidian").Plugin}
 */
export default class KeywordHandler extends Plugin {

	async onload() {
		await this.loadSettings();

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'add-keywords-to-yaml',
			name: 'Add Keywords to YAML',
      icon: 'links-going-out',
      /**
       * @param {import("obsidian").Editor} editor
       */
			editorCallback: (editor) => {
				this.getKeywordsValues(editor);
			}
		});
	}

	onunload() {}
	async loadSettings() {}
	async saveSettings() {}

  /**
   * @param {import("obsidian").Editor} editor the current codemirror editor 
   */
  getKeywordsValues(editor) {
    let text = editor.getValue();


    // getYamlSectionRegExp
    const regexMatches = [...text.matchAll(genericLinkRegex)];

    let keywords = splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, keywordSourceKey)) ?? [];
    if (typeof keywords === 'string') {
      keywords = [keywords];
    }

    if (regexMatches) {
      /**
       * @type {number}
       */
      for (const index in regexMatches) {
        const file = this.getFileFromPath(regexMatches[index][2]);
        if (!file) {
          continue;
        }

        const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
        if (!frontmatter) {
          continue;
        }

        const keyword = frontmatter[keywordSourceKey] ?? '';
        if (!keyword) {
          continue;
        }

        keywords.push(keyword);
      }
    }
    
    console.log(keywords);
    // TODO: handle the checks for the keyword already existing

    // TODO: save the keywords to the frontmatter
  }

  /**
   * Takes the file path and gets the TFile for it if it exists.
   * @param {string} filePath 
   * @returns {import("obsidian").TFile | null}
   */
  getFileFromPath(filePath) {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(filePath));
    if (file instanceof TFile) {
      return file;
    }

    return null;
  }

  // /**
  //  * Gets the current markdown editor if it exists {@link https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/main.ts#L37-L41|Obsidian Smarter Paste Source}
  //  * @return {import("obsidian").Editor | null} Returns the current codemirror editor if there is an active view of type markdown or null if there is not one.
  //  */
  // getEditor() {
  //   const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
  //   if (!activeLeaf) return null;
  //   return activeLeaf.editor;
  // }
}
