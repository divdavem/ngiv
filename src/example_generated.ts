import {MyApp, TodoComponent} from './example';
import {ElementRef, Input, IterableDiffers, TemplateRef, ViewContainerRef, Injector, NgIterable} from '@angular/core';
import {NgForOf, NgForOfContext} from '@angular/common';
import {Template, IvBlock, IvGroup, cc, ec, cr, ep, ca, ci, dI, ra, ct} from './runtime';
  

function MyAppTemplate(cm: boolean, hostBlock: IvBlock, myApp:MyApp) {
  let temp;
  let todoNode = cc(hostBlock, 0, 'todo', TodoComponent, TodoComponentDeps);
  ci(todoNode, 0, temp = myApp.list) && (todoNode.component.data = temp);
  cr(todoNode, TodoTemplate);
}

const TodoComponentDeps = [ElementRef];

function TodoTemplate(cm: boolean, hostGroup: IvBlock, todo:TodoComponent) {
  var temp: any;
  var li = ec(hostGroup, 0, 'ul', cm && {'class': 'list'});
  ep(hostGroup, 'title', todo.myTitle);
  var ngForAnchor = ca(hostGroup, 2, NgForTemplate);
  let ngFor = ngForAnchor.directives![0] || (ngForAnchor.directives![0] = TodoTemplateNgFor(ngForAnchor));
  dI(ngForAnchor, 0, 'ngForOf', temp = todo.data) && (ngFor.ngForOf = temp as typeof todo.data);
  ra(ngForAnchor);

  function NgForTemplate(hostGroup: IvBlock, ngForContext:NgForOfContext<any>) {
     var li = ec(hostGroup, 0, 'li');
     ct(li, 2, ngForContext.$implicit);
    }
}

function TodoTemplateNgFor(cm: boolean, node: IvGroup) {
  const viewContainer = null as any;
  const template = null as any;
  return new NgForOf(viewContainer, template, node.injector!.get(IterableDiffers));
}
