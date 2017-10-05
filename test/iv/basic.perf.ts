import {createWindow} from 'domino';
import {render, createHostNode, E, e, T} from '../../src/iv';

describe('iv perf test', () => {

  var window = createWindow('', 'http://localhost');
  var document = window.document;
  const count = 100000;
  const noOfIterations = 10;
  
  describe('render', () => {
    for(var iteration = 0; iteration < noOfIterations; iteration++) {
      it(`${iteration}. create ${count} divs in DOM`, () => {
        const start = new Date().getTime();
        const container = document.createElement('div');
        for(var i = 0; i < count; i++ ) {
          const div = document.createElement('div');
          div.appendChild(document.createTextNode('-'));
          container.appendChild(div);
        }
        const end = new Date().getTime();
        log(`${count} DIVs in DOM`, (end - start)/count);
      });
  
      it(`${iteration}. create ${count} divs in IV`, () => {
        const start = new Date().getTime();
        const container = document.createElement('div');
        render(createHostNode(container), document, Template, {});
        const end = new Date().getTime();
        log(`${count} DIVs in IV`, (end - start)/count);
  
        function Template() {
          for(var i = 0; i < count; i++ ) {
            E('div');
              T('-');
            e();
          }
        }
  
      });
      }
  });
});

function log(text: string, duration: number) {
  console.log(text, duration * 1000, 'ns');
}