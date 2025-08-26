import { Page } from '@shopify/polaris';
import ProductList from '../components/ProductList/ProductList';

const Home = () => {
  return (
    <Page title="Product List">
      <ProductList />
    </Page>
  );
};

export default Home;