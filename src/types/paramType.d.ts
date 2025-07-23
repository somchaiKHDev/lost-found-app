interface FilterItemParam {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page: number;
  limit: number;
}

interface AddCampainsParam {
  caseId: string;
  subject: string;
  description: string;
  datetime: string;
  create_by: string;
  imageUrl: string;
  type: string;
}

interface AddLostFoundItemparam {
  fullname: string;
  contact_phone: string;
  item_type: string;
  description: string;
  location: string;
  datetime: string;
  note: string;
  create_by: string;
}
