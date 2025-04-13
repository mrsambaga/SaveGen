export type Transaction = {
  id: string;
  date: string;
  description: string;
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
