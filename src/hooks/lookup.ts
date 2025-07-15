import { ItemTypeLabels, ItemTypes } from "../enums/itemTypeEnum";
import { ItemStatuses, ItemStatusLabels } from "../enums/itemStatusEnum";

export const ItemTypeLookups = () => {
  const lookups = ItemTypes.map((item) => {
    return {
      label: ItemTypeLabels[item],
      value: item,
    } as LookupType;
  });

  return lookups;
};

export const ItemStatusLookups = (excludes?: string[]) => {
  const lookups = ItemStatuses.map((item) => {
    return {
      label: ItemStatusLabels[item],
      value: item,
    } as LookupType;
  });

  if (excludes && excludes.length > 0) {
    return lookups.filter((lookup) => !excludes.includes(lookup.value));
  }

  return lookups;
};
