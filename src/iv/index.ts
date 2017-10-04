/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 export {Template, IvGroup, IvContainer} from './interfaces';

export {
  textCreate as tc,
  textCreateBound as tC,
  
  elementCreate as ec,
  elementProperty as ep,
  elementAttribute as ea,

  groupCreate as gc,
  groupRefresh as gr,

  componentCreate as cc,
  componentRefresh as cr,
  componentInput as ci,
  componentInputWithOnChanges as cI,
  
  directiveCreate as dc,
  directiveInput as di,
  directiveInputWithOnChanges as dI,
  
} from './instructions';
