/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Injector, Type } from '@angular/core';
import { IvNodeKind, IvContainer, IvText, IvElement, IvGroup, IvNode, Template } from './interfaces';
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
 * Patch the Node so that it complies with our Renderer.
 */
Node && (Node.prototype.setProperty = function (this: Node, name:string, value: any): void {
  (this as any)[name] = value;
});

/**
 * A Common way of creating the IvNode to make sure that all of them have same shape to
 * keep the execution code monomorphic and fast.
 */
function createNode(kind: IvNodeKind.Text, parent: IvContainer | null, native: RText): IvText;
function createNode(kind: IvNodeKind.Element, parent: IvContainer | null, native: RElement): IvElement;
function createNode(kind: IvNodeKind.Group, parent: IvContainer | null, native: RElement): IvGroup;
function createNode(
  kind: IvNodeKind.Text & IvNodeKind.Element & IvNodeKind.Group & IvNodeKind.Group, 
  parent: IvContainer | null,
  native: RText | RElement): IvElement & IvText & IvGroup & IvGroup 
{
  return {
    kind: kind,
    native: native as any,
    parent: parent,
    component: null,
    directives: null,
    injector: null,
    value: null as any,
    children: (kind == IvNodeKind.Text ? null : []) as any
  };
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
export function elementCreate(parent: IvContainer, index: number, name: string, 
                              attrs?: { [key: string]: any } | false | 0, 
                              listeners?: {[key: string]: any } | false): IvElement {
  let node: IvElement;
  if (creationMode) {
    node = createNode(IvNodeKind.Element, parent, renderer.createElement(name));
    parent.children.push(node);
    parent.native!.appendChild(node.native!);
  } else {
    node = parent.children[index] as IvElement;
  }
  if (attrs) {
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        node!.native!.setAttribute(key, attrs[key]);
      }
    }
  }
  return node;
}

/**
 * Update an attribute on an Element.
 * 
 * @param parent Parent IvNode
 * @param attrName Name of attribute. Because it is going to DOM this is not subject to
 *        renaming as port of minification.
 * @param value Value to write. This value will go through stringification.
 */
export function elementAttribute(parent: IvContainer, attrName: string, value: any): void {
}

/**
 * Update a property on an Element.
 * 
 * @param parent Parent IvNode. 
 * @param propName Name of property. Because it is going to DOM this is not subject to
 *        renaming as port of minification.
 * @param value New value to write.
 */
export function elementProperty(parent: IvContainer, propName: string, value: any): void {
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
export function textCreate(parent: IvContainer, index: number, value: any): IvText {
  let node: IvText;
  if (creationMode) {
    node = createNode(IvNodeKind.Text, parent, renderer.createTextNode(value));
    parent.children.push(node);
    parent.native!.appendChild(node.native!);
  } else {
    node = parent.children[index] as IvText;
  }
  return node;
}

/**
 * Create text node with binding
 * 
 * @param parent 
 * @param index Location in the parent IvNode.children where the current node should 
 *        be stored in creation mode or retrieved from update mode.
 * @param value Value to write. This value will go through stringification.
 */
export function textCreateBound(parent: IvContainer, index: number, value: any): void {
  let node = textCreate(parent, index, value);
  if (!creationMode) {
    if (node.value !== value) {
      (node.native as Text).textContent = node.value = value;
    }
  }
}

  
//////////////////////////
//// Component
//////////////////////////


export function componentCreate(parent: IvContainer, index: number, element: string,
  componentType: Type<any>, diDeps: any[]): IvElement {
  let node: IvElement;
  if (creationMode) {
    node = createNode(IvNodeKind.Element, parent, renderer.createElement(element));
    parent.children.push(node);
    parent.native!.appendChild(node.native!);
    createInstance(node, componentType, diDeps);
    node.value = [];
  } else {
    node = parent.children[index] as IvElement;
  }
  return node;
}

export function componentRefresh(node: IvElement, template: Template<any>): void {
  if (creationMode) {
    node.component.onInit && node.component.onInit();
  } else {
    // TODO: call onChanges if exist. 
  }
  template(node, node.component, creationMode);
}

export function componentInput(node: IvElement, attrIndex: number, value: any): boolean {
  let hasChanged = true;
  if (creationMode) {
    node.value[attrIndex] = value;
  } else {
    (hasChanged = node.value[attrIndex] === value) && (node.value[attrIndex] = value);
  }
  return hasChanged;
}

export function componentInputWithOnChanges(node: IvElement, attrIndex: string, value: any): boolean {
  return false;
}


//////////////////////////
//// Directive
//////////////////////////

export function directiveCreate<T>(node: IvContainer, directiveIndex: number, directiveType: Type<T>, diDeps: any[]): T {
  return null!;
}

export function directiveInputWithOnChanges(node: IvContainer, directiveIndex: number, attrName: string, value: any): boolean {
  return false;
}

export function directiveInput(node: IvContainer, directiveIndex: number, attrName: string, value: any): boolean {
  return false;
}


//////////////////////////
//// Group
//////////////////////////


export function groupCreate(node: IvContainer, id: number, template: Template<any>): IvGroup {
  return null!;
}

export function groupRefresh(node: IvContainer): void {
}


//////////////////////////
//// Injection
//////////////////////////

function createInstance(node: IvContainer, type: any, diDeps: any[]) {
}

