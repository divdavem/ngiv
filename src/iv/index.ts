/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 export {Template, IvGroup} from './interfaces';

export {
  textCreate as tc,
  textCreateBound as tC,
  
  elementCreate as ec,
  elementProperty as ep,
  elementAttribute as ea,
  elementClass as eC,
  elementStyle as es,
  elementEnd as ee,

  groupCreate as gc,
  groupEnd as ge,

  componentCreate as cc,
  componentInput as ci,
  
  directiveCreate as dc,
  directiveInput as di,

  render,
  createHostNode
} from './instructions';
