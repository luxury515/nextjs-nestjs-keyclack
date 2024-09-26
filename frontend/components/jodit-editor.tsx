"use client";

import { useState, forwardRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Jodit } from "jodit-react";

const DynamicJoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
interface JoditEditorProps {
  handleSave: (content: string) => void;
}
export const JoditEditor = forwardRef<Jodit, JoditEditorProps>(
  ({ handleSave }, ref) => {
    const [content, setContent] = useState("");

    const config = {
      readonly: false,
      height: 400,
      toolbar: true,
      spellcheck: false,
      language: "en",
      toolbarButtonSize: "middle", // "medium"을 "middle"로 수정
      toolbarAdaptive: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      //defaultActionOnPaste: "insert_clear_html",
      buttons: [
        "source",
        "|",
        "bold",
        "strikethrough",
        "underline",
        "italic",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "video",
        "table",
        "link",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "symbol",
        "fullsize",
        "print",
        "about",
      ],
      uploader: {
        insertImageAsBase64URI: false,
        url: "http://localhost:9010/api/files/upload",
        format: "json",
        method: "POST",
        prepareData: (formData: FormData) => {
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
          return formData;
        },
        isSuccess: (response: any) => {
          return (
            response.code === 200 &&
            Array.isArray(response.data) &&
            response.data.length > 0
          );
        },
        process: (response: any) => {
          if (response.data && response.data[0] && response.data[0].docNo) {
            const docNo = response.data[0].docNo;
            return {
              files: [
                `http://localhost:9010/api/open/files/downloadImage?langType=EN&docNo=${docNo}`,
              ],
            };
          }
          return { files: [] };
        },
        events: {
          beforeUpload: (files: File[]) => {
            console.log("업로드 시작:", files);
            return true; // false를 반환하면 업로드가 취소됩니다.
          },
          uploadProgress: (progress: number) => {
            console.log("업로드 진행률:", progress);
          },
          error: (e: Error) => {
            console.error("업로드 오류:", e.message);
          },
          afterUpload: (response: any) => {
            console.log("업로드 완료:", response);
          },
        },
      },
      removeButtons: ["file", "update"],
    };
    const handleChange = useCallback((newContent: string) => {
      setContent(newContent);
    }, []);
    return (
      <div className="container mx-auto">
        <DynamicJoditEditor
          ref={ref}
          value={content}
          config={config}
          onBlur={handleChange}
        />
        <Button className="mt-4" onClick={handleSave}>
          저장
        </Button>
      </div>
    );
  }
);

JoditEditor.displayName = "JoditEditor";
