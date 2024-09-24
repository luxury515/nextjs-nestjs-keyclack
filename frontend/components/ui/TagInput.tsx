import React, { useState, KeyboardEvent, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TagInputProps {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  className?: string
  placeholder?: string
}

const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  setTags, 
  className = '', 
  placeholder = '태그를 입력하고 Enter를 누르세요' 
}) => {
  const [input, setInput] = useState('')
  const composingRef = useRef(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input && !composingRef.current) {
      e.preventDefault()
      addTag(input)
    }
  }

  const handleCompositionStart = () => {
    composingRef.current = true
  }

  const handleCompositionEnd = () => {
    composingRef.current = false
  }

  const addTag = (tag: string) => {
    if (tag.trim() !== '' && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()])
      setInput('')
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
            {tag}
            <Button
              onClick={() => removeTag(index)}
              variant="ghost"
              size="sm"
              className="ml-1 text-blue-600 hover:text-blue-800 p-0"
            >
              <X size={14} />
            </Button>
          </span>
        ))}
      </div>
      <Input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  )
}

export default TagInput