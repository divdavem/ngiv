/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Injector, Type, SimpleChanges } from '@angular/core';
import { IvText, IvElement, IvGroup, IvNode, Template, DirectiveState} from './interfaces';
import { Renderer3, RElement, RText, RNode } from './renderer';

/**
 * This property gets set before entering a template.
 */
let creationMode: boolean = true;

/**
 * This property gets set before entering a template.
 */
let renderer: Renderer3 = document;

/**
 * Current location in the ivNode tree.
 */
let cursor: IvNode;

/**
 * Flags whether the next element will be created inside the current 
 * cursor or after the current cursor.
 * 
 * - true: Create a node inside the `cursor`.
 * - false: Create a node as a sibling of the `cursor`. 
 */
let inCursorNode: boolean = false;

/**
 * Patch the Node so that it complies with our Renderer.
 */
Node && (Node.prototype.setProperty = function (this: Node, name:string, value: any): void {
  (this as any)[name] = value;
});

/**
 * A Common way of creating the IvNode to make sure that all of them have same shape to
 * keep the execution code monomorphic and fast.
 */
function createNode(native: RText | RElement | null, selfClosing: boolean):
              IvElement & IvText
{
  const node: IvElement & IvText = {
    native: native as any,
    parent: inCursorNode ? cursor as IvGroup : cursor.parent,
    component: null,
    directives: null,
    injector: null,
    value: null as any,
    next: null,
    child: null
  };
  if (inCursorNode) {
    // New node is created as a child of the current one.
    (cursor as IvGroup).child = node;
  } else {
    // New node is a next sibling of the current node.
    cursor.next = node;
  }
  // If we are self closing (ie TextNode), then inCursorNode is false.
  inCursorNode = !selfClosing;
  return cursor = node;
}

/**
 * Must use this method for CD (instead of === ) since Infinity !== Infinity
 */
export function isSame(a: any, b: any): boolean {
  return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
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
                              listeners?: {[key: string]: any } | false) {
  let node: IvElement;
  const parent = cursor;
  if (creationMode) {
    node = createNode(renderer.createElement(name), false);
    insertNativeNode(node);
    if (attrs) {
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          node!.native!.setAttribute(key, attrs[key]);
        }
      }
    }
  }
}

/**
 * Inserting a node requires that we find parent node and next sibling to 
 * insert in front of. This is complicated by the fact that parent node
 * may be a IvGroup which means that it is not in DOM. We have to find the 
 * parent as well as next sibling (if any);
 * 
 * @param node 
 */
function insertNativeNode(node: IvElement|IvText) {
  let parentNode = node.parent;

  // Keep looking for parent node until you find one which has a native
  // element attached to it.
  while (parentNode && !parentNode.native) {
    parentNode = parentNode.parent;
  }

  // Now find the next node to insert infront off. 
  let refNode: IvNode|null = null
  let cursor = node.next || node.parent!.next;
  while (cursor && cursor !== parentNode) {
    if (cursor.native) {
      refNode = cursor;
      break;
    }
    cursor = (cursor as IvElement).child || cursor.next || cursor.parent!.next
  }

  parentNode && parentNode.native.insertBefore(node.native, refNode && refNode!.native);
}

/**
 * Update an attribute on an Element.
 * 
 * @param parent Parent IvNode
 * @param attrName Name of attribute. Because it is going to DOM this is not subject to
 *        renaming as port of minification.
 * @param value Value to write. This value will go through stringification.
 */
export function elementAttribute(attrName: string, value: any): void {
}

/**
 * Update a property on an Element.
 * 
 * @param parent Parent IvNode. 
 * @param propName Name of property. Because it is going to DOM this is not subject to
 *        renaming as port of minification.
 * @param value New value to write.
 */
export function elementProperty(propName: string, value: any): void {
}

/**
 * Mark the end of the element.
 */
export function elementEnd() {
  if (inCursorNode) {
    // If we are in the cursor, than just mark that we are 
    // no longer in the cursor. (Effectively closing it.)
    inCursorNode = false;
  } else {
    // If we are already out of the cursor, than ending 
    // an element requires poping a level higher.
    cursor = cursor.parent!;
  }
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
    const node = createNode(renderer.createTextNode(value), true);
    insertNativeNode(node);
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
    node.component = directiveState = instantiateDirective(componentType, diDeps);
  } else {
    directiveState = node.component as DirectiveState<T>;
  }
  return directiveState.instance;
}

export function componentRefresh(template: Template<any>): void {
  const node = cursor as IvElement;
  const directiveState = node.component!;
  const instance = directiveState.instance;
  if (creationMode) {
    // TODO: could we move this chec into compile time?
    instance.onInit && instance.onInit();
  } else {
    // TODO: call onChanges if exist. 
  }
  template(node.component, creationMode);
}

export function componentInput(inputIndex: number, value: any, onChangesName?: string): boolean {
  return checkDirectiveInput((cursor as IvElement).component!, inputIndex, value, onChangesName);
}

function checkDirectiveInput<T>(directiveState: DirectiveState<T>, attrIndex: number, value: any, onChangesName?: string) {
  const instance = directiveState.instance;
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

export function directiveCreate<T>(directiveIndex: number, directiveType: Type<T>, diDeps: any[]): T {
  let node = cursor as IvElement;
  let directiveState: DirectiveState<T>;
  let directives = node.directives || (node.directives = []);
  if (creationMode) {
    directives[directiveIndex] = directiveState = instantiateDirective(directiveType, diDeps);
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


export function groupCreate(): void {
}

export function groupEnd(): void {
  elementEnd();
}


//////////////////////////
//// Injection
//////////////////////////

function instantiateDirective<T>(type: Type<T>, diDeps: any[]): DirectiveState<T> {
  return null!;
}

