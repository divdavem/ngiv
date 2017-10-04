import {MyApp, TodoComponent} from './example';
import {ElementRef, Input, IterableDiffers, TemplateRef, ViewContainerRef, Injector, NgIterable} from '@angular/core';
import {NgForOf, NgForOfContext} from '@angular/common';
import {Template, IvGroup, cc, ec, cr, ep, gc, ci, dc, di, ge, tc, ee, tC} from './iv';


const TodoComponentDeps = [ElementRef];
const NgForOfDeps = [ViewContainerRef, TemplateRef, IterableDiffers];

function MyAppTemplate(myApp:MyApp, cm: boolean, temp: any) {
  ec('todo'); // <todo>
  let todo = cc(TodoComponent, TodoComponentDeps);
  ci(0, temp = myApp.list) && (todo.data = temp);
  cr(TodoTemplate);
  ee(); // </todo>;
}

function TodoTemplate(todo:TodoComponent, cm: boolean, temp: any) {
  ec('ul', cm && {'class': 'list'}); // <ul class="list">
  ep('title', todo.myTitle);
  gc();
  let ngFor = dc(0, NgForOf, NgForOfDeps) as NgForOf<any[]>;
  di(0, 0, temp = todo.data, 'ngForOf') && (ngFor.ngForOf = temp as typeof todo.data);
  ge();
  ee(); // </ul>

  function NgForTemplate(ngForContext:NgForOfContext<any>, cm: boolean, temp: any) {
    ec('li'); // <li>
    tC(ngForContext.$implicit);
    ee(); // </li>
  }
}