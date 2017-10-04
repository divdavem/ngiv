import {createWindow} from 'domino';
import {render, createHostNode, ec, ee, tc} from '../../src/iv';

describe('iv integration test', () => {

  var window = createWindow('', 'http://localhost');
  var document = window.document;

  describe('render', () => {
    it('should render basic template', () => {
      var div = window.document.createElement('div');
      render(createHostNode(div), document, Template, {});
      expect(div.innerHTML).toEqual('<span title="Hello">Greetings</span>');
  
      function Template() {
        ec('span', {title: 'Hello'});
          tc('Greetings');
        ee();
      }
    });
  });
});