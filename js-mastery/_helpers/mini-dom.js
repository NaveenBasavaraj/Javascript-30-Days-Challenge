'use strict';
/* ============================================================================
 * A small DOM, so topic 09 runs under plain `node` with no install.
 *
 * It implements the subset the exercises use, with the real semantics:
 * element creation, the tree, classes, attributes, text, querySelector
 * (tag / #id / .class / [attr] / descendant), and events with real
 * bubbling, capture, stopPropagation and preventDefault.
 *
 * It is NOT a browser. Layout, CSS and rendering do not exist here.
 * Everything you learn about the API still transfers.
 * ==========================================================================*/

class ClassList {
  constructor(el) { this.el = el; }

  get _set() {
    const raw = this.el.attributes.class || '';
    return raw.split(/\s+/).filter(Boolean);
  }

  _write(list) { this.el.attributes.class = list.join(' '); }

  add(...names) { const s = new Set(this._set); names.forEach((n) => s.add(n)); this._write([...s]); }

  remove(...names) { this._write(this._set.filter((n) => !names.includes(n))); }

  toggle(name, force) {
    const has = this.contains(name);
    const shouldHave = force === undefined ? !has : force;
    if (shouldHave) this.add(name); else this.remove(name);
    return shouldHave;
  }

  contains(name) { return this._set.includes(name); }

  get length() { return this._set.length; }

  toString() { return this._set.join(' '); }
}

class MiniEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.bubbles = options.bubbles !== false;
    this.cancelable = options.cancelable !== false;
    this.detail = options.detail;
    this.target = null;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this._stopped = false;
    this._stoppedImmediate = false;
  }

  stopPropagation() { this._stopped = true; }

  stopImmediatePropagation() { this._stopped = true; this._stoppedImmediate = true; }

  preventDefault() { if (this.cancelable) this.defaultPrevented = true; }
}

class MiniElement {
  constructor(tagName) {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.attributes = {};
    this._text = '';
    this._listeners = new Map();
    this.classList = new ClassList(this);
    this.dataset = {};
    this.value = '';
    this.checked = false;
    this.style = {};
  }

  get id() { return this.attributes.id || ''; }

  set id(v) { this.attributes.id = v; }

  get className() { return this.attributes.class || ''; }

  set className(v) { this.attributes.class = v; }

  get parentElement() { return this.parentNode; }

  get childElementCount() { return this.children.length; }

  get firstElementChild() { return this.children[0] ?? null; }

  get lastElementChild() { return this.children[this.children.length - 1] ?? null; }

  get nextElementSibling() {
    if (!this.parentNode) return null;
    const i = this.parentNode.children.indexOf(this);
    return this.parentNode.children[i + 1] ?? null;
  }

  get textContent() {
    if (this.children.length === 0) return this._text;
    return this.children.map((c) => c.textContent).join('');
  }

  set textContent(v) { this._text = String(v); this.children.forEach((c) => { c.parentNode = null; }); this.children = []; }

  appendChild(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.push(child);
    this._text = '';
    return child;
  }

  append(...nodes) { nodes.forEach((n) => this.appendChild(n)); }

  prepend(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.unshift(child);
    return child;
  }

  insertBefore(child, reference) {
    const i = reference ? this.children.indexOf(reference) : this.children.length;
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.splice(i === -1 ? this.children.length : i, 0, child);
    return child;
  }

  removeChild(child) {
    const i = this.children.indexOf(child);
    if (i !== -1) { this.children.splice(i, 1); child.parentNode = null; }
    return child;
  }

  remove() { if (this.parentNode) this.parentNode.removeChild(this); }

  replaceChild(newChild, oldChild) {
    const i = this.children.indexOf(oldChild);
    if (i === -1) return oldChild;
    if (newChild.parentNode) newChild.parentNode.removeChild(newChild);
    newChild.parentNode = this;
    this.children[i] = newChild;
    oldChild.parentNode = null;
    return oldChild;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name.startsWith('data-')) {
      const key = name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      this.dataset[key] = String(value);
    }
  }

  getAttribute(name) { return name in this.attributes ? this.attributes[name] : null; }

  hasAttribute(name) { return name in this.attributes; }

  removeAttribute(name) { delete this.attributes[name]; }

  /* --- selectors -------------------------------------------------------- */
  _matchesSimple(sel) {
    if (sel === '*') return true;
    if (sel.startsWith('#')) return this.id === sel.slice(1);
    if (sel.startsWith('.')) return this.classList.contains(sel.slice(1));
    if (sel.startsWith('[')) {
      const body = sel.slice(1, -1);
      if (body.includes('=')) {
        const [name, raw] = body.split('=');
        return this.getAttribute(name) === raw.replace(/^["']|["']$/g, '');
      }
      return this.hasAttribute(body);
    }
    return this.tagName === sel.toUpperCase();
  }

  matches(selector) {
    return selector.split(',').map((s) => s.trim()).some((group) => {
      const parts = group.split(/\s+/);
      if (!this._matchesSimple(parts[parts.length - 1])) return false;
      let node = this.parentNode;
      for (let i = parts.length - 2; i >= 0; i--) {
        while (node && !node._matchesSimple(parts[i])) node = node.parentNode;
        if (!node) return false;
        node = node.parentNode;
      }
      return true;
    });
  }

  _descendants() {
    const out = [];
    const walk = (node) => node.children.forEach((c) => { out.push(c); walk(c); });
    walk(this);
    return out;
  }

  querySelectorAll(selector) { return this._descendants().filter((el) => el.matches(selector)); }

  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }

  closest(selector) {
    let node = this;
    while (node) { if (node.matches && node.matches(selector)) return node; node = node.parentNode; }
    return null;
  }

  /* --- events ----------------------------------------------------------- */
  addEventListener(type, fn, options = {}) {
    const capture = options === true || options.capture === true;
    const key = `${type}:${capture ? 'capture' : 'bubble'}`;
    if (!this._listeners.has(key)) this._listeners.set(key, []);
    const list = this._listeners.get(key);
    // The real DOM ignores an identical (type, fn, capture) registration.
    if (list.some((l) => l.fn === fn)) return;
    list.push({ fn, once: options.once === true });
  }

  removeEventListener(type, fn, options = {}) {
    const capture = options === true || options.capture === true;
    const key = `${type}:${capture ? 'capture' : 'bubble'}`;
    const list = this._listeners.get(key);
    if (!list) return;
    const i = list.findIndex((l) => l.fn === fn);
    if (i !== -1) list.splice(i, 1);
  }

  _fire(event, phase) {
    const key = `${event.type}:${phase}`;
    const list = this._listeners.get(key);
    if (!list || list.length === 0) return;
    event.currentTarget = this;
    for (const listener of [...list]) {
      if (event._stoppedImmediate) return;
      if (listener.once) this.removeEventListener(event.type, listener.fn, phase === 'capture');
      listener.fn.call(this, event);
    }
  }

  dispatchEvent(event) {
    event.target = this;
    const path = [];
    let node = this.parentNode;
    while (node) { path.push(node); node = node.parentNode; }

    for (let i = path.length - 1; i >= 0; i--) {
      if (event._stopped) break;
      path[i]._fire(event, 'capture');
    }
    if (!event._stopped) this._fire(event, 'capture');
    if (!event._stopped) this._fire(event, 'bubble');
    if (event.bubbles) {
      for (const ancestor of path) {
        if (event._stopped) break;
        ancestor._fire(event, 'bubble');
      }
    }
    return !event.defaultPrevented;
  }

  click() { return this.dispatchEvent(new MiniEvent('click')); }

  /* --- a readable snapshot, for assertions ------------------------------ */
  toHtml() {
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => ` ${k}="${v}"`).join('');
    const tag = this.tagName.toLowerCase();
    const inner = this.children.length
      ? this.children.map((c) => c.toHtml()).join('')
      : this._text;
    return `<${tag}${attrs}>${inner}</${tag}>`;
  }
}

class MiniDocument extends MiniElement {
  constructor() {
    super('document');
    this.body = new MiniElement('body');
    this.appendChild(this.body);
  }

  createElement(tag) { return new MiniElement(tag); }

  getElementById(id) { return this.querySelector(`#${id}`); }

  getElementsByClassName(name) { return this.querySelectorAll(`.${name}`); }

  getElementsByTagName(tag) { return this.querySelectorAll(tag); }
}

/** Builds a fresh document for each exercise. */
function createDocument() { return new MiniDocument(); }

/** Convenience: build a tree from a nested description. */
function build(doc, spec) {
  const el = doc.createElement(spec.tag);
  if (spec.id) el.id = spec.id;
  if (spec.class) el.className = spec.class;
  if (spec.text) el.textContent = spec.text;
  if (spec.attrs) Object.entries(spec.attrs).forEach(([k, v]) => el.setAttribute(k, v));
  (spec.children || []).forEach((child) => el.appendChild(build(doc, child)));
  return el;
}

module.exports = { createDocument, build, MiniElement, MiniEvent, ClassList };
