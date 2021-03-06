/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 import { Injector, SimpleChanges } from '@angular/core';
 import { RElement, RText, RNode } from './renderer';

/**
 * Definition of what a template rendering function should look like.
 */
export type Template<T> = (ctx: T, creationMode: boolean, ignore?: any) => void;

/**
 * IvNode super type.
 */
export interface IvNode {
  /**
   * Parent container node.
   */
  readonly parent: IvNode|null;

  /**
   * A native Node.
   */
  readonly native: RNode | null;
  
  /**
   * Next sibling node.
   */
  next: IvNode|null;
  
  /**
   * List of child IvNodes
   */
  child: IvNode|null;
}

/**
 * Abstract node which contains other nodes. 
 */
export interface IvGroup extends IvNode {
  readonly native:null;
}

export interface IvElement extends IvNode {
  injector: Injector | null;
  component: DirectiveState<any>|null;
  directives: DirectiveState<any>[] | null;

  /**
   * Current values of the native Element properties used for CD.
   */
  value: any[];

  /**
   * A native Element representing the Element
   */
  readonly native: RElement;
}

export interface IvText extends IvNode {
  child: null;
  /**
   * Current value of the text node used for CD.
   */
  value: string;
  /**
   * A native Element representing the Element
   */
  readonly native: RText;
}

/**
 * Information which we need to keep about directive (or Component)
 */
export interface DirectiveState<T> {
  /**
   * Instance of Directive
   */
  instance: T,
  /**
   * Current values of the directive inputs used for CD.
   */
  inputs: any[],

  /**
   * If the directive implements `ngOnChanges` than this contains the 
   * SimpleChanges object which will be delivered after CDing all of the
   * inputs.
   */
  changes: SimpleChanges|null
}