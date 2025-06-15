import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select' // Changed import path
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useAvatar } from './Context/avatarContext'
import { Loader2 } from 'lucide-react'

export const Xpost = () => {
    const [prompt, setPrompt] = useState('')
    const [postType, setPostType] = useState('single')
    const [tone, setTone] = useState('professional')
    const [loading, setLoading] = useState(false)
    const [generatedPost, setGeneratedPost] = useState([])
    const [error, setError] = useState('')

    const { avatar } = useAvatar()

    const Tone = [
        {value: 'professional', label: 'Professional'},
        {value: 'humorous', label: 'Humorous'},
        {value: 'educational', label: 'Educational'},
        {value: 'controversial', label: 'Controversial'},
        {value: 'casual', label: 'Casual'},
        {value: 'inspirational', label: 'Inspirational'},
        ]

    const Type = [
        { value: 'single', label: 'Single Post' },
        { value: 'thread', label: 'Thread (2-5 posts)' },
        { value: 'long-thread', label: 'Long Thread (6-10 posts)'}
    ]

    const generateXpost = async() => {
        setLoading(true)
        setError('')
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
              
            // Mock generated content based on type
            const mockPosts = postType === 'single' 
            ? [
                {
                  id: 1,
                  content: `Just discovered an amazing insight about ${prompt}! 🚀\n\nThe key is understanding that innovation doesn't happen in isolation - it's about connecting dots that others haven't seen yet.\n\n#Innovation #${prompt.replace(/\s+/g, '')}`,
                  characterCount: 187
                }
              ]
            : [
                {
                  id: 1,
                  content: `Let's talk about ${prompt} - a thread 🧵\n\n1/ The landscape is changing faster than ever, and here's what you need to know...`,
                  characterCount: 142
                },
                {
                  id: 2,
                  content: `2/ The first principle to understand is that ${prompt} isn't just a trend - it's a fundamental shift in how we approach problems.`,
                  characterCount: 134
                },
                {
                  id: 3,
                  content: `3/ Here are the key factors driving this change:\n\n• Technology advancement\n• Changing user expectations\n• Market dynamics\n• Regulatory environment`,
                  characterCount: 151
                },
                {
                id: 4,
                content: `4/ What does this mean for you?\n\nStart by focusing on the fundamentals, then adapt to the specific context of your situation.\n\nThe future belongs to those who act today. 🎯`,
                characterCount: 175
                }
            ];
            setGeneratedPost(mockPosts)
        } catch (error) {
            setError("Failed to retrieve data: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-4xl w-full mx-auto p-4'>
            <div className='flex mt-10 items-center justify-center w-auto'>
                <Card className="w-full border-2 bg-[#171717] border-[#222323] shadow-2xl">
                    <CardHeader className="pb-3">
                        <div className='flex items-center justify-between'>
                            <div className='flex items-end space-x-2'>
                                <div className='text-orange-500'>
                                    <h1 className='text-3xl font-bold'>Xc</h1>
                                </div>
                                <div className='text-xl font-semibold text-[#e6e8ec]'>Generate Post</div>
                            </div>
                        </div>
                    </CardHeader>

                    <div className="h-0.5 mx-6 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-md" />


                    <CardContent className="pt-4">
                        {/* User Profile Section */}
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 flex-shrink-0">
                                <img
                                    src={avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                                    alt="User"
                                    className="rounded-full object-cover w-full h-full shadow-2xl"
                                />
                            </div>
                            <div className="text-[#e6e8ec] font-medium text-lg">
                                What post do you want to create?
                            </div>
                        </div>

                        {/* Textarea Section */}
                        <div className="mb-4">
                            <Textarea
                                placeholder="Enter your topic or idea..."
                                className="w-full h-30 overflow-y-auto border-none outline-none bg-[#222323] rounded-2xl text-xl text-[#e6e8ec] placeholder:text-lg placeholder:text-gray-500 resize-none focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>

                        {/* Select Options Section */}
                        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                            {/* Post Type Dropdown */}
                            <div className='flex-1 min-w-0'>
                                <label className='block text-[#e6e8ec] font-medium mb-1 text-sm'>
                                    Post Type
                                </label>
                                <Select value={postType} onValueChange={setPostType}>
                                    <SelectTrigger className="w-full border-none text-white bg-[#222323] hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200">
                                        <SelectValue placeholder="Select Post Type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-2 border-gray-200">
                                        {Type.map((type) => (
                                            <SelectItem 
                                                key={type.value} 
                                                value={type.value}
                                                className="hover:bg-orange-50 focus:bg-orange-50"
                                            >
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Post Tone Dropdown */}
                            <div className='flex-1 min-w-0'>
                                <label className='block text-[#e6e8ec] font-medium mb-1 text-sm'>
                                    Post Tone
                                </label>
                                <Select value={tone} onValueChange={setTone}>
                                    <SelectTrigger className="w-full border-none text-white bg-[#222323] hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200">
                                        <SelectValue placeholder="Select Tone" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-2 border-gray-200">
                                        {Tone.map((toneOption) => (
                                            <SelectItem 
                                                key={toneOption.value} 
                                                value={toneOption.value}
                                                className="hover:bg-orange-50 focus:bg-orange-50"
                                            >
                                                {toneOption.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Debug Info (remove in production) */}
                        <div className="mt-4 p-2 bg-[#222323] rounded-lg text-sm text-gray-400">
                            <strong>Current selections:</strong> {postType} | {tone} | {prompt.length} characters
                        </div>

                        {/* Submit button */}

                        <div className='w-full flex justify-center mt-5 '>
                          <Button
                        onClick={generateXpost}
                        disabled={!prompt.trim() || loading}
                        className={`w-full ${!prompt.trim() || loading ? "bg-[#f97316]" : "bg-[#ea580c]"}`}
                        size='lg'
                    >
                        {loading ? (
                            <>
                                <Loader2 className='animate-spin mr-2 h-4 w-4' />
                              Generating...
                          </>
                      ) : "Generate Post"}
                  </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Xpost;














