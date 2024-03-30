import {Plugin, TFile, normalizePath, getFrontMatterInfo, getLinkpath} from 'obsidian';
import {splitValueIfSingleOrMultilineArray, getYamlSectionValue} from './yaml';

/** @type {string} */
const keywordSourceKey = 'keyword';
/** @type {string} */
const destinationKey = 'keywords';

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
       * @param {import("obsidian").Editor} editor The current codemirror editor
       * @param {import("obsidian").MarkdownView | import("obsidian").MarkdownFileInfo } ctx The current file as a MarkdownView or a MarkdownFileInfo
       */
      editorCallback: (editor, ctx) => {
        this.getKeywordsValues(editor, ctx.file);
      },
    });
  }

  onunload() {}
  async loadSettings() {}
  async saveSettings() {}

  /**
   * @param {import("obsidian").Editor} editor The current codemirror editor
   * @param {import("obsidian").TFile | null} currentFile The current file
   */
  getKeywordsValues(editor, currentFile) {
    if (!currentFile) {
      return;
    }

    const text = editor.getValue();

    const originalKeywordText = getYamlSectionValue(text, destinationKey);
    let keywords = splitValueIfSingleOrMultilineArray(originalKeywordText) ?? [];
    const originalKeywords = keywords.slice();
    if (typeof keywords === 'string') {
      keywords = [keywords];
    }

    const links = this.app.metadataCache.getFileCache(currentFile)?.links;
    if (!links) {
      return;
    }

    for (const link of links) {
      const file = this.app.metadataCache.getFirstLinkpathDest(link.link, currentFile.path);
      if (!file) {
        continue;
      }

      const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!frontmatter) {
        continue;
      }

      /** @type {string} */
      let keyword = frontmatter[keywordSourceKey] ?? '';
      if (!keyword) {
        continue;
      }

      // escape strings that have commas in them
      if (keyword.includes(',')) {
        keyword = '"' + keyword + '"';
      }

      if (keywords.includes(keyword)) {
        continue;
      }

      keywords.push(keyword);
    }

    if (keywords == originalKeywords) {
      return;
    }

    const keywordsValue = '[' + keywords.join(', ') + ']';

    /** @type {import("obsidian").FrontMatterInfo} */
    const frontmatterInfo = getFrontMatterInfo(text);
    if (!frontmatterInfo.exists) {
      editor.replaceRange(`---\n${destinationKey}: ${keywordsValue}\n---\n`, {line: 0, ch: 0});

      return;
    }

    let yaml = frontmatterInfo.frontmatter;

    // no current key
    if (originalKeywordText === null) {
      yaml += `${destinationKey}: ${keywordsValue}\n`;
    } else if (originalKeywordText.trim() != '') {
      yaml = yaml.replace(originalKeywordText, keywordsValue);
    } else {
      yaml = yaml.replace(`${destinationKey}: `, `${destinationKey}: ${keywordsValue}`);
    }

    editor.replaceRange(yaml, editor.offsetToPos(frontmatterInfo.from), editor.offsetToPos(frontmatterInfo.to));
  }
}
