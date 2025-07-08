type LookupType = {
  label: string;
  value: string;
};

interface DataItem {
  id: string;
  type: LookupType | null;
  image: string;
  description: string;
  location: string;
  date: string;
  status: string;
  [key: string]: any;
}

interface SummaryItem {
  found: number;
  lost: number;
  returned: number;
  reviewing: number;
  matched: number
}
