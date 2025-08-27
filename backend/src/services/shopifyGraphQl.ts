import dotenv from 'dotenv';

dotenv.config();

// GraphQL Response Types
interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

interface ProductImage {
  id: string;
  originalSrc: string;
  altText: string | null;
  width: number;
  height: number;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
}

interface ProductsResponse {
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

interface ProductResponse {
  product: Product | null;
}

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/graphql.json`;

const graphQLRequest = async <T>(query: string, variables?: any): Promise<GraphQLResponse<T>> => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const data = await response.json() as GraphQLResponse<T>;

  if (data.errors) {
    throw new Error(`GraphQL Error: ${data.errors[0].message}`);
  }

  return data;
};

export const getProducts = async (limit = 10) => {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            images(first: 10) {
              edges {
                node {
                  id
                  originalSrc
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await graphQLRequest<ProductsResponse>(query, { first: limit });
  return response.data.products;
};

export const getProduct = async (id: string) => {
  const gqlId = id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`;
  
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        images(first: 20) {
          edges {
            node {
              id
              originalSrc
              altText
              width
              height
            }
          }
        }
      }
    }
  `;

  const response = await graphQLRequest<ProductResponse>(query, { id: gqlId });
  return response.data.product;
};

export const extractNumericId = (gqlId: string): number => {
  return parseInt(gqlId.split('/').pop() || '0');
};