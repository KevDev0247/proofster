import { IMetadata } from "../models/metadata";
import { IWorkspace } from "../models/workspace";

export const MetadataService = () => {
  
  const aggregateData = (
    metadataList: IMetadata[], 
    workspaceList: IWorkspace[]
  ): IMetadata[] => {
    const metadataDisplay = metadataList.map((m) => {
      const matchingRecord = workspaceList.find((w) => w.id === m.workspace_id);
      return {
        ...m,
        workspace_name: matchingRecord?.name || "",
      }
    });

    workspaceList.forEach((w) => {
      const matchingRecord = metadataList.find((m) => m.workspace_id === w.id);
      if (!matchingRecord) {
        metadataDisplay.push({
          workspace_id: w.id,
          workspace_name: w.name,
          is_empty: true,
          is_transpiled: false,
          all_normalized: false,
          is_preprocessed: false
        })
      }
    });
    metadataDisplay.sort((a, b) => {
      if (!a.is_transpiled && !a.is_empty) {
        return -1;
      } else if (a.all_normalized && a.is_preprocessed) {
        return -1;
      } else {
        return 1;
      }
    });
    return metadataDisplay;
  };

  return {
    aggregateData,
  }
};
