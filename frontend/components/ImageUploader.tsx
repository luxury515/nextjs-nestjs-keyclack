"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface ImageUploaderComponentProps {
  onImageUpload: (imageUrl: string) => void;
}

export function ImageUploaderComponent({
  onImageUpload,
}: Readonly<ImageUploaderComponentProps>) {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();

      formData.append(
        "dtoFile",
        JSON.stringify({
          docKnd: "ETC",
          atchRefNo: "",
          atchRefSubNo1: "COMMUNITY",
          inptPgm: "",
          docTitl: "BLOG_CREATE",
          atchRefNoCls: "ETC",
          inptUsrCls: "CUSTOMER",
        })
      );
      formData.append("langType", "KO");
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:9010/api/files/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Response data:", responseData);

          if (
            responseData.code === 200 &&
            Array.isArray(responseData.data) &&
            responseData.data.length > 0
          ) {
            const docNo = responseData.data[0].docNo;
            if (docNo) {
              const newImageUrl = `http://localhost:9010/api/open/files/downloadImage?langType=EN&docNo=${docNo}`;
              setImages((prevImages) => [...prevImages, newImageUrl]);
              onImageUpload(newImageUrl);
            } else {
              console.error("docNo is missing in the response");
            }
          } else {
            console.error("Unexpected data structure:", responseData);
          }
        } else {
          console.error("File upload failed");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleAddMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 이벤트 기본 동작 방지
    e.stopPropagation(); // 이벤트 버블링 방지
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full pb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        ref={fileInputRef}
      />
      <div className="flex flex-wrap gap-4 mb-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image}
              alt={`업로드된 이미지 ${index + 1}`}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded"
            />
            <button
              onClick={() => handleDeleteImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <Button onClick={handleAddMoreClick}>
        {images.length > 0 ? "이미지 추가" : "이미지 선택"}
      </Button>
    </div>
  );
}
