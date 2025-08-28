import { Pagination } from "@shopify/polaris";

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const PaginationControls = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onNextPage,
  onPreviousPage
}: PaginationControlsProps) => {
  if (totalItems <= itemsPerPage) {
    return null;
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "20px",
    }}>
      <Pagination
        hasPrevious={currentPage > 1}
        onPrevious={onPreviousPage}
        hasNext={currentPage * itemsPerPage < totalItems}
        onNext={onNextPage}
      />
    </div>
  );
};

export default PaginationControls;