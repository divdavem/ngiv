/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Injector, Type, TemplateRef, ViewContainerRef, ElementRef, EmbeddedViewRef, ViewRef, ComponentFactory } from '@angular/core';
import { IvText, IvElement, IvGroup, IvNode, Template, DirectiveState, IvInjector } from './interfaces';

const enum OptionFlags {
  Optional = 1 << 0,
  CheckSelf = 1 << 1,
  CheckParent = 1 << 2,
  Default = CheckSelf | CheckParent
}

export function instantiateDirective<T>(node: IvNode, type: Type<T>, diDeps: any[], template?: Template<any>): DirectiveState<T> {
  let args = <any>[];
  for (let i = 0; i < diDeps.length; i++) {
    let dep = diDeps[i];
    let depValue;
    if (dep == TemplateRef) {
      // TODO: make better error handling to include dom structure where it happened.
      if (!template) throw new Error('Not a structural directive');
      depValue = getTemplateRef(node, template);
    } else if (dep == ViewContainerRef) {
      depValue = getViewContainerRef(node);
    } else if (dep == ElementRef) {
      depValue = getElementRef(node);
    } else {
      depValue = getInstance(node, dep, OptionFlags.Default);
    }
  }
  let instance: T = new type(...args);
  return {
    type: type,
    instance: instance,
    inputs: null,
    changes: null
  };
}

function getInstance(node: IvNode, dep: any, options: OptionFlags): any {
  // This is a very naive implementation. Let's see if it will survive perf tests.
  let current = options & OptionFlags.CheckSelf ? node : node.parent;
  let checkParent = options & OptionFlags.CheckParent;
  
  let directives: DirectiveState<any>[] | null;
  let directive: DirectiveState<any> | null;
  let injector: Injector|null = null;
  while (current) {
    injector = injector || (current.di && current.di.injector); 
    if ((directive = current.component) && directive.type === dep) {
      return directive.instance;
    }
    if (directives = current.directives) {
      for (let i = 0; i < directives.length; i++) {
        if ((directive = directives[i]) && directive.type === dep) {
          return directive.instance;
        }
      }
    }
    current = checkParent ? current.parent : null;
  }
  if (!injector || !checkParent) {
    // Don't check parents.
    injector = Injector.NULL;
  }
  return injector.get(dep);
}

function createDI(): IvInjector {
  return { injector: null, templateRef: null, viewContainerRef: null, elementRef: null };
}

function getTemplateRef(node: IvNode, template: Template<any>) {
  let di = node.di || (node.di = createDI());
  return di.templateRef || (di.templateRef = new IvTemplateRef<any>(getElementRef(node), template));
}

function getElementRef(node: IvNode): ElementRef {
  let di = node.di || (node.di = createDI());
  return di.elementRef || (di.elementRef = new ElementRef(node.native));
}

function getViewContainerRef(node: IvNode): ViewContainerRef {
  let di = node.di || (node.di = createDI());
  return di.viewContainerRef || (di.viewContainerRef = new IvViewContainerRef(node as IvGroup));
}

class IvTemplateRef<T> implements TemplateRef<T> {
  readonly elementRef: ElementRef;

  constructor(elementRef: ElementRef, template: Template<T>) {
    this.elementRef = elementRef
  }

  createEmbeddedView(context: T): EmbeddedViewRef<T> {
    throw new Error("Method not implemented.");
  }
}

class IvViewContainerRef implements ViewContainerRef {
  element: ElementRef;
  injector: Injector;
  parentInjector: Injector;

  constructor(node: IvGroup) {
  }

  clear(): void {
    throw new Error("Method not implemented.");
  }
  get(index: number): ViewRef | null {
    throw new Error("Method not implemented.");
  }
  length: number;
  createEmbeddedView<C>(templateRef: TemplateRef<C>, context?: C | undefined, index?: number | undefined): EmbeddedViewRef<C> {
    throw new Error("Method not implemented.");
  }
  createComponent<C>(componentFactory: ComponentFactory<C>, index?: number | undefined, injector?: Injector | undefined, projectableNodes?: any[][] | undefined, ngModule?: NgModuleRef<any> | undefined): ComponentRef<C> {
    throw new Error("Method not implemented.");
  }
  insert(viewRef: ViewRef, index?: number | undefined): ViewRef {
    throw new Error("Method not implemented.");
  }
  move(viewRef: ViewRef, currentIndex: number): ViewRef {
    throw new Error("Method not implemented.");
  }
  indexOf(viewRef: ViewRef): number {
    throw new Error("Method not implemented.");
  }
  remove(index?: number | undefined): void {
    throw new Error("Method not implemented.");
  }
  detach(index?: number | undefined): ViewRef | null {
    throw new Error("Method not implemented.");
  }

}

