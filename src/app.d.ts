/**
 * Type interface for person response from IMetadataPeopleService
 */
export interface IPerson {
  id: string;
  name: string;
  image: string;
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
        resolved: boolean;
        body: {
          [index: number]: { value: string; created: string; creator: IPerson };
        };
      };
    };
  };
}
