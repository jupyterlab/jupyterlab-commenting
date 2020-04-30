/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2019 Project Jupyter Contributors.
 * Distributed under the terms of the 3-Clause BSD License.
 */

import { Token } from '@lumino/coreutils';

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

    // NOTE: by attempting to access the following URIs, we start the commenting service backend...
    fetch(this.serviceUrl); // tslint:disable-line
    fetch(baseUrl + 'comments/'); // tslint:disable-line
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
