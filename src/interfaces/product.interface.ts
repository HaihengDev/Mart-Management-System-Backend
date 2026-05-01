export interface IProduct {
  product_id: number;
  product_name: string;
  product_image: string;
  stock: number;
  discount: number;
  price: number;
  views: number;
  rating: number;
  expiry_date: Date;
  category_id: number;
  supplier_id: number;
}
