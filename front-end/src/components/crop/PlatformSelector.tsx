import { Select } from "@shopify/polaris";

interface Platform {
  label: string;
  value: string;
  width: number;
  height: number;
}

interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

const PlatformSelector = ({ 
  platforms, 
  selectedPlatform, 
  onPlatformChange 
}: PlatformSelectorProps) => {
  return (
    <Select
      label="Select Platform"
      options={platforms.map((platform) => ({
        label: `${platform.label} (${platform.width}x${platform.height})`,
        value: platform.value,
      }))}
      value={selectedPlatform}
      onChange={onPlatformChange}
    />
  );
};

export default PlatformSelector;