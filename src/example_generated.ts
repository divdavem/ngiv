import {MyApp, TodoComponent} from './example';
import {ElementRef, Input, IterableDiffers, TemplateRef, ViewContainerRef, Injector, NgIterable} from '@angular/core';
import {NgForOf, NgForOfContext} from '@angular/common';
import {Template, IvGroup, cc, ec, ep, gc, ci, dc, di, ge, tc, ee, tC} from './iv';


const TodoComponentDeps = [ElementRef];
const NgForOfDeps = [ViewContainerRef, TemplateRef, IterableDiffers];

function MyAppTemplate(ctx:MyApp, cm: boolean, temp: any) {
  ec('todo'); // <todo>
    let todo = cc(TodoComponent, TodoComponentDeps);
    ci(0, temp = ctx.list) && (todo.data = temp);
  ee(TodoTemplate); // </todo>;
}

function TodoTemplate(ctx:TodoComponent, cm: boolean, temp: any) {
  ec('ul', cm && {'class': 'list'}); // <ul class="list">
    ep(0, 'title', ctx.myTitle);
    gc();
      let ngFor = dc(0, NgForOf, NgForOfDeps, NgForTemplate) as NgForOf<any[]>;
      di(0, 0, temp = ctx.data, 'ngForOf') && (ngFor.ngForOf = temp as typeof ctx.data);
    ge();
  ee(); // </ul>

  function NgForTemplate(ngForContext:NgForOfContext<any>, cm: boolean, temp: any) {
    ec('li'); // <li>
      tC(ngForContext.$implicit);
    ee(); // </li>
  }
}