'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '../../contexts/AuthContext'
import 'react-quill/dist/quill.snow.css'
import TagInput from '@/components/TagInput'
import { Switch } from '@/components/ui/switch'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function CreateBlogPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isPublished, setIsPublished] = useState(false)
  const { accessToken } = useAuth()

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

  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'header', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video'
  ];

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
          <ReactQuill 
            value={content} 
            onChange={setContent} 
            modules={modules} 
            formats={formats} 
            style={{ height: '10rem' }}
          />
        </div>
        
        <div className="mt-20 mb-4">
          <div className="flex flex-wrap">  
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              Tags
            </label>
            <TagInput tags={tags} setTags={setTags} />
          </div>
        </div>
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
