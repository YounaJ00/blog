import { useMemo } from "react";

export default function Pagination({
  pageRange,
  currentPage,
  maxPage,
  onPageChange,
}: {
  papageRange: number;
  currentPage: number;
  maxPage: number;
  onPageChange: (page: number) => void;
}) {
  const half = Math.floor(pageRange / 2);
  const pages = useMemo(() => {
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = Math.min(maxPage, pageRange); // 최소값
    }

    if (end > maxPage) {
      end = maxPage;
      start = Math.max(1, maxPage - pageRange + 1);
    }

    const arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  }, [currentPage, half, maxPage, pageRange]);
  return (
    <>
      
    </>
  );
}
