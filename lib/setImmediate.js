
module.exports = (typeof setImmediate === 'function') 
  ? setImmediate 
  : (fn) => { setTimeout(fn, 0); }
;
