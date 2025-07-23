interface DataItemInfo {
  id: string;
  item_type: string;
  description: string;
  location: string;
  datetime: string;
  found_by: string;
  note: string;
  create_by: string;
  status: string;
  imageUrl: string;
  type: string;
  hasCampain: boolean;
  [key: string]: string | number | boolean;
}

interface SummaryItemInfo {
  found: number;
  lost: number;
  returned: number;
  reviewing: number;
  matched: number;
}

interface CampainInfo {
  id: string;
  caseId: string;
  subject: string;
  description: string;
  datetime: string;
  create_by: string;
  imageUrl: string;
}

interface DataItemType {
  [key: string]: string | number | boolean
}