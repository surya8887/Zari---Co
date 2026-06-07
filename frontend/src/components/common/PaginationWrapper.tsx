import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationWrapperProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationWrapper = ({
  page,
  totalPages,
  onPageChange,
}: PaginationWrapperProps) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-12 select-none flex justify-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
          <PaginationItem key={pNum}>
            <PaginationLink
              isActive={page === pNum}
              onClick={() => onPageChange(pNum)}
            >
              {pNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationWrapper;
