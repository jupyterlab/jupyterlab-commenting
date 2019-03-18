import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import '../../style/index.css';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import { IActiveDataset, IConverterRegistry } from '@jupyterlab/dataregistry';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { CodeMirrorEditor } from '@jupyterlab/codemirror';

import { IMetadataPeopleService } from 'jupyterlab-metadata-service';

import { CommentingWidget } from './commenting';

export function activate(
  app: JupyterFrontEnd,
  activeDataset: IActiveDataset,
  labShell: ILabShell,
  comments: IMetadataCommentsService,
  people: IMetadataPeopleService,
  converters: IConverterRegistry,
  tracker: IEditorTracker
) {
  const commenting = new CommentingWidget(activeDataset, comments, people);

  commenting.id = 'jupyterlab-commenting:commentsUI';
  commenting.title.iconClass = 'jp-ChatIcon jp-SideBar-tabIcon';
  commenting.title.caption = 'Commenting';

  app.commands.addCommand('jupyterlab-commenting:createComment', {
    label: 'Comment',
    isEnabled: () => true,
    execute: () => {
      let widget = tracker.currentWidget;
      let editor = widget.content.editor as CodeMirrorEditor;

      labShell.expandRight();
      commenting.setNewThreadActive(true);

      console.log(editor.getSelection());
    }
  });

  app.contextMenu.addItem({
    command: 'jupyterlab-commenting:createComment',
    selector: 'body',
    rank: Infinity
  });

  labShell.add(commenting, 'right');
}
