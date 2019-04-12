/**
 * Type interface for person response from IMetadataPeopleService
 */
export interface IPerson {
  id: string;
  name: string;
  image: string;
}

/**
 * Type interface for a text editor commenting indicator
 */
export interface ITextIndicator {
  end: {
    line: number;
    column: number;
  };
  start: {
    line: number;
    column: number;
  };
}

export interface INotebookIndicator {}

/**
 * Type interface for annotations response from IMetadataCommentsService
 */
export interface IAnnotationResponse {
  data: {
    annotationsByTarget: {
      [index: number]: {
        id: string;
        target: string;
        context: string;
        label: string;
        total: number;
        indicator: ITextIndicator;
        resolved: boolean;
        body: {
          [index: number]: { value: string; created: string; creator: IPerson };
        };
      };
    };
  };
}
