import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';

export class NotebookIndicators extends Widget {
  constructor() {
    super();
  }

  protected onActivateRequest(msg: Message): void {
    console.log('NOTEBOOK INDICATORS ACTIVE');
  }

  protected onCloseRequest(msg: Message): void {
    console.log('NOTEBOOK INDICATORS CLOSE');
  }
}
