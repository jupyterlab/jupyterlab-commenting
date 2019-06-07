import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

export class CommentsService {
  constructor(browserFactory: IFileBrowserFactory) {
    this._browserFactory = browserFactory;

    this._commentsStore = {};
    this._personStore = {};
    this._nextCommentId = 0;
    this._nextPersonId = 0;

    this.createJSONFile();
    this.loadJSON();
  }

  createThread(target: string, value: string, creator: IPerson): void {
    if (!this._commentsStore[target]) {
      this._commentsStore[target] = [];
    }

    let created = new Date().toISOString();

    this._commentsStore[target].push({
      id: 'anno/' + this._nextCommentId,
      total: 1,
      resolved: false,
      body: [
        { value: value, created: created, creator: creator, edited: false }
      ]
    });

    this._nextCommentId++;

    this.writeJSON();
  }

  createComment(
    target: string,
    threadId: string,
    value: string,
    creator: IPerson
  ): void {
    let thread = this.getThread(target, threadId);
    let created = new Date().toISOString();

    thread.body.push({
      value: value,
      created: created,
      creator: creator,
      edited: false
    });

    thread.total++;

    this.writeJSON();
  }

  deleteComment(target: string, threadId: string, index: number): void {
    let thread = this.getThread(target, threadId);

    thread.body.splice(index, 1);
    thread.total--;

    this.writeJSON();
  }

  editComment(
    target: string,
    threadId: string,
    value: string,
    index: number
  ): void {
    let thread = this.getThread(target, threadId);
    let commentBody = thread.body[index];
    let created = new Date().toISOString();

    commentBody.value = value;
    commentBody.edited = true;
    commentBody.created = created;

    this.writeJSON();
  }

  editThread(target: string, threadId: string, value: string): void {
    let thread = this.getThread(target, threadId);
    let threadBody = thread.body[0];
    let created = new Date().toISOString();

    threadBody.value = value;
    threadBody.edited = true;
    threadBody.created = created;

    this.writeJSON();
  }

  setResolvedValue(target: string, threadId: string, state: boolean): void {
    let thread = this.getThread(target, threadId);

    thread.resolved = state;

    this.writeJSON();
  }

  getThreadsByTarget(target: string): any {
    return this._commentsStore[target];
  }

  createPerson(name: string, image: string): string {
    let id = 'person/' + this._nextPersonId;

    this._personStore[id] = { name: name, image: image };
    this._nextPersonId++;
    this.writeJSON();

    return id;
  }

  getAllPersons(): any {
    return this._personStore;
  }

  createJSONFile(): void {
    let contents = this._browserFactory.defaultBrowser.model.manager.services
      .contents;

    // Attempt to get 'comments.json', if failure, create it
    contents.get(this._storePath).catch(err => {
      let initialData = {
        comments: this._commentsStore,
        persons: this._personStore
      };

      let initial = JSON.stringify(initialData);

      contents
        .save(this._storePath, {
          name: this._storePath,
          content: initial,
          type: 'file',
          format: 'text'
        })
        .catch(err =>
          console.error('Error on comments.json initial creation', err)
        );
    });
  }

  loadJSON(): void {
    let contents = this._browserFactory.defaultBrowser.model.manager.services
      .contents;

    contents
      .get(this._storePath)
      .then(file => {
        let data = JSON.parse(file.content);

        this._commentsStore = data.comments;
        this._personStore = data.persons;

        this._nextPersonId = Object.keys(data.persons).length;

        Object.keys(data.comments).forEach(key => {
          this._nextCommentId += data.comments[key].length;
        });
      })
      .catch(err => console.error('Error parsing comments.json', err));
  }

  writeJSON(): void {
    let contents = this._browserFactory.defaultBrowser.model.manager.services
      .contents;

    let allData = { comments: this._commentsStore, persons: this._personStore };

    let newData = JSON.stringify(allData);

    contents
      .save(this._storePath, {
        name: this._storePath,
        content: newData,
        type: 'file',
        format: 'text'
      })
      .catch(err => console.error('Error writing to comments.json', err));
  }

  private getThread(target: string, threadId: string): any {
    let threads = this._commentsStore[target];

    for (let i = 0; i < threads.length; i++) {
      if (threads[i].id === threadId) {
        return threads[i];
      }
    }
  }

  private _browserFactory: IFileBrowserFactory;
  private _commentsStore: any;
  private _personStore: any;
  private _nextCommentId: number;
  private _nextPersonId: number;
  private readonly _storePath = 'comments.json';
}

export interface IAnnotationResponse {
  data: {
    [index: number]: {
      id: string;
      target: string;
      total: number;
      resolved: boolean;
      body: {
        [index: number]: {
          value: string;
          created: string;
          creator: IPerson;
          edited: boolean;
        };
      };
    };
  };
}

export interface IPerson {
  id: string;
  name: string;
  image: string;
}

export interface ITextIndicator {
  initial: {
    end: {
      line: number;
      column: number;
    };
    start: {
      line: number;
      column: number;
    };
    context: string;
  };
  current: {
    end: {
      line: number;
      column: number;
    };
    start: {
      line: number;
      column: number;
    };
    context: string;
  };
}

export interface INotebookIndicator {}
