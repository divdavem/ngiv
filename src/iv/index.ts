/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 export {Template, IvGroup} from './interfaces';

// Naming scheme:
// - Capital letters are for crating things: T(ext), E(lement), C(omponent), D(irective)
// - lower case letters are for binding: p(roperty), a(ttribute), k(lass), s(tyle), i(nput)
// - lower case for closing: g(roupEnd), e(lementEnd)
// - Exception: Component input is `I` to not collide with directive `i`
export {
  textCreate as T,
  textCreateBound as t,
  
  elementCreate as E,
  elementProperty as p,
  elementAttribute as a,
  elementClass as k,
  elementStyle as s,
  elementEnd as e,

  groupCreate as G,
  groupEnd as g,

  componentCreate as C,
  componentInput as I,
  
  directiveCreate as D,
  directiveInput as i,

  render,
  createHostNode
} from './instructions';
