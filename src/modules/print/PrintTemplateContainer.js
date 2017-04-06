import inject from 'react-rxjs/dist/RxInject';
import store$, {
  loadTemplates$,
  renderTemplate$,
  clearAll$,
  clearRendered$,
  setTemplateId$,
  setLevel$
} from './printStore';
import { PrintTemplateComponent } from './PrintTemplateComponent';

const data = {
  store$
};

const commands = {
  clearAll$,
  clearRendered$,
  loadTemplates$,
  renderTemplate$,
  setTemplateId$,
  setLevel$
};

const props = {
  writeToDocument: (window: Window, content: string) => {
    window.document.open();
    window.document.write(content);
    window.document.close();
  }
};

export default inject(data, commands, props)(PrintTemplateComponent);
