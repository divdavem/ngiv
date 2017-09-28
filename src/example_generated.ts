import {MyApp, TodoComponent} from './example';
import {ElementRef, Input, IterableDiffers, TemplateRef, ViewContainerRef, Injector, NgIterable} from '@angular/core';
import {NgForOf, NgForOfContext} from '@angular/common';
import {Template, IvBlock, IvGroup, cc, ec, cr, ep, ac, ci, dI, ar, tc} from './iv';
  

function MyAppTemplate(hostBlock: IvBlock, myApp:MyApp, cm: boolean) {
  let temp;
  let todoNode = cc(hostBlock, 0, 'todo', TodoComponent, TodoComponentDeps);
  ci(todoNode, 0, temp = myApp.list) && (todoNode.component.data = temp);
  cr(todoNode, TodoTemplate);
}

const TodoComponentDeps = [ElementRef];

function TodoTemplate(hostGroup: IvBlock, todo:TodoComponent, cm: boolean) {
  var temp: any;
  var li = ec(hostGroup, 0, 'ul', cm && {'class': 'list'});
  ep(hostGroup, 'title', todo.myTitle);
  var ngForAnchor = ac(hostGroup, 2, NgForTemplate);
  let ngFor = ngForAnchor.directives![0] || (ngForAnchor.directives![0] = TodoTemplateNgFor(ngForAnchor));
  dI(ngForAnchor, 0, 'ngForOf', temp = todo.data) && (ngFor.ngForOf = temp as typeof todo.data);
  ar(ngForAnchor);

  function NgForTemplate(hostGroup: IvBlock, ngForContext:NgForOfContext<any>) {
    var li = ec(hostGroup, 0, 'li');
    tc(li, 2, ngForContext.$implicit);
  }
}

function TodoTemplateNgFor(node: IvGroup, ctx: any, cm: boolean) {
  const viewContainer = null as any;
  const template = null as any;
  return new NgForOf(viewContainer, template, node.injector!.get(IterableDiffers));
}
