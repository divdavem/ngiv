import { Injector, Type } from '@angular/core';
import { IvNodeKind, IvGroup, IvText, IvElement, IvBlock, IvAnchor, IvNode, Template, Renderer3, RElement, RText, RNode } from './interfaces';


let creationMode: boolean = true;
let renderer: Renderer3 = document;

function createNode(kind: IvNodeKind.Text, parent: IvGroup | null, native: RNode | null): IvText;
function createNode(kind: IvNodeKind.Element, parent: IvGroup | null, native: RNode | null): IvElement;
function createNode(kind: IvNodeKind.Block, parent: IvGroup | null, native: RNode | null): IvBlock;
function createNode(kind: IvNodeKind.Anchor, parent: IvGroup | null, native: RNode | null): IvAnchor;
function createNode(
  kind: IvNodeKind.Text&IvNodeKind.Element&IvNodeKind.Block&IvNodeKind.Anchor, 
  parent: IvGroup | null, 
  native: RText | RElement): IvElement&IvText&IvAnchor&IvBlock 
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
 * Create Component
 */
export function textCreate(parent: IvGroup, index: number, value: any): void {
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

function createInstance(node: IvGroup, type: any, diDeps: any[]) {
}

/**
 * Create Component
 */
export function componentCreate(parent: IvGroup, index: number, element: string,
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


/**
 * CreateElement
 */
export function elementCreate(parent: IvGroup, index: number, name: string, attrs?: { [key: string]: any } | false): IvElement {
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
export function elementProperty(node: IvGroup, attrName: string, value: any): boolean {
  return false;
}

/**
 * SetDirectiveInputWithNgForChanges
 */
export function directiveInputWithOnChanges(node: IvGroup, directiveIndex: number, attrName: string, value: any): boolean {
  return false;
}

export function directiveInput(node: IvGroup, directiveIndex: number, attrName: string, value: any): boolean {
  return false;
}

/**
 * SetComponentInput
 */
export function componentInput(node: IvElement, attrIndex: number, value: any): boolean {
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
export function anchorCreate(node: IvGroup, id: number, template: Template<any>): IvAnchor {
  return null!;
}

/**
 * RefreshComponent
 */
export function anchorRefresh(node: IvGroup): void {
}

export function isSame(a: any, b: any): boolean {
  return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}
