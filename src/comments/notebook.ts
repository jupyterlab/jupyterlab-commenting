import { Message } from '@phosphor/messaging';
import { IndicatorWidget } from './indicator';
import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';
import { CommentingDataProvider } from './provider';
import { CommentingDataReceiver } from './receiver';
import { Widget } from '@phosphor/widgets';

export class NotebookIndicators extends Widget implements IndicatorWidget {
  private _app: JupyterFrontEnd;
  private _labShell: ILabShell;
  private _receiver: CommentingDataReceiver;
  private _provider: CommentingDataProvider;

  constructor(
    app: JupyterFrontEnd,
    labShell: ILabShell,
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver
  ) {
    super();
    this._app = app;
    this._labShell = labShell;
    this._provider = provider;
    this._receiver = receiver;

    this._provider;
    this._app;
    this._labShell;
    this._receiver;
    // this.markSelections = this.markSelections.bind(this);
  }

  protected onActivateRequest(msg: Message): void {
    console.log('NOTEBOOK INDICATORS ACTIVE');
  }

  protected onCloseRequest(msg: Message): void {
    console.log('NOTEBOOK INDICATORS CLOSE');
  }
  openCommenting(): void {
    throw new Error('Method not implemented.');
  }
  openNewThread(): void {
    throw new Error('Method not implemented.');
  }
  focusThread(threadId: string): void {
    throw new Error('Method not implemented.');
  }
  scrollIntoView(threadId: string): void {
    throw new Error('Method not implemented.');
  }
  getCurrentIndicatorInfo():
    | import('../types').ITextIndicator
    | import('../types').INotebookIndicator {
    throw new Error('Method not implemented.');
  }
  putIndicators(): void {}

  clearAllIndicators(): void {
    throw new Error('Method not implemented.');
  }
}
