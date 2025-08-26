import { Page, Card, Text } from "@shopify/polaris";

const Home = () => {
  return (
    <Page title="Product List">
      <Card>
        <Text variant="headingMd" as="h2">
          Welcome! Product list will be here.
        </Text>
      </Card>
    </Page>
  );
};

export default Home;
