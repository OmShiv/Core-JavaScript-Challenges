/**
 * Question: Build a absic event emitter with following usage:
 *   
 *   Should be able to subscribe and add events –
 *   const emitter = new Emitter();
 *   const sub1 = emitter.subscribe('event_name', callback1);
 *   const sub1 = emitter.subscribe('event_name', callback2);
 *   ...
 *   emitter.emit('event_name', a, b); // should run all subscribed callbacks on `event_name` with params a and b.
 *   ...
 *   sub1.release(); // should release exactly the same callback. 
 */

function Emitter() {
  this._store = {};
}

Emitter.prototype.subscribe = function(evtName, callback) {
  if (!this._store[evtName]) {
    this._store[evtName] = new Set(); // **** Important ***
    // use a Set so same handler is not subscribed twice. Use an Array if you instead want multiple subscriptions. 
    // If using an Array, the callbacks have to be set as `null` after releasing and should have a cleanup so the array size doesn’t go on increasing.
  }
  this._store[evtName].add(callback);

  return {
    // IIFE with a closure return (for closing over the context at the time of creation).
    release: (function(ctx, name, cb) {
      return function() {
        // If removing all subscriptions, use `delete this._store[evtName];`
        ctx._store[name].delete(cb);
      }
    }(this, evtName, callback)),
  }
}

Emitter.prototype.emit = function(evtName, ...args) {
  const subscriptions = this._store[evtName];
  if (subscriptions) {
    for (sub of subscriptions) {
      sub.apply(this, args);
    }
  }
}

/**
 * Usage
 */
const emitter = new Emitter();
const add = function(a, b) { console.log(a + b) };
const subtract = function(a, b) { console.log(a - b) };
const multiply = function(a, b) { console.log(a * b) };

// Event sub1 - 2 subscriptions
const sub1 = emitter.subscribe('event_1', add);
const sub2 = emitter.subscribe('event_1', subtract);

// Event sub2 - 1 subscription, multiply
const sub3 = emitter.subscribe('event_2', multiply);

emitter.emit('event_1', 3, 2); // both sub1 and sub2 should run
// 5
// 1

emitter.emit('event_2', 3, 2);
// 6

sub1.release();
emitter.emit('event_1', 3, 2); // sub2 should still run handler
// 1

emitter.emit('event_2', 3, 2); // sub3 no change
// 6
