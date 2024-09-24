"use client"

import { useState, forwardRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Jodit } from 'jodit-react'
import { useAuth } from '../app/contexts/AuthContext'

const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
})

export const JoditEditor = forwardRef<Jodit, any>(({ handleSave }, ref) => {
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const { accessToken } = useAuth()

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
      "source", "|",
      "bold", "strikethrough", "underline", "italic", "|",
      "ul", "ol", "|",
      "outdent", "indent", "|",
      "font", "fontsize", "brush", "paragraph", "|",
      "image", "video", "table", "link", "|",
      "align", "undo", "redo", "|",
      "hr", "eraser", "copyformat", "|",
      "symbol", "fullsize", "print", "about"
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    removeButtons: ["file", "update"],
  }

  const handleFileUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('docKnd', 'ETC')
    formData.append('atchRefNo', '')
    formData.append('atchRefSubNo1', 'COMMUNITY')
    formData.append('inptPgm', '')
    formData.append('docTitl', '개발자_커뮤니티')
    formData.append('atchRefNoCls', 'ETC')
    formData.append('inptUsrCls', 'CUSTOMER')

    try {
      const response = await fetch('http://localhost:9010/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedImageUrl(data.url) // 업로드된 이미지 URL 설정
        console.log('File uploaded successfully:', data)
      } else {
        console.error('File upload failed')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <DynamicJoditEditor
        ref={ref}
        value={content}
        config={config as any}
        onBlur={(newContent: string) => setContent(newContent)}
      />
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
        className="mt-4"
      />
      <Button 
        className="mt-4"
        onClick={handleFileUpload}
      >
        파일 업로드
      </Button>
      {uploadedImageUrl && (
        <div className="mt-4">
          <img src={uploadedImageUrl} alt="Uploaded" />
        </div>
      )}
      <Button 
        className="mt-4"
        onClick={handleSave}
      >
        저장
      </Button>
    </div>
  )
})

JoditEditor.displayName = 'JoditEditor'