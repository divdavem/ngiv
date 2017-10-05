import {createWindow} from 'domino';
import {render, createHostNode, E, e, T, t} from '../../src/iv';

describe('iv integration test', () => {

  var window = createWindow('', 'http://localhost');
  var document = window.document;

  describe('render', () => {
    it('should render basic template', () => {
      var div = window.document.createElement('div');
      render(createHostNode(div), document, Template, {});
      expect(div.innerHTML).toEqual('<span title="Hello">Greetings</span>');
  
      function Template() {
        E('span', {title: 'Hello'});
          T('Greetings');
        e();
      }
    });

    it('should render and update basic "Hello, World" template', () => {
      const div = window.document.createElement('div');
      const host = createHostNode(div);

      render(host, document, Template, 'World');
      expect(div.innerHTML).toEqual('<h1>Hello, World!</h1>');

      render(host, document, Template, 'New World');
      expect(div.innerHTML).toEqual('<h1>Hello, New World!</h1>');

      function Template(name: string) {
        E('h1');
          t(`Hello, ${name}!`);
        e();
      }
    });

  });
});