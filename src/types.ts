/**
 * Type interface for person response from IMetadataPeopleService
 */
export interface IPerson {
  id: string;
  name: string;
  image: string;
}

/**
 * Type interface for a highlighted section of an annotation
 */
export interface IAnnotationSelection {
  end: {
    line: number;
    column: number;
  };
  start: {
    line: number;
    column: number;
  };
}

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
        selection: IAnnotationSelection;
        resolved: boolean;
        body: {
          [index: number]: { value: string; created: string; creator: IPerson };
        };
      };
    };
  };
}
