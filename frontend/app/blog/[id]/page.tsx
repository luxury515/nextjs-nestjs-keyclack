'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import TagInput from '@/components/ui/TagInput'

// 동적 import로 ReactQuill을 불러옵니다.
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface BlogPost {
  bltn_no: string;
  titl: string;
  contt: string;
  thumbnail_img_url: string;
  tag: string;
  inpt_dtm: string;
}

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const { isAuthenticated } = useAuth()
  const params = useParams()
  const id = params.id as string


  const fetchPost = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'GET' // 추가된 부분
      })
      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }
      const data = await response.json()
      setPost(data)
      setTags(data.tag ? data.tag.split(',') : [])
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setIsLoading(false)
    }
  }, [id]) // 추가된 부분

  useEffect(() => {
    if (isAuthenticated) {
      fetchPost()
    }
  }, [fetchPost, id, isAuthenticated])


  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...post, tag: tags.join(',') }),
      })
      if (!response.ok) {
        throw new Error('Failed to save post')
      }
      setIsEditing(false)
      fetchPost() // 저장 후 다시 데이터를 가져와서 화면을 업데이트
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    if (post) {
      setPost({ ...post, [field]: value })
    }
  }

  if (!isAuthenticated) {
    return <div>Please log in to view this blog post.</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!post) {
    return <div>Blog post not found.</div>
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
    <div className="container mx-auto p-4">
      {isEditing ? (
        <input
          type="text"
          value={post.titl}
          onChange={(e) => handleChange('titl', e.target.value)}
          className="text-xl font-bold mb-4 w-full border border-gray-300 rounded p-2"
        />
      ) : (
        <h1 className="text-3xl font-bold mb-4">{post.titl}</h1>
      )}
      {post.thumbnail_img_url ? (
        <Image 
          src={post.thumbnail_img_url} 
          alt={post.titl} 
          width={800} 
          height={400} 
          className="w-full h-64 object-cover mb-4" 
        />
      ) : (
        <div 
          className="w-full h-64 bg-gray-300 flex items-center justify-center mb-4"
          style={{ backgroundImage: 'url(/placeholder.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <span className="text-white text-2xl">기본 이미지</span>
        </div>
      )}
      {isEditing ? (
        <input
          type="text"
          value={post.thumbnail_img_url}
          onChange={(e) => handleChange('thumbnail_img_url', e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded p-2"
        />
      ) : null}
      <div className="mb-4">
        {isEditing ? (
          <Button onClick={handleSave}>저장</Button>
        ) : (
          <Button onClick={handleEdit}>수정</Button>
        )}
      </div>
      {isEditing ? (
        <>
        <div className='mb-7'>
          <ReactQuill
            theme="snow"
            value={post.contt}
            onChange={(value) => handleChange('contt', value)}
            modules={modules}
            formats={formats}
            style={{ height: '20rem' }}
            className="mb-7"
          />
        </div>
        <div className='mt-20 mb-7'>
          <TagInput tags={tags} setTags={setTags}/>
        </div>
        </>
      ) : (
        <>
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: post.contt }} />
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">태그:</h3>
          <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
      <p className="text-sm text-gray-500">Date: {new Date(post.inpt_dtm).toLocaleDateString()}</p>
    </div>
  )
}