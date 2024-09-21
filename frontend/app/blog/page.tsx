'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Image from 'next/image'

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
  const { isAuthenticated } = useAuth()
  const postsPerPage = 8

  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage])

  const fetchPosts = async (page: number) => {
    setIsLoading(true)
    try {
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div key={post.bltn_no} className="bg-white rounded-lg shadow-md overflow-hidden">
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
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.titl}</h2>
              <p className="text-gray-600">{post.contt}</p>
              <p className="text-sm text-gray-500 mt-2">Tags: {post.tag}</p>
              <p className="text-sm text-gray-500">Date: {new Date(post.inpt_dtm).toLocaleDateString()}</p>
              <a href={`/blog/${post.bltn_no}`} className="text-primary hover:underline mt-2 inline-block">더보기</a>
            </div>
          </div>
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
  )
}