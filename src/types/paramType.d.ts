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
  imageUrl: string
}
