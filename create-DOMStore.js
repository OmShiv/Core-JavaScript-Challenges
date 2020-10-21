/**
 * Create a DOM Store where you could save the DOM Nodes as keys, and any value as value. Of course, without using ES6 Map.
 * Basically, the question is to build a Map polyfill with only said methods as follows.
 */
const btn = document.querySelector('#count-clicks');
const someOtherBtn = document.querySelector('#abc');

const DS = new DOMStore();
DS.set(btn, { abc: 123 });
DS.has(btn) // true
DS.has(someOtherBtn) // false
DS.get(btn) // { abc: 123 }

/**
 * Usage example: counting clicks
 */

DS.set(btn, 0);
btn.addEventListener('click', function() {
  let clickCount = DS.get(btn);
  DS.set(btn, clickCount + 1);
})

btn.click();
btn.click();
... 100 times;

DS.get(btn); // 100

/**
 * SOLUTION
 */

function DOMStore() {
  this._keys = [];
  this._values = [];
}

// Worst-case runtime: O(n)
DOMStore.prototype.has = function(node) {
  return this._keys.includes(node);
}

// Worst-case runtime: O(2 * n) = O(n)
DOMStore.prototype.get = function(node) {
  return this.has(node) ? this._values[this._keys.indexOf(node)] : undefined;
}

// Worst-case runtime: O(n)
DOMStore.prototype.set = function(node, val) {
  let position = this._keys.indexOf(node);
  if (position === -1) {
    this._keys.push(node);
    position = this._keys.length - 1;
  } 
  this._values[position] = val;
}
