'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Image from 'next/image'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress' // Progress 컴포넌트 임포트
import { Badge } from '@/components/ui/badge' // Badge 컴포넌트 임포트

interface BlogPost {
  bltn_no: string;
  titl: string;
  contt: string;
  thumbnail_img_url: string;
  tag: string;
  inpt_dtm: string;
}
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const { isAuthenticated } = useAuth()
  const postsPerPage = 8

  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage])

  const fetchPosts = async (page: number) => {
    setIsLoading(true)
    setProgress(0)
    try {
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      const response = await fetch(`/api/blog?page=${page}&limit=${postsPerPage}`)
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data.blogs)
      setTotalPages(Math.ceil(data.total / postsPerPage))
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const pageNumbers = []
  const pageGroupSize = 5
  const currentGroup = Math.ceil(currentPage / pageGroupSize)
  const startPage = (currentGroup - 1) * pageGroupSize + 1
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages)

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  const handlePreviousGroup = () => {
    setCurrentPage(Math.max(startPage - pageGroupSize, 1))
  }

  const handleNextGroup = () => {
    setCurrentPage(Math.min(startPage + pageGroupSize, totalPages))
  }

  if (!isAuthenticated) {
    return <div>Please log in to view the blog posts.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-center">로딩 중... {progress}%</p>
        </div>
      ) : (
        <div className="show-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Card key={post.bltn_no} className="flex flex-col">
                <CardHeader>
                  {post.thumbnail_img_url ? (
                    <Image 
                      src={post.thumbnail_img_url} 
                      alt={post.titl} 
                      width={500} 
                      height={300} 
                      className="w-full h-48 object-cover" 
                    />
                  ) : (
                    <div 
                      className="w-full h-48 bg-gray-300 flex items-center justify-center"
                      style={{ backgroundImage: 'url(/placeholder.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      <span className="text-white text-2xl">기본 이미지</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <h2 className="text-xl font-semibold mb-2">{post.titl}</h2>
                  <p className="text-gray-600">{post.contt}</p>
                  <div className="flex gap-2 mt-2">
                    {post.tag ? post.tag.split(',').map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    )) : null}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Date: {new Date(post.inpt_dtm).toLocaleDateString()}</p>
                  <a href={`/blog/${post.bltn_no}`} className="text-primary hover:underline mt-2 inline-flex items-center">
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20h9M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z"></path>
                    </svg>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={handlePreviousGroup}
              disabled={startPage === 1}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronsLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 5, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 5, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextGroup}
              disabled={endPage === totalPages}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronsRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}