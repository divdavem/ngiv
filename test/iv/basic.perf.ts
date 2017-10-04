import {createWindow} from 'domino';
import {render, createHostNode, ec, ee, tc} from '../../src/iv';

describe('iv perf test', () => {

  var window = createWindow('', 'http://localhost');
  var document = window.document;
  const count = 10000;
  
  describe('render', () => {
    it('should create ${count} divs in DOM', () => {
      const start = new Date().getTime();
      const container = document.createElement('div');
      for(var i = 0; i < count; i++ ) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode('-'));
        container.appendChild(div);
      }
      const end = new Date().getTime();
      log('${count} DIVs in DOM', (end - start)/count);
    });

    it('should create ${count} divs in IV', () => {
      const start = new Date().getTime();
      const container = document.createElement('div');
      render(createHostNode(container), document, Template, {});
      const end = new Date().getTime();
      log('${count} DIVs in IV', (end - start)/count);

      function Template() {
        for(var i = 0; i < count; i++ ) {
          ec('div');
            tc('-');
          ee();
        }
      }

    });
  });
});

function log(text: string, duration: number) {
  console.log(text, duration * 1000, 'ns');
}