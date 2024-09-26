'use client'

import { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import TagInput from '@/components/ui/TagInput'
import { Switch } from '@/components/ui/switch'
import { JoditEditor } from '@/components/jodit-editor'
import { ImageUploaderComponent } from '@/components/ImageUploader'

export default function CreateBlogPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isPublished, setIsPublished] = useState(false)
  const { accessToken } = useAuth()
  const editorRef = useRef(null)

  const handleImageUpload = (imageUrl: string) => {
    setThumbnailUrl(imageUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        titl: title,
        contt: content,
        thumbnail_img_url: thumbnailUrl,
        tag: tags.join(','),
        pstg_yn: isPublished ? 'Y' : 'N'
      })
    })

    if (response.ok) {
      window.location.href = '/blog'
    } else {
      console.error('Failed to create blog post')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Create New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnailUrl">
            Thumbnail URL
          </label>
          <input
            id="thumbnailUrl"
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Content
          </label>
          <JoditEditor 
            ref={editorRef}
            onChange={(newContent: string) => setContent(newContent)}
          />
        </div>
        <div className="mt-4 mb-4">
          <div className="flex flex-wrap">  
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              Tags
            </label>
            <TagInput tags={tags} setTags={setTags} />
          </div>
        </div>
        <ImageUploaderComponent onImageUpload={handleImageUpload} />
        <div className="mb-4">
          <div className="flex items-center">
            <label className="block text-gray-700 text-sm font-bold mb-2 mr-2" htmlFor="isPublished">
              게시여부
            </label>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}
