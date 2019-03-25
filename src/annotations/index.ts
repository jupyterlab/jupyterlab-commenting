import { Annotation } from './annotation';

import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

export function activateAnnotations(
  app: JupyterFrontEnd,
  labShell: ILabShell,
  tracker: IEditorTracker
) {
  console.log('Annotations Activated');
  const annotationWidget = new Annotation(app, labShell, tracker);
  annotationWidget.id = 'jupyterlab-commenting:annotation';
  annotationWidget.activate();
}
