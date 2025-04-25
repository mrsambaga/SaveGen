export type Transaction = {
  id: string;
  date: string;
  detail: string;
  amount: number;
  type: string;
  category: string;
};

export type ChartDataItem = {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

export type IconCategoryName =
  | 'salary'
  | 'groceries'
  | 'bills'
  | 'rent'
  | 'travel'
  | 'transportation'
  | 'food&drink'
  | 'shopping'
  | 'education'
  | 'family'
  | 'entertainment'
  | 'health';
