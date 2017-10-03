import {MyApp, TodoComponent} from './example';
import {ElementRef, Input, IterableDiffers, TemplateRef, ViewContainerRef, Injector, NgIterable} from '@angular/core';
import {NgForOf, NgForOfContext} from '@angular/common';
import {Template, IvGroup, IvContainer, cc, ec, cr, ep, gc, ci, dc, dI, gr, tc} from './iv';


const TodoComponentDeps = [ElementRef];
const NgForOfDeps = [ViewContainerRef, TemplateRef, IterableDiffers];

function MyAppTemplate(hostBlock: IvGroup, myApp:MyApp, cm: boolean) {
  let temp;
  let todoNode = cc(hostBlock, 0, 'todo', TodoComponent, TodoComponentDeps);
  ci(todoNode, 0, temp = myApp.list) && (todoNode.component.data = temp);
  cr(todoNode, TodoTemplate);
}

function TodoTemplate(hostGroup: IvGroup, todo:TodoComponent, cm: boolean) {
  var temp: any;
  var li = ec(hostGroup, 0, 'ul', cm && {'class': 'list'});
  ep(hostGroup, 'title', todo.myTitle);
  var ngForGroup = gc(hostGroup, 2, NgForTemplate);
  let ngFor = dc(ngForGroup, 0, NgForOf, NgForOfDeps) as NgForOf<any[]>;
  dI(ngForGroup, 0, 'ngForOf', temp = todo.data) && (ngFor.ngForOf = temp as typeof todo.data);
  gr(ngForGroup);

  function NgForTemplate(hostGroup: IvGroup, ngForContext:NgForOfContext<any>) {
    var li = ec(hostGroup, 0, 'li');
    tc(li, 2, ngForContext.$implicit);
  }
}