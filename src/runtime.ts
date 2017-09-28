import {Injector, Type} from '@angular/core';

export interface Template<T>{
  (hostGroup: IvGroup, ctx: T): void;
}

export const enum IvNodeKind {
  Component = "C",
  Block = "B",
  Element = "E",
  Text = "D",
  Anchor = "A"
}

export interface IvNode {
  kind: IvNodeKind;
  parent: IvGroup|null;
  native: Node|null;
  component: any;
  injector: Injector|null;
  directives: any[]|null;
  value: any;
}

export interface IvGroup extends IvNode {
  children: IvNode[];
}
  
export interface IvComponent extends IvGroup {
  kind: IvNodeKind.Component;
}

export interface IvBlock extends IvGroup {
  kind: IvNodeKind.Block;
}

export interface IvElement extends IvGroup {
  kind: IvNodeKind.Element;
}

export interface IvAnchor extends IvGroup {
  kind: IvNodeKind.Anchor;
}

export interface IvText extends IvNode {
  kind: IvNodeKind.Text;
}

function createNode(kind: IvNodeKind.Text, parent: IvGroup|null, index: number): IvText;
function createNode(kind: IvNodeKind.Element, parent: IvGroup|null, index: number): IvElement;
function createNode(kind: IvNodeKind.Component, parent: IvGroup|null, index: number): IvComponent;
function createNode(kind: IvNodeKind.Block, parent: IvGroup|null, index: number): IvBlock;
function createNode(kind: IvNodeKind.Anchor, parent: IvGroup|null, index: number): IvAnchor;
function createNode(kind: IvNodeKind, parent: IvGroup|null, index: number): IvNode {
  return {
    kind: kind,
    parent: parent,
    native: null,
    component: null,
    directives: null,
    injector: null,
    childIndex: 0,
    value: null,
    children: kind == IvNodeKind.Text ? null : []
  } as IvNode;
}

/**
 * Create Component
 */
export function ct(parent: IvGroup, index: number, value: any): void {
  let node: IvText;
  if (creationMode) {
    node = createNode(IvNodeKind.Text, parent, index);
    node.native = document.createTextNode(value);
    parent.children.push(node);
    parent.native!.appendChild(node.native);
  } else {
    node = parent.children[currentIndex] as IvText;
    if (node.value !== value) {
      (node.native as Text).textContent = node.value = value;
    }
  }
  currentIndex++;
}

function createInstance(node: IvGroup, type: any, diDeps: any[]) {
}

/**
 * Create Component
 */
export function cc(parent: IvGroup, index: number, element: string, 
                   componentType: Type<any>, diDeps: any[]): IvComponent 
{
  let node: IvComponent;
  if (creationMode) {
    node = createNode(IvNodeKind.Component, parent, index);
    node.native = document.createElement(element);
    parent.children.push(node);
    parent.native!.appendChild(node.native);
    createInstance(node, componentType, diDeps);
    node.value = [];
  } else {
    node = parent.children[currentIndex] as IvComponent;
  }
  pushCurrentIndex();
  currentIndex++;
  return node;
}

/**
 * ComponentRefresh
 */
export function cr(node: IvGroup, template: Template<any>): void {
  if (creationMode) {
    node.component.onInit && node.component.onInit();
  } else {
    // TODO: call onChanges if exist. 
  }
  template(node, node.component);
}


/**
 * CreateElement
 */
export function ec(parent: IvGroup, id: number, name: string, props?: {[key:string]: any}|false): IvElement {
  return null!;
}


/**
 * SetProperty
 */
export function ep(node: IvGroup, attrName: string, value: any): boolean {
  return false;
}

/**
 * SetDirectiveInputWithNgForChanges
 */
export function dI(node: IvGroup, directiveIndex: number, attrName: string, value: any): boolean {
  return false;
}

/**
 * SetComponentInput
 */
export function ci(node: IvComponent, attrIndex: number, value: any): boolean {
  let hasChanged = true;
  if (creationMode) {
    node.value[attrIndex] = value;
  } else {
    (hasChanged = node.value[attrIndex] === value) && (node.value[attrIndex] = value);
  }
  return hasChanged;
}


/**
 * CreateAnchor
 */
export function ca(node: IvGroup, id: number, template: Template<any>): IvAnchor {
  return null!;
}
  
/**
 * RefreshComponent
 */
export function ra(node: IvGroup): void {
}
