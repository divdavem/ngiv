import {Component, OnInit, ElementRef, Input, IterableDiffers, TemplateRef, ViewContainerRef, Injector, NgIterable} from '@angular/core';

@Component({
  template: `<todo [data]="list"></todo>`
  // <div i18n> {{salutation}} <b>{{greeting}}</b>!</div>
  // <div i18n> <b>{{greeting}}</b> {{salutation}}!</div>
})
export class MyApp implements OnInit {

  list: any[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
  }
}

@Component({
  selector: 'todo',
  template: `<ul class="list" [title]="myTitle"><li *ngFor="let item of data">{{data}}</li></ul>`
})
export class TodoComponent implements OnInit {
  
  @Input()
  data: any[] = [];

  myTitle: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
  }
}

/**
(function(jit_createRendererType2_0,jit_viewDef_1,jit_elementDef_2,jit_View_TodoComponent_0_3,jit__object_Object__4,jit_directiveDef_5,jit_TodoComponent_6,jit_ElementRef_7) {
  var styles_MyApp = [];
  var RenderType_MyApp = jit_createRendererType2_0({encapsulation:2,styles:styles_MyApp,
      data:{}});
  function View_MyApp_0(_l) {
    return jit_viewDef_1(0,[(_l()(),jit_elementDef_2(0,null,null,1,'todo',[],null,null,
        null,jit_View_TodoComponent_0_3,jit__object_Object__4)),jit_directiveDef_5(114688,
        null,0,jit_TodoComponent_6,[jit_ElementRef_7],{data:[0,'data']},null)],function(_ck,
        _v) {
      var _co = _v.component;
      var currVal_0 = _co.list;
      _ck(_v,1,0,currVal_0);
    },null);
  }
  return {RenderType_MyApp:RenderType_MyApp,View_MyApp_0:View_MyApp_0};
  })

(function(jit_createRendererType2_0,jit_viewDef_1,jit_elementDef_2,jit_textDef_3,jit_anchorDef_4,jit_directiveDef_5,jit_NgForOf_6,jit_ViewContainerRef_7,jit_TemplateRef_8,jit_IterableDiffers_9) {
var styles_TodoComponent = [];
var RenderType_TodoComponent = jit_createRendererType2_0({encapsulation:2,styles:styles_TodoComponent,
    data:{}});
function View_TodoComponent_1(_l) {
  return jit_viewDef_1(0,[(_l()(),jit_elementDef_2(0,null,null,1,'li',[],null,null,
      null,null,null)),(_l()(),jit_textDef_3(null,['','']))],null,function(_ck,_v) {
    var _co = _v.component;
    var currVal_0 = _co.data;
    _ck(_v,1,0,currVal_0);
  });
}
function View_TodoComponent_0(_l) {
  return jit_viewDef_1(0,[(_l()(),jit_elementDef_2(0,null,null,2,'ul',[['class','list']],
      [[8,'title',0]],null,null,null,null)),(_l()(),jit_anchorDef_4(16777216,null,
      null,1,null,View_TodoComponent_1)),jit_directiveDef_5(802816,null,0,jit_NgForOf_6,
      [jit_ViewContainerRef_7,jit_TemplateRef_8,jit_IterableDiffers_9],{ngForOf:[0,
          'ngForOf']},null)],function(_ck,_v) {
    var _co = _v.component;
    var currVal_1 = _co.data;
    _ck(_v,2,0,currVal_1);
  },function(_ck,_v) {
    var _co = _v.component;
    var currVal_0 = _co.myTitle;
    _ck(_v,0,0,currVal_0);
  });
}
return {RenderType_TodoComponent:RenderType_TodoComponent,View_TodoComponent_0:View_TodoComponent_0};
})
*/