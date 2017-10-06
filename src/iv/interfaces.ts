/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Injector, SimpleChanges, Type, TemplateRef, ViewContainerRef, ElementRef } from '@angular/core';
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
  readonly parent: IvNode | null;

  /**
   * A native Node.
   */
  readonly native: RElement | RText | 'ViewContainer' | 'View';

  /**
   * Next sibling node.
   */
  next: IvNode | null;

  /**
   * List of child IvNodes
   */
  child: IvNode | null;

  /**
   * Contains information on Directive DI.
   */
  di: IvInjector | null;

  /**
   * Component information if present.
   */
  component: DirectiveState<any> | null;

  /**
   * Directive information if present.
   */
  directives: DirectiveState<any>[] | null;
}

/**
 * `IvHostElement` is a sepecial node which is used for 
 * bootstraping the template system. 
 * 
 * You can tell that a `IvNode` is `IvHostElement` because its `parent` is null.
 */
export interface IvHostElement extends IvNode {

  /**
   * A native Element representing the Element
   */
  readonly native: RElement;

  readonly parent: null;

  component: null;

  directives: null;

  di: null;

  next: null;
}

/**
 * IvNode represnting an Element.
 * 
 * You can tell that a `IvNode` is `IvElement` or `IvText` because its `native` is not a string.
 */
export interface IvElement extends IvNode {
  /**
   * IvElement nodes can be inside other IvElement nodes or inside IvView.
   */
  readonly parent: IvElement | IvView | IvHostElement;

  next: IvElement | IvText | IvViewContainer | null;
  
  /**
   * Current values of the native Element properties used for CD.
   */
  value: any[] | null;

  /**
   * A native Element representing the Element
   */
  readonly native: RElement;
}

/**
 * IvNode representing a #text node.
 * 
 * You can tell that a `IvNode` is `IvElement` or `IvText` because its `native` is not a string.
 */
export interface IvText extends IvNode {
  child: null;
  next: IvElement | IvText | IvViewContainer | IvHostElement | null;

  /**
   * Current value of the text node used for CD.
   */
  value: string | null;

  /**
   * A native Element representing the Element
   */
  readonly native: RText;

  /**
   * IvText nodes can be inside other IvElement nodes or inside IvView.
   */
  readonly parent: IvElement | IvView;

  /**
   * There are no Components on text nodes.
   */
  component: null;

  /**
   * There are no Directives on text nodes.
   */
  directives: null;
}

/**
 * Abstract node which contains root nodes of a view. IvView nodes 
 * can only be added to IvViewContainers.
 * 
 * You can tell that a `IvNode` is `IvView` because its `native` is set to `"View"`.
 */
export interface IvView extends IvNode {
  readonly native: 'View';
  parent: IvViewContainer | null;
  next: IvView | null;  

  /**
   * There are no Components on text nodes.
   */
  component: null;

  /**
   * There are no Directives on text nodes.
   */
  directives: null;

  child: IvElement | IvText | IvViewContainer | null;
}

/**
 * Abstract node which contains other Views.
 *  
 * You can tell that a `IvNode` is `IvView` because its `native` is set to `"ViewContainer"`.
 */
export interface IvViewContainer extends IvNode {
  readonly native: 'ViewContainer';
  readonly parent: IvElement | IvView | IvHostElement | null;
  component: null;
  child: IvView | null;
}


/**
 * Information which we need to keep about directive (or Component)
 */
export interface DirectiveState<T> {
  /**
   * Directive Type
   */
  type: Type<T>,

  /**
   * Instance of Directive
   */
  instance: T,
  /**
   * Current values of the directive inputs used for CD.
   */
  inputs: any[] | null,

  /**
   * If the directive implements `ngOnChanges` than this contains the 
   * SimpleChanges object which will be delivered after CDing all of the
   * inputs.
   */
  changes: SimpleChanges | null
}

export interface IvInjector {
  injector: Injector | null;
  templateRef: TemplateRef<any> | null;
  viewContainerRef: ViewContainerRef | null;
  elementRef: ElementRef | null;
}