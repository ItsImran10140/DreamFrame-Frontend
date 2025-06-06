/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationButton = ({
  handlePrevPage,
  currentPage,
  pagination,
  handleNextPage,
}: any) => {
  return (
    <div className="p-3 border-t border-zinc-800 flex justify-between items-center">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`p-1 rounded-md ${
          currentPage === 1
            ? "text-zinc-600 cursor-not-allowed"
            : "text-zinc-400 hover:bg-zinc-800"
        }`}
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-xs text-zinc-500">
        Page {currentPage} of {pagination.pages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === pagination.pages}
        className={`p-1 rounded-md ${
          currentPage === pagination.pages
            ? "text-zinc-600 cursor-not-allowed"
            : "text-zinc-400 hover:bg-zinc-800"
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default PaginationButton;
