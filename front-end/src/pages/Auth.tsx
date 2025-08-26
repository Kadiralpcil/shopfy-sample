import { useNavigate } from "react-router-dom";

import { Page, Card, Button, Text, BlockStack } from "@shopify/polaris";

const Auth = () => {
  // Hooks
  const navigate = useNavigate();
  
  // Handlers
  const handleConnect = () => {
    navigate("/home");
  };

  return (
    <Page title="Connect to Shopify">
      <Card>
        <BlockStack gap="400">
          <Text variant="headingMd" as="h2">
            Image Resizer for Social Media
          </Text>
          <Text variant="bodyMd" as="p">
            Connect your Shopify store to resize product images for social media
            platforms.
          </Text>
          <Button variant="primary" size="large" onClick={handleConnect}>
            Connect to Shopify
          </Button>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Auth;
