export interface Product {
  id: number;
  title: string;
  images: Array<{ src: string }>;
}

const BASE_URL = 'http://localhost:8000/public';

export const Products: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    images: [
      { src: `${BASE_URL}/product1/1.jpg` },
      { src: `${BASE_URL}/product1/2.jpg` },
      { src: `${BASE_URL}/product1/3.jpg` },
    ],
  },
  {
    id: 2,
    title: 'Product 2',
    images: [
      { src: `${BASE_URL}/product2/1.jpg` },
      { src: `${BASE_URL}/product2/2.jpg` },
      { src: `${BASE_URL}/product2/3.jpg` },
    ],
  },
  {
    id: 3,
    title: 'Product 3',
    images: [
      { src: `${BASE_URL}/product3/1.jpg` },
      { src: `${BASE_URL}/product3/2.jpg` },
      { src: `${BASE_URL}/product3/3.jpg` },
    ],
  },
  {
    id: 4,
    title: 'Product 4',
    images: [
      { src: `${BASE_URL}/product1/1.jpg` },
      { src: `${BASE_URL}/product1/2.jpg` },
      { src: `${BASE_URL}/product1/3.jpg` },
    ],
  },
  {
    id: 5,
    title: 'Product 5',
    images: [
      { src: `${BASE_URL}/product2/1.jpg` },
      { src: `${BASE_URL}/product2/2.jpg` },
      { src: `${BASE_URL}/product2/3.jpg` },
    ],
  },
];
