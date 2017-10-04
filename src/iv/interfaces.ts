/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 import { Injector, SimpleChanges } from '@angular/core';
 import { RElement, RText } from './renderer';

/**
 * Definition of what a template rendering function should look like.
 */
export interface Template<T> {
  (hostGroup: IvContainer, ctx: T, creationMode: boolean): void;
}

/**
 * ivNodes can be of these types.
 */
export const enum IvNodeKind {
  /**
   * This ivNode represents an actual Element.
   */
  Element = "E",

  /**
   * This ivNode represents an actual Text Node.
   */
  Text = "T",

  /**
   * This ivNode represents a virtual container for other Elements or Text nodes.
   */
  Group = "G"
}

/**
 * IvNode super type.
 */
export interface IvNode {
  /**
   * Discriminating kind for the IvNode
   */
  readonly kind: IvNodeKind;
}

/**
 * Abstract node which contains other nodes. 
 */
export interface IvContainer extends IvNode {
  /**
   * List of child IvNodes
   */
  children: IvNode[];

  /**
   * Parent container node.
   */
  parent: IvContainer|null;
}

export interface IvElement extends IvContainer {
  kind: IvNodeKind.Element;
  injector: Injector | null;
  component: DirectiveState|null;
  directives: DirectiveState[] | null;

  /**
   * Current values of the native Element properties used for CD.
   */
  value: {[key:string]: any}[];

  /**
   * A native Element representing the Element
   */
  readonly native: RElement;
}

export interface IvGroup extends IvContainer {
  kind: IvNodeKind.Group;
}

export interface IvText extends IvNode {
  kind: IvNodeKind.Text;
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
export interface DirectiveState {
  /**
   * Instance of Directive
   */
  instance: {},
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