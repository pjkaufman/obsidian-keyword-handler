
/**
 * 
 * @param {string} rawKey 
 * @returns {RegExp}
 */
function getYamlSectionRegExp(rawKey) {
  return new RegExp(`^${rawKey}:[ \\t]*(\\S.*|(?:(?:\\n *- \\S.*)|((?:\\n *- *))*|(\\n([ \\t]+[^\\n]*))*)*)\\n`, 'm');
}

/**
 * 
 * @param {string} yaml 
 * @param {string} rawKey 
 * @returns {string | null}
 */
export function getYamlSectionValue(text, rawKey) {
  const match = text.match(getYamlSectionRegExp(rawKey));
  if (match == null) {
    return null;
  }

  return match[1];
}

/**
 * Parses single-line and multi-line arrays into an array that can be used for formatting down the line
 * @param {string} value The value to see about parsing if it is a sing-line or multi-line array
 * @return {string | string[]} The original value if it was not a single or multi-line array or the an array of the values from the array (multi-line arrays will have empty values removed)
 */
export function splitValueIfSingleOrMultilineArray(value) {
  if (value == null || value.length === 0) {
    return null;
  }

  value = value.trimEnd();
  if (value.startsWith('[')) {
    value = value.substring(1);

    if (value.endsWith(']')) {
      value = value.substring(0, value.length - 1);
    }

    // accounts for an empty single line array which can then be converted as needed later on
    if (value.length === 0) {
      return null;
    }

    const arrayItems = convertYAMLStringToArray(value);

    return arrayItems.filter((el) => {
      return el != '';
    });
  }

  if (value.includes('\n')) {
    let arrayItems = value.split(/[ \t]*\n[ \t]*-[ \t]*/);
    arrayItems.splice(0, 1);


    arrayItems = arrayItems.filter((el) => {
      return el != '';
    });

    if (arrayItems == null || arrayItems.length === 0 ) {
      return null;
    }

    return arrayItems;
  }

  return value;
}

/**
 * 
 * @param {string} value 
 * @returns {string[] | null}
 */
export function convertYAMLStringToArray(value) {
  if (value == '' || value == null) {
    return null;
  }

  const delimiter = ',';
  const arrayItems = [];
  let currentItem = '';
  let index = 0;
  while (index < value.length) {
    const currentChar = value.charAt(index);

    if (currentChar === delimiter) {
      // case where you find a delimiter
      arrayItems.push(currentItem.trim());
      currentItem = '';
    } else if (currentChar === '"' || currentChar === '\'') {
      // if there is an escape character check to see if there is a closing escape character and if so, skip to it as the next part of the value
      const endOfEscapedValue = value.indexOf(currentChar, index+1);
      if (endOfEscapedValue != -1) {
        currentItem += value.substring(index, endOfEscapedValue + 1);
        index = endOfEscapedValue;
      } else {
        currentItem += currentChar;
      }
    } else {
      currentItem += currentChar;
    }

    index++;
  }

  if (currentItem.trim() != '') {
    arrayItems.push(currentItem.trim());
  }

  return arrayItems;
}
