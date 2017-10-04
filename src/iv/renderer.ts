/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 /**
  * The goal here is to make sure that the browser DOM API is the Renderer. 
  * We do this by defining a subset of DOM API to be the renderer and than
  * use that time for rendering. 
  *
  * At runtime we can than use the DOM api directly, in server or web-worker
  * it will be easy to implement such API. 
  */


 declare global {
  interface Node {
    setProperty(name:string, value: any): void;  
  }  
}

/**
 * Subset of API needed to create elements and text nodes.
 */
export interface Renderer3 {
  createElement(tagName: string): RElement;
  createElementNS(namespaceURI: string | null, qualifiedName: string): RElement;
  createTextNode(data: string): Text;
}

/**
 * Subset of API needed for appending elements and text nodes.
 */
export interface RNode {
  removeChild(oldChild: RNode): void;
  insertBefore(newChild: RNode, refChild: RNode | null): void;
}

/**
 * Subset of API needed for writing attributes, properties, and setting up 
 * listeners on Element.
 */
export interface RElement extends RNode {
  setAttribute(name: string, value: string): void;
  setAttributeNS(namespaceURI: string, qualifiedName: string, value: string): void;
  addEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
  removeEventListener(type: string, listener?: EventListener, options?: boolean): void;

  setProperty(name:string, value: any): void;
}

export interface RText extends RNode {
  textContent: string|null;
}

// Verify that DOM is a type of render. This is here for error checking only and has no use.
var renderer: Renderer3 = null as any as Document;
var element: RElement = null as any as HTMLDivElement;
var text: RText = null as any as Text;
