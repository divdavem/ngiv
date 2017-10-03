import { Injector, Type } from '@angular/core';
import { IvNodeKind, IvContainer, IvText, IvElement, IvGroup, IvNode, Template, Renderer3, RElement, RText, RNode } from './interfaces';

/**
 * This property gets set before entering a template.
 */
let creationMode: boolean = true;

/**
 * This property gets set before entering a template.
 */
let renderer: Renderer3 = document;

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
    parent: parent,
    native: native as any,
    component: null,
    directives: null,
    injector: null,
    value: null as any,
    children: (kind == IvNodeKind.Text ? null : []) as any
  };
}

/**
 * CreateElement
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
 * SetProperty
 */
export function elementProperty(node: IvContainer, attrName: string, value: any): boolean {
  return false;
}

export function elementAttribute(node: IvContainer, attrName: string, value: any): boolean {
  return false;
}






/**
 * Create Component
 */
export function textCreate(parent: IvContainer, index: number, value: any): void {
  let node: IvText;
  if (creationMode) {
    node = createNode(IvNodeKind.Text, parent, renderer.createTextNode(value));
    parent.children.push(node);
    parent.native!.appendChild(node.native!);
  } else {
    node = parent.children[index] as IvText;
    if (node.value !== value) {
      (node.native as Text).textContent = node.value = value;
    }
  }
}

function createInstance(node: IvContainer, type: any, diDeps: any[]) {
}

/**
 * Create Component
 */
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

/**
 * ComponentRefresh
 */
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


export function directiveCreate<T>(node: IvContainer, directiveIndex: number, directiveType: Type<T>, diDeps: any[]): T {
  return null!;
}

/**
 * SetDirectiveInputWithNgForChanges
 */
export function directiveInputWithOnChanges(node: IvContainer, directiveIndex: number, attrName: string, value: any): boolean {
  return false;
}

export function directiveInput(node: IvContainer, directiveIndex: number, attrName: string, value: any): boolean {
  return false;
}


/**
 * CreateAnchor
 */
export function groupCreate(node: IvContainer, id: number, template: Template<any>): IvGroup {
  return null!;
}

/**
 * RefreshComponent
 */
export function groupRefresh(node: IvContainer): void {
}

export function isSame(a: any, b: any): boolean {
  return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}
