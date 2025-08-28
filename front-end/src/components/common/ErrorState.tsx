import { 
  Banner, 
  Button, 
  Card, 
  Text, 
  BlockStack,
  InlineStack 
} from '@shopify/polaris';

interface ErrorStateProps {
  error: {
    message: string;
    type: 'network' | 'api' | 'validation' | 'unknown';
    retryable: boolean;
    retryCount: number;
  };
  onRetry?: () => void;
  onDismiss?: () => void;
  maxRetries?: number;
}

const ErrorState= ({
  error,
  onRetry,
  onDismiss,
  maxRetries = 3
} : ErrorStateProps) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network': return '📡';
      case 'api': return '⚠️';
      case 'validation': return '❌';
      default: return '🔧';
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network': return 'Connection Problem';
      case 'api': return 'Server Error';
      case 'validation': return 'Invalid Input';
      default: return 'Something Went Wrong';
    }
  };

  const getErrorDescription = () => {
    switch (error.type) {
      case 'network': return 'Please check your internet connection and try again.';
      case 'api': return 'Our servers are having trouble. Please try again.';
      case 'validation': return 'Please check your input and try again.';
      default: return 'We encountered an unexpected problem.';
    }
  };

  return (
    <Card>
      <BlockStack gap="400">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {getErrorIcon()}
          </div>
          <Text variant="headingMd" as="h3">
            {getErrorTitle()}
          </Text>
          <Text variant="bodyMd" as="p" tone="subdued">
            {getErrorDescription()}
          </Text>
          <Text variant="bodySm" as="p" tone="subdued">
            {error.message}
          </Text>
        </div>

        <InlineStack gap="200" align="center">
          {error.retryable && error.retryCount < maxRetries && onRetry && (
            <Button onClick={onRetry} variant="primary">
              {error.retryCount > 0 
                ? `Retry (${error.retryCount}/${maxRetries})` 
                : 'Try Again'
              }
            </Button>
          )}
          {onDismiss && (
            <Button onClick={onDismiss} variant="tertiary">
              Dismiss
            </Button>
          )}
        </InlineStack>

        {error.retryCount >= maxRetries && (
          <Banner tone="critical">
            <Text variant="bodySm" as="p">
              Maximum retry attempts reached. Please contact support if the problem persists.
            </Text>
          </Banner>
        )}
      </BlockStack>
    </Card>
  );
};

export default ErrorState;