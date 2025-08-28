import React from "react";
import {
  Card,
  Spinner,
  Text,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText,
} from "@shopify/polaris";

interface LoadingStateProps {
  type?: "spinner" | "skeleton";
  message?: string;
  progress?: number;
  step?: string;
  size?: "small" | "large";
}

const LoadingState: React.FC<LoadingStateProps> = ({
  type = "spinner",
  message = "Loading...",
  step,
  size = "large",
}) => {
  if (type === "skeleton") {
    return (
      <SkeletonPage primaryAction>
        <Card>
          <SkeletonDisplayText size="small" />
          <SkeletonBodyText />
        </Card>
        <Card>
          <SkeletonBodyText lines={3} />
        </Card>
      </SkeletonPage>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <Spinner size={size} />
      </div>
      <Text variant="headingMd" as="h3">
        {message}
      </Text>
      {step && (
        <Text variant="bodyMd" as="p" tone="subdued">
          {step}
        </Text>
      )}
    </div>
  );
};

export default LoadingState;
