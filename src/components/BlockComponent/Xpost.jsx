import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select' // Changed import path
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useAvatar } from './Context/avatarContext'
import { ArrowDown, Copy, Edit, Loader2, RefreshCw, X } from 'lucide-react'

export const Xpost = () => {
    const [prompt, setPrompt] = useState('')
    const [postType, setPostType] = useState('single')
    const [tone, setTone] = useState('professional')
    const [loading, setLoading] = useState(false)
    const [regenerating, setRegenerating] = useState(false)
    const [generatedPost, setGeneratedPost] = useState([])
    const [error, setError] = useState('')
    const [showFloatingButton, setShowFloatingButton] = useState(false)
    const [copiedId, setCopiedId] = useState(null)
    
    const textareaRef = useRef(null)
    const resultsRef = useRef(null)
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
                  id: Date.now(),
                  content: `Just discovered an amazing insight about ${prompt}! 🚀\n\nThe key is understanding that innovation doesn't happen in isolation - it's about connecting dots that others haven't seen yet.\n\n#Innovation #${prompt.replace(/\s+/g, '')}`,
                  characterCount: 187
                }
              ]
            : [
                {
                  id: Date.now(),
                  content: `Let's talk about ${prompt} - a thread 🧵\n\n1/ The landscape is changing faster than ever, and here's what you need to know...`,
                  characterCount: 142
                },
                {
                  id: Date.now() + 1,
                  content: `2/ The first principle to understand is that ${prompt} isn't just a trend - it's a fundamental shift in how we approach problems.`,
                  characterCount: 134
                },
                {
                  id: Date.now() + 2,
                  content: `3/ Here are the key factors driving this change:\n\n• Technology advancement\n• Changing user expectations\n• Market dynamics\n• Regulatory environment`,
                  characterCount: 151
                },
                {
                id: Date.now() + 3,
                content: `4/ What does this mean for you?\n\nStart by focusing on the fundamentals, then adapt to the specific context of your situation.\n\nThe future belongs to those who act today. 🎯`,
                characterCount: 175
                }
            ];
            setGeneratedPost(mockPosts)
            
            // Scroll to results after generation
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }, 100)
            
        } catch (error) {
            setError("Failed to generate post: " + error.message)
        } finally {
            setLoading(false)
            setRegenerating(false)
        }
    }

    // Scroll detection for floating button
    useEffect(() => {
        const handleScroll = () => {
            if (resultsRef.current && generatedPost.length > 0) {
                const rect = resultsRef.current.getBoundingClientRect()
                const isResultVisible = rect.top < window.innerHeight && rect.bottom > 100
                setShowFloatingButton(!isResultVisible && window.innerWidth < 1024)
            }
        }
        
        window.addEventListener("scroll", handleScroll)
        handleScroll() // Initial check
        
        return () => window.removeEventListener("scroll", handleScroll)
    }, [generatedPost])

    const copyToClipboard = async (text, postId) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedId(postId)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const scrollToResults = () => {
        resultsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    const handleNewPost = () => {
        setPrompt('')
        setGeneratedPost([])
        setError('')
        setTimeout(() => {
            textareaRef.current?.focus()
        }, 100)
    }

    return (
         <div className="min-h-screen bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto p-4">
                {/* Main Content Container */}
                <div className="flex flex-col lg:flex-row gap-6 w-full mt-10 justify-center items-start">
                    
                    {/* Left Panel - Form */}
                    <div className={`w-full mx-auto lg:mx-0 ${generatedPost.length > 0 ? 'lg:w-1/2' : 'lg:w-1/2 max-w-2xl'}`}>
                        <Card className="w-full border-2 bg-[#171717] border-[#222323] shadow-2xl">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-end space-x-2">
                                        <div className="text-orange-500">
                                            <h1 className="text-3xl font-bold">Xc</h1>
                                        </div>
                                        <div className="text-xl font-semibold text-[#e6e8ec]">
                                            Generate Post
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <div className="h-0.5 mx-6 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-md" />

                            <CardContent className="pt-6">
                                {/* User Profile Section */}
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 flex-shrink-0">
                                        <img
                                            src={avatar}
                                            alt="User"
                                            className="rounded-full object-cover w-full h-full shadow-lg"
                                        />
                                    </div>
                                    <div className="text-[#e6e8ec] font-medium text-lg">
                                        What post do you want to create?
                                    </div>
                                </div>

                                {/* Error Display */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-400" />
                                        <span className="text-red-400 text-sm">{error}</span>
                                    </div>
                                )}

                                {/* Textarea Section */}
                                <div className="mb-6">
                                    <Textarea
                                        ref={textareaRef}
                                        placeholder="Enter your topic or idea..."
                                        className="w-full h-32 border-none outline-none bg-[#222323] rounded-2xl text-lg text-[#e6e8ec] placeholder:text-lg placeholder:text-gray-500 resize-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-200 p-4"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </div>

                                {/* Select Options Section */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    {/* Post Type Dropdown */}
                                    <div className="flex-1">
                                        <label className="block text-[#e6e8ec] font-medium mb-2 text-sm">
                                            Post Type
                                        </label>
                                        <Select value={postType} onValueChange={setPostType}>
                                            <SelectTrigger className="w-full border-none text-white bg-[#222323] hover:bg-[#2a2a2a] focus:ring-2 focus:ring-orange-500/50 transition-all duration-200">
                                                <SelectValue placeholder="Select Post Type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#222323] text-white border-2 border-[#333333]">
                                                {Type.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                        className="hover:bg-orange-500/20 focus:bg-orange-500/20"
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Post Tone Dropdown */}
                                    <div className="flex-1">
                                        <label className="block text-[#e6e8ec] font-medium mb-2 text-sm">
                                            Post Tone
                                        </label>
                                        <Select value={tone} onValueChange={setTone}>
                                            <SelectTrigger className="w-full border-none text-white bg-[#222323] hover:bg-[#2a2a2a] focus:ring-2 focus:ring-orange-500/50 transition-all duration-200">
                                                <SelectValue placeholder="Select Tone" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#222323] text-white border-2 border-[#333333]">
                                                {Tone.map((toneOption) => (
                                                    <SelectItem
                                                        key={toneOption.value}
                                                        value={toneOption.value}
                                                        className="hover:bg-orange-500/20 focus:bg-orange-500/20"
                                                    >
                                                        {toneOption.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Character Count */}
                                <div className="mb-6 text-right">
                                    <span className="text-sm text-gray-400">
                                        {prompt.length} characters
                                    </span>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    onClick={() => generateXpost(false)}
                                    disabled={!prompt.trim() || loading}
                                    className={`w-full h-12 text-lg font-semibold transition-all duration-200 ${
                                        !prompt.trim() || loading 
                                            ? "bg-gray-600 cursor-not-allowed" 
                                            : "bg-orange-600 hover:bg-orange-700 active:bg-orange-800"
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate Post"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel - Results */}
                    <div className="w-full lg:w-1/2">
                        {generatedPost.length > 0 && (
                            <div ref={resultsRef} className="space-y-6">
                                {/* Results Header */}
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-[#e6e8ec]">
                                        Generated {postType === 'single' ? 'Post' : 'Thread'}
                                    </h2>
                                    <Button
                                        onClick={() => generateXpost(true)}
                                        disabled={regenerating}
                                        variant="outline"
                                        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-200"
                                    >
                                        {regenerating ? (
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        ) : (
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                        )}
                                        {regenerating ? 'Regenerating...' : 'Regenerate'}
                                    </Button>
                                </div>

                                {/* Generated Posts */}
                                <div className="space-y-4">
                                    {generatedPost.map((post, index) => (
                                        <Card
                                            key={post.id}
                                            className="border-2 bg-[#171717] border-[#222323] shadow-lg hover:border-orange-500/30 transition-all duration-200"
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="text-sm text-orange-400 font-medium bg-orange-500/10 px-3 py-1 rounded-full">
                                                        {postType === "single" ? "Post" : `Post ${index + 1}`}
                                                    </span>
                                                    <span className={`text-sm font-medium ${
                                                        post.characterCount > 280 ? 'text-red-400' : 'text-gray-400'
                                                    }`}>
                                                        {post.characterCount}/280
                                                    </span>
                                                </div>

                                                <div className="text-[#e6e8ec] whitespace-pre-wrap text-lg leading-relaxed mb-6 p-4 bg-[#222323] rounded-lg border border-[#333333]">
                                                    {post.content}
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => copyToClipboard(post.content, post.id)}
                                                        className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333] transition-all duration-200"
                                                    >
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        {copiedId === post.id ? 'Copied!' : 'Copy'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333] transition-all duration-200"
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Create Another Post */}
                                <Card className="border-2 border-dashed border-orange-500/50 bg-transparent hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-200">
                                    <CardContent className="p-6 text-center">
                                        <p className="text-gray-400 mb-4 text-lg">Want to create another post?</p>
                                        <Button 
                                            onClick={handleNewPost}
                                            variant="outline"
                                            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-200"
                                        >
                                            Create New Post
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Floating Button */}
                {showFloatingButton && (
                    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
                        <Button
                            onClick={scrollToResults}
                            className="bg-orange-500 hover:bg-orange-600 text-white shadow-2xl rounded-full animate-bounce h-14 px-6"
                            size="lg"
                        >
                            <ArrowDown className="h-5 w-5 mr-2" />
                            View Results ({generatedPost.length})
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Xpost