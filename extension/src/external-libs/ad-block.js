class AdBlock {
  constructor(options = {}) {
    if (typeof options !== 'object') throw new Error('options has to be an object');

    this.rawRules = [];
    this.rules = [];
  }

  parse(rule) {
    return this.add(rule);
  }

  add(rule) {
    this.rawRules.push(rule);

    const trimmedRule = rule.trim();
    const cleanRule = trimmedRule.replace(/[\r\n]/g, ''); // replace all new-lines

    // ignore rules that are too short
    if (cleanRule.length <= 3) return;

    if (cleanRule[0] === '!') {
      // comment, ignore
      return;
    }

    const r = {
      hasStart: false,
      hasEnd: false,
      rule: cleanRule,
      text: cleanRule,
    };

    if (cleanRule.indexOf('##') >= 0) {
      // element hide rule, not supported
      return;
    }

    if (cleanRule.indexOf('@@') === 0) {
      // exception, not supported
      return;
    }

    if (cleanRule[0] === '|' && cleanRule[1] === '|') {
      // domain
      r.domain = true;
      const text = cleanRule.slice(2);

      // normalize rule
      r.text = this.normalizeDomain(text);
    } else if (cleanRule[0] === '|') {
      // start
      r.hasStart = true;
      r.text = cleanRule.slice(1);
    } else if (cleanRule[cleanRule.length - 1] === '|') {
      // end
      r.hasEnd = true;
      r.text = cleanRule.slice(0, -1);
    }

    // options are not supported atm, so parse them away
    const lastDollarIndex = r.text.lastIndexOf('$');
    if (lastDollarIndex >= 0) {
      r.text = r.text.slice(0, lastDollarIndex);
      return;
    }

    // regex not supported, so ignore them
    if (r.text[0] === '/' && r.text[r.text.length - 1] === '/') {
      return;
    }

    // ignore patterns that are too short
    if (r.text.length <= 3) return;

    const chunks = r.text.split(/\*+/).filter((i) => i);

    r.items = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const seps = chunk.split('^');
      if (seps.length > 0) {
        for (let i = 0; i < seps.length; i++) {
          const t = seps[i];
          if (t === '') continue;
          const last = seps[i - 1];
          const next = seps[i + 1];

          r.items.push({
            text: t,
            before: last !== undefined,
            after: next !== undefined,
          });
        }
      } else {
        r.items.push({
          text: chunk,
          before: false,
          after: false,
        });
      }
    }

    this.rules.push(r);
  }

  matches(url) {
    const cache = {};
    for (let i = 0; i < this.rules.length; i++) {
      const r = this.rules[i];
      const matches = this.testRuleObject(r, url, cache);
      if (matches) return true;
    }

    return false;
  }

  testRuleObject(r, url, cache) {
    const items = r.items;

    if (r.domain) {
      this.debugLog(' === domain === ');

      let processedUrl = url;
      if (cache.domainUrl) {
        processedUrl = cache.domainUrl;
      } else {
        processedUrl = this.normalizeDomain(url);
        cache.domainUrl = processedUrl;
      }

      this.debugLog(`rule: ${r.rule}`);
      this.debugLog(`url: ${processedUrl}`);

      let position = -1;
      for (let i = 0; i < items.length; i++) {
        console.log('ITEM', items);
        const item = items[i];

        const indexOf = processedUrl.indexOf(item.text, position + 1);
        if (indexOf <= position) return false;
        position = indexOf;

        this.debugLog(`text: ${item.text}`);
        this.debugLog(`position: ${position}`);

        if (r.hasStart && i === 0) {
          if (indexOf !== 0) return false;
        }

        if (r.hasEnd && i === items.length - 1) {
          const len = processedUrl.length - item.text.length;
          if (indexOf !== len) return false;
        }

        if (item.before) {
          this.debugLog(`before: ${processedUrl[position - 1]}`);
          if (!this.isSeparator(processedUrl[position - 1])) return false;
        }

        if (item.after) {
          const n = position + item.text.length;
          this.debugLog(`after: ${processedUrl[n]}`);
          if (
            processedUrl[n] !== undefined && // EOL OK
            !this.isSeparator(processedUrl[n])
          )
            return false;
        }
      }

      this.debugLog(`passed rule: ${r.rule}`);

      // all chunks done and everything OK
      return true;
    }

    this.debugLog(`rule: ${r.rule}`);
    this.debugLog(`url: ${url}`);

    let position = -1;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) return false;
      console.log('ITEM', item);

      try {
        const indexOf = url.indexOf(item.text, position + 1);
        if (indexOf <= position) return false;
        position = indexOf;
      } catch (e) {
        return false;
      }

      this.debugLog(`text: ${item.text}`);
      this.debugLog(`position: ${position}`);

      if (r.hasStart && i === 0) {
        if (indexOf !== 0) return false;
      }

      if (r.hasEnd && i === items.length - 1) {
        const len = url.length - item.text.length;
        if (indexOf !== len) return false;
      }

      if (item.before) {
        this.debugLog(`before: ${url[position - 1]}`);
        if (!this.isSeparator(url[position - 1])) return false;
      }

      if (item.after) {
        const n = position + item.text.length;
        this.debugLog(`after: ${url[n]}`);
        if (
          url[n] !== undefined && // EOL OK
          !this.isSeparator(url[n])
        )
          return false;
      }
    }

    this.debugLog(`passed rule: ${r.rule}`);

    // all chunks done and everything OK
    return true;
  }

  iterativeIndexOf(text, pattern) {
    const results = [];
    let matchIndex = text.indexOf(pattern);
    while (matchIndex !== -1) {
      results.push(matchIndex);
      matchIndex = text.indexOf(pattern, matchIndex + 1);
    }
    return results;
  }

  debugLog(...args) {
    return;
    // if (false) return;
    // console.log.apply(this, args);
  }

  // parse easylist rules
  // ref: https://help.eyeo.com/en/adblockplus/how-to-write-filters#introduction
  testRuleText(rule, url) {
    if (rule[0] === '!') {
      // comment
      return false;
    }

    let hasStart = false;
    let hasEnd = false;
    let processedRule = rule;
    let processedUrl = url;

    if (processedRule.indexOf('@@') === 0) {
      // exception rule
      processedRule = processedRule.slice(2);
      // TODO
    } else if (processedRule[0] === '|' && processedRule[1] === '|') {
      // domain name
      processedRule = processedRule.slice(2);

      // normalize rule
      if (processedRule.indexOf('https://') === 0) {
        processedRule = processedRule.slice('https://');
      }
      if (processedRule.indexOf('http://') === 0) {
        processedRule = processedRule.slice('http://');
      }
      if (processedRule.indexOf('www.') === 0) {
        processedRule = processedRule.slice('www.');
      }

      // normalize url
      if (processedUrl.indexOf('https://') === 0) {
        processedUrl = processedUrl.slice('https://');
      }
      if (processedUrl.indexOf('http://') === 0) {
        processedUrl = processedUrl.slice('http://');
      }
      if (processedUrl.indexOf('www.') === 0) {
        processedUrl = processedUrl.slice('www.');
      }
    } else if (processedRule[0] === '|') {
      // beginning
      hasStart = true;
      processedRule = processedRule.slice(1);
    } else if (processedRule[processedRule.length - 1] === '|') {
      // end
      hasEnd = true;
      processedRule = processedRule.slice(0, -1);
    }

    this.debugLog(`hasStart: ${hasStart}`);
    this.debugLog(`hasEnd: ${hasEnd}`);

    // basic rule
    if (!hasStart && processedRule[0] !== '*') {
      processedRule = `*${processedRule}`;
    }
    if (!hasEnd && processedRule[processedRule.length - 1] !== '*') {
      processedRule = `${processedRule}*`;
    }

    this.debugLog(`rule: ${processedRule}`);

    const chunks = processedRule.split(/\*+/).filter((i) => i);

    let lastIndexOf = 0;
    chunk_loop: for (let i = 0; i < chunks.length; i++) {
      this.debugLog(`lastIndexOf: ${lastIndexOf}`);

      const chunk = chunks[i];
      if (chunk === '') continue;
      this.debugLog(`chunk: ${chunk}`);

      // used to decrease final length by 1
      // when separator ( ^ ) matches EOL
      let hasEOL = false;

      let matching = false;
      url_loop: for (let j = 0; j < url.length; j++) {
        matching = false;

        for (let k = 0; k < chunk.length; k++) {
          const c = chunk[k];
          let u = url[j + k];

          // handle EOL
          if (j + k === url.length) {
            hasEOL = true;
            u = '\n';
          }

          if (!u) return false; // out of scope

          if (this.ruleCharMathes(c, u)) {
            this.debugLog(`matches: ${c}`);
            matching = true;
          } else {
            hasEOL = false;
            matching = false;
            this.debugLog(`nomatch: ${c}`);
            continue url_loop;
          }
        }

        if (!matching) return false;

        this.debugLog(' matching done.');

        // matches
        const indexOf = j;
        this.debugLog(`indexOf: ${indexOf}`);
        this.debugLog(`lastIndexOf: ${lastIndexOf}`);

        if (indexOf < lastIndexOf) return false;
        lastIndexOf = indexOf;

        const firstChunk = i === 0;
        const lastChunk = i === chunks.length - 1;

        if (hasStart && firstChunk) {
          if (indexOf !== 0) return false;
        }

        if (hasEnd && lastChunk) {
          let extra = 0;
          if (hasEOL) extra = 1;
          if (indexOf !== url.length - chunk.length + extra) return false;
        }

        continue chunk_loop;
      }

      if (!matching) return false;
    }

    // all chunks done and everything OK
    return true;
  }

  successiveMatches(matches, text) {
    let n = 0;
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const indexOf = text.indexOf(match, n);
      if (indexOf < 0) return false;
      n = indexOf;
    }
    return true;
  }

  isSeparator(a) {
    return a === '/' || a === ':' || a === '?' || a === '=' || a === '&';
  }

  ruleCharMathes(a, b) {
    if (a === '^') {
      return b === '/' || b === ':' || b === '?' || b === '=' || b === '&' || b === '\n';
    }
    return a === b;
  }

  normalizeDomain(text) {
    let normalizedText = text;
    if (normalizedText.indexOf('https://') === 0) {
      normalizedText = normalizedText.slice('https://'.length);
    }
    if (normalizedText.indexOf('http://') === 0) {
      normalizedText = normalizedText.slice('http://'.length);
    }
    if (normalizedText.indexOf('www.') === 0) {
      normalizedText = normalizedText.slice('www.'.length);
    }
    return normalizedText;
  }
}
