import assert from 'node:assert/strict';
import {arcPosition,isSwipe} from '../dist/mobile-fan.js';
assert.equal(isSwipe(9,0),false);assert.equal(isSwipe(11,0),true);assert.equal(isSwipe(8,8),true);assert.equal(isSwipe(0,20),true);
for(const center of [0,12.25,38.5,77]){const visible=Array.from({length:78},(_,i)=>arcPosition(i,center)).filter(x=>x.visible);assert(visible.length>=7&&visible.length<=15);assert(visible.every(x=>Math.abs(x.angle)<78));}
const before=arcPosition(39,38.5),after=arcPosition(39,38.6);assert(Math.abs(after.angle-before.angle+1.1)<1e-8);assert(arcPosition(0,0).visible);assert(arcPosition(77,77).visible);
console.log('PASS: tap/swipe threshold, diagonal movement, continuous arc and both deck ends');
