import { Injector } from '@angular/core';

export interface Renderer3 {
  createElement(tagName: string): RElement;
  createElementNS(namespaceURI: string | null, qualifiedName: string): RElement;
  createTextNode(data: string): Text;
}

export interface RNode {
  appendChild(newChild: RNode): void;  
  removeChild(oldChild: RNode): void;
  insertBefore(newChild: RNode, refChild: RNode | null): void;
}

export interface RElement extends RNode {
  setAttribute(name: string, value: string): void;
  setAttributeNS(namespaceURI: string, qualifiedName: string, value: string): void;
  addEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
  removeEventListener(type: string, listener?: EventListener, options?: boolean): void;
}

export interface RText extends RNode {
  textContent: string|null;
}

// Verify that DOM is a type of render
var renderer: Renderer3 = document;
var element: RElement = document.createElement('div');
var text: RText = document.createTextNode('text');

export interface Template<T> {
  (hostGroup: IvContainer, ctx: T, cm: boolean): void;
}

export const enum IvNodeKind {
  Element = "E",
  Text = "T",
  Group = "G"
}

export interface IvNode {
  readonly kind: IvNodeKind;
  readonly parent: IvContainer | null;
}

export interface IvContainer extends IvNode {
  children: IvNode[];
  readonly native: RElement;
}

export interface IvElement extends IvContainer {
  injector: Injector | null;
  component: any;
  directives: any[] | null;
  kind: IvNodeKind.Element;
  value: any;
}

export interface IvGroup extends IvContainer {
  kind: IvNodeKind.Group;
}

export interface IvText extends IvNode {
  kind: IvNodeKind.Text;
  readonly native: RText;
  value: string;
}
