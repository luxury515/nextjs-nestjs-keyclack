'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface BlogPost {
  id: number
  title: string
  content: string
  tags: string[]
  publishDate: string
}

export function BlogListPageComponent() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      // Simulate API call with progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Simulated data
      const data: BlogPost[] = [
        { id: 1, title: "React Hooks 완벽 가이드", content: "React Hooks를 사용하여 함수형 컴포넌트의 기능을 확장하는 방법을 알아봅니다.", tags: ["React", "Hooks", "JavaScript"], publishDate: "2023-06-15" },
        { id: 2, title: "Next.js로 SEO 최적화하기", content: "Next.js를 사용하여 웹사이트의 검색 엔진 최적화를 개선하는 방법을 설명합니다.", tags: ["Next.js", "SEO", "Web Development"], publishDate: "2023-06-10" },
        { id: 3, title: "TypeScript 기초부터 고급까지", content: "TypeScript의 기본 개념부터 고급 기능까지 단계별로 학습해봅시다.", tags: ["TypeScript", "JavaScript", "Programming"], publishDate: "2023-06-05" },
      ]

      setPosts(data)
      setLoading(false)
    }

    fetchPosts()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">블로그 포스트</h1>
      
      {loading ? (
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-center">로딩 중... {progress}%</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{post.publishDate}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}