import {MyApp, TodoComponent} from './example';
import {ElementRef, Input, IterableDiffers, TemplateRef, ViewContainerRef, Injector, NgIterable} from '@angular/core';
import {NgForOf, NgForOfContext} from '@angular/common';
import {Template, IvView, C, E, p, X, I, D, i, x, T, e, t} from './iv';


const TodoComponentDeps = [ElementRef];
const NgForOfDeps = [ViewContainerRef, TemplateRef, IterableDiffers];

function MyAppTemplate(ctx:MyApp, cm: boolean, temp: any) {
  E('todo'); // <todo>
    let todo = C(TodoComponent, TodoComponentDeps);
    I(0, temp = ctx.list) && (todo.data = temp);
  e(TodoTemplate); // </todo>;
}

function TodoTemplate(ctx:TodoComponent, cm: boolean, temp: any) {
  E('ul', cm && {'class': 'list'}); // <ul class="list">
    p(0, 'title', ctx.myTitle);
    X(); // <!-- ViewContainer -->
      let ngFor = D(0, NgForOf, NgForOfDeps, NgForTemplate) as NgForOf<any[]>;
      i(0, 0, temp = ctx.data, 'ngForOf') && (ngFor.ngForOf = temp as typeof ctx.data);
    x(); // <!-- /ViewContainer -->
  e(); // </ul>

  function NgForTemplate(ngForContext:NgForOfContext<any>, cm: boolean, temp: any) {
    E('li'); // <li>
      t(ngForContext.$implicit);
    e(); // </li>
  }
}