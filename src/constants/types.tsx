export type Transaction = {
  id: string;
  date: string;
  detail: string;
  amount: number;
  transaction_type: string;
  transaction_category: string;
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
  | 'foodanddrink'
  | 'shopping'
  | 'education'
  | 'family'
  | 'entertainment'
  | 'health';
