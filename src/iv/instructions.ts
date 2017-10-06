/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Injector, Type, SimpleChanges } from '@angular/core';
import { IvText, IvElement, IvView, IvViewContainer, IvNode, IvHostElement, Template, DirectiveState, IvInjector } from './interfaces';
import { Renderer3, RElement, RText, RNode } from './renderer';
import { instantiateDirective } from './di';

const VIEW_CONTAINER = 'ViewContainer';
const VIEW = 'View';

/**
 * This property gets set before entering a template.
 */
let creationMode: boolean = true;

/**
 * This property gets set before entering a template.
 */
let renderer: Renderer3;

/**
 * Current location in the ivNode tree.
 */
let cursor: IvNode;

/**
 * `cursor` points to the current element. However when a new element is created
 * the first element is differently than the next element. First one has parent
 * point to it the next one has previous sibling point to it.
 * 
 *       #textD           #textC
 *         ^                ^
 *         |                |
 *      <span> -> #textA -> <b> -> #textB
 *         ^
 *         |
 *       <div>
 * 
 * Imagine cursor points to `div`, then `cursorIsParent` is true since insertion
 * of `span` happens as a pointer from `div` to `span`. Where as insertion of 
 * `#textA` happens as a pointer from `span` to `#textA`. We use `cursorIsParent`
 * to denote if the `cursor` is point to parent or to previous node.
 * 
 * 
 * - true: `cursor` is pointing to the parent node.
 * - false: `cursor` is pointing to previous sibling node.
 */
let cursorIsParent: boolean = false;

/**
 * Patch the Node so that it complies with our Renderer.
 */
typeof Node !== 'undefined' && (Node.prototype.setProperty = function (this: Node, name: string, value: any): void {
  (this as any)[name] = value;
});

/**
 * A Common way of creating the IvNode to make sure that all of them have same shape to
 * keep the execution code monomorphic and fast.
 */
function createNode(native: RText, isTextNode: true): IvText
function createNode(native: RElement, isTextNode: false): IvElement
function createNode(native: 'View', isTextNode: false): IvView
function createNode(native: 'ViewContainer', isTextNode: false): IvViewContainer
function createNode(native: RText | RElement | 'View' | 'ViewContainer',
  isTextNode: boolean): IvElement & IvText & IvView & IvViewContainer {
  const node: IvElement & IvText & IvView & IvViewContainer = {
    native: native as any,
    parent: cursorIsParent ? cursor as IvView : cursor.parent as any,
    component: null,
    directives: null,
    di: null,
    value: null as any,
    next: null,
    child: null
  };
  if (cursorIsParent) {
    // New node is created as a child of the current one.
    cursor && ((cursor as IvView).child = node);
  } else {
    // New node is a next sibling of the current node.
    cursor.next = node;
  }
  // If we are self closing (ie TextNode), then inCursorNode is false.
  cursorIsParent = !isTextNode;
  return cursor = node;
}

/**
 * Must use this method for CD (instead of === ) since Infinity !== Infinity
 */
export function isSame(a: any, b: any): boolean {
  return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}

export function stringify(value: any): string {
  if (typeof value == 'string') return value;
  if (value === undefined || value === null) return '';
  return '' + value;
}

//////////////////////////
//// Render
//////////////////////////
export function render<T>(host: IvHostElement, tempRenderer: Renderer3, template: Template<T>, ctx: T) {
  cursor = host;
  cursorIsParent = true;
  renderer = tempRenderer;
  try {
    template(ctx, !host.child);
    elementEnd();
  } finally {
    cursor = null!;
    renderer = null!;
  }
}

export function createHostNode(element: RElement): IvHostElement {
  cursorIsParent = true;
  cursor = null!;
  return createNode(element, false) as any;
}


//////////////////////////
//// ELEMENT
//////////////////////////

/**
 * 
 * @param parent IvNode
 * @param index Location in the parent IvNode.children where the current node should 
 *        be stored in creation mode or retrieved from update mode.
 * @param name Name of the DOM Node.
 * @param attrs Statically bound set of attributes to be written into the DOM element.
 * @param listeners A set of listener which should be registered for the DOM element.
 */
export function elementCreate(name: string,
  attrs?: { [key: string]: any } | false | 0,
  listeners?: { [key: string]: any } | false) {
  let node: IvElement;
  if (creationMode) {
    node = createNode(renderer.createElement(name), false);
    if (attrs) {
      for (let key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          node!.native!.setAttribute(key, attrs[key]);
        }
      }
    }
    const parentNative = node.parent.native;
    if (parentNative !== VIEW) {
      parentNative.insertBefore(node.native, null);
    }
    // TODO: add code for setting up listeners.
  } else {
    cursor = cursorIsParent ? cursor.child! : cursor.next!;
    cursorIsParent = true;
  }
}

/**
 * Mark the end of the element.
 */
export function elementEnd(template?: Template<any>) {
  if (template) {
    // we don't add child elements to parent since components can reproject.
    const node = cursor as IvElement;
    const instance = node.component!.instance;
    if (creationMode) {
      // TODO: could we move this check into compile time?
      instance.onInit && instance.onInit();
    } else {
      // TODO: call onChanges if exist. 
    }
    template(instance, creationMode);
  }

  if (cursorIsParent) {
    // If we are in the cursor, than just mark that we are 
    // no longer in the cursor. (Effectively closing it.)
    cursorIsParent = false;
  } else {
    // If we are already out of the cursor, than ending 
    // an element requires poping a level higher.
    cursor = cursor.parent!;
  }
}



/**
 * Update an attribute on an Element.
 * 
 * @param parent Parent IvNode
 * @param attrName Name of attribute. Because it is going to DOM this is not subject to
 *        renaming as port of minification.
 * @param value Value to write. This value will go through stringification.
 */
export function elementAttribute(propIndex: number, attrName: string, value: any): void {
}

/**
 * Update a property on an Element.
 * 
 * @param parent Parent IvNode. 
 * @param propName Name of property. Because it is going to DOM this is not subject to
 *        renaming as part of minification.
 * @param value New value to write.
 */
export function elementProperty(propIndex: number, propName: string, value: any): void {
}

export function elementClass(propIndex: number, className: string, value: any): void {
}

export function elementStyle(propIndex: number, styleName: string, value: any, suffix?: string): void {
}




//////////////////////////
//// TEXT
//////////////////////////


/**
 * Create static text node
 * 
 * @param parent 
 * @param index Location in the parent IvNode.children where the current node should 
 *        be stored in creation mode or retrieved from update mode.
 * @param value Value to write. This value will go through stringification.
 */
export function textCreate(value: any) {
  if (creationMode) {
    const node = createNode(renderer.createTextNode(stringify(value)), true);
    const parentNative = node.parent!.native;
    if (parentNative !== VIEW) {
      parentNative.insertBefore(node.native, null);
    }
  }
}

/**
 * Create text node with binding
 * 
 * @param parent 
 * @param index Location in the parent IvNode.children where the current node should 
 *        be stored in creation mode or retrieved from update mode.
 * @param value Value to write. This value will go through stringification.
 */
export function textCreateBound(value: any): void {
  textCreate(value);
  if (!creationMode) {
    const node = cursor as IvText;
    if (node.value !== value) {
      (node.native as Text).textContent = node.value = value;
    }
  }
}


//////////////////////////
//// Component
//////////////////////////


export function componentCreate<T>(componentType: Type<T>, diDeps: any[]): T {
  let node = cursor as IvElement;
  let directiveState: DirectiveState<T>;
  if (creationMode) {
    node.component = directiveState = instantiateDirective(node, componentType, diDeps);
  } else {
    directiveState = node.component as DirectiveState<T>;
  }
  return directiveState.instance;
}

export function componentInput(inputIndex: number, value: any, onChangesName?: string): boolean {
  return checkDirectiveInput((cursor as IvElement).component!, inputIndex, value, onChangesName);
}

function checkDirectiveInput<T>(directiveState: DirectiveState<T>, attrIndex: number, value: any, onChangesName?: string) {
  const inputs = directiveState.inputs || (directiveState.inputs = []);
  let hasChanged = true;
  if (creationMode) {
    inputs[attrIndex] = value;
  } else {
    const lastValue = inputs[attrIndex];
    (hasChanged = isSame(lastValue, value)) && (inputs[attrIndex] = value);
  }
  if (hasChanged && onChangesName) {
    const changes: SimpleChanges = directiveState.changes || (directiveState.changes = {});
    changes[onChangesName] = value;
  }
  return hasChanged;
}


//////////////////////////
//// Directive
//////////////////////////

export function directiveCreate<T>(directiveIndex: number, directiveType: Type<T>, diDeps: any[], structuralTemplate?: Template<any>): T {
  let node = cursor as IvElement;
  let directiveState: DirectiveState<T>;
  let directives = node.directives || (node.directives = []);
  if (creationMode) {
    directives[directiveIndex] = directiveState = instantiateDirective(node, directiveType, diDeps, structuralTemplate);
  } else {
    directiveState = directives[directiveIndex] as DirectiveState<T>;
  }
  return directiveState.instance;
}

export function directiveInput(directiveIndex: number, inputIndex: number, value: any, onChangesName?: string): boolean {
  const node = cursor as IvElement;
  return checkDirectiveInput(node.directives![directiveIndex], inputIndex, value, onChangesName);
}


//////////////////////////
//// Group
//////////////////////////


export function viewContainerCreate(): void {
  createNode(VIEW_CONTAINER, false);
}

export function viewContainerEnd(): void {
  // Groups don't insert native elements since they don't yet have a parent.
  if (cursorIsParent) {
    // If we are in the cursor, than just mark that we are 
    // no longer in the cursor. (Effectively closing it.)
    cursorIsParent = false;
  } else {
    // If we are already out of the cursor, than ending 
    // an element requires poping a level higher.
    cursor = cursor.parent!;
  }
}

