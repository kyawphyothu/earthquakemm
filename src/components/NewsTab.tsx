"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { NewsCollection, NewsItem } from "@/types/news";

interface NewsTabProps {
  newsData: NewsCollection;
}

export default function NewsTab({ newsData }: NewsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  // Get current items for this page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsData.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">
          Updates and news about the earthquake happening in Myanmar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <>
          {/* News items for current page */}
          {currentItems.map((item: NewsItem, index: number) => (
            <div
              key={indexOfFirstItem + index}
              className={`flex flex-col ${
                index % 2 === 1 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-6`}
            >
              <div className="md:w-1/2 rounded-lg overflow-hidden">
                <div className="aspect-[3/4] md:aspect-video bg-zinc-200 flex items-center justify-center relative">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={`News image ${indexOfFirstItem + index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0 && currentPage === 1}
                    />
                  )}
                </div>
              </div>
              <div className="md:w-1/2 flex flex-col justify-center">
                <p className="text-muted-foreground mb-3">{item.date}</p>
                <p>{item.content}</p>
              </div>
            </div>
          ))}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {pageNumbers.map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      </CardContent>
    </Card>
  );
}
