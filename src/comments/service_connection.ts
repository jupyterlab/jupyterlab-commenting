import { Token } from '@phosphor/coreutils';

import { PageConfig } from '@jupyterlab/coreutils';

import { JupyterFrontEnd } from '@jupyterlab/application';

export const ICommentingServiceConnection = new Token<
  ICommentingServiceConnection
>('@jupyterlab/commenting-service:ICommentingServiceConnection');

export interface ICommentingServiceConnection {
  query(database: string): Promise<Response>;
}

class CommentingServiceConnection implements ICommentingServiceConnection {
  serviceUrl: string;

  constructor() {
    console.log('Starting commenting service', PageConfig);

    let baseUrl = PageConfig.getBaseUrl();

    this.serviceUrl = baseUrl + 'commenting-service/';

    fetch(this.serviceUrl);
    fetch(baseUrl + 'comments/');
  }

  query(request: string): Promise<Response> {
    let info = fetch(this.serviceUrl + request);

    return info;
  }
}

export function activateCommentingServiceConnection(
  app: JupyterFrontEnd
): ICommentingServiceConnection {
  return new CommentingServiceConnection();
}
