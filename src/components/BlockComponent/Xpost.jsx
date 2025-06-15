import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select' // Changed import path
import { Button } from '../ui/button'
import { Badge } from '../ui/badge' // Fixed Badge import
import { Copy, Edit3, Heart, Loader2, MessageCircle, RefreshCw, Repeat2, Share } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { Alert, AlertDescription } from '../ui/alert'
import { Input } from '../ui/input'

export const Xpost = () => {
    const [prompt, setPrompt] = useState('')
    const [postType, setPostType] = useState('single')
    const [tone, setTone] = useState('professional')
    const [loading, setLoading] = useState(false)
    const [generatedPost, setGeneratedPost] = useState([])
    const [error, setError] = useState('')

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
~
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
        <div className='max-w-4xl mx-auto p-6 space-y-6'>
          <div className='flex mt-10 items-center justify-center w-auto'>
            
 <Card className="bg-[#171717] border border-[#222323] ">
                 <CardHeader className="text-white">
                     <CardTitle className="flex items-center gap-2">
                         <div className='h-5 w-5 text-white font-bold'>
                             X
                         </div>
                         Generate X Post
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    
                     <div className="space-y-2 text-[#c1cccd]">
                       <div className='mb-2 text-white'>
                         <Label htmlFor="topic">What topic do you want to post about?</Label>
                       </div>
                         <Textarea
                           id="topic"
                           placeholder="e.g., AI in healthcare, startup funding tips, remote work productivity..."
                           value={prompt}
                           onChange={(e) => setPrompt(e.target.value)}
                           className="min-h-[100px] resize-none placeholder-white border-[#3b3c3c]"
                         />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Post Type Dropdown */}
                         <div className="space-y-2 text-[#c1cccd]">
                             <div className='mb-2 text-white'>
                             <Label>Post Type</Label>
                           </div>
                             <Select value={postType} onValueChange={setPostType}>
                                 <SelectTrigger className="w-full border-[#3b3c3c]">
                                     <SelectValue placeholder="Select Post Type" 
                                     />
                                 </SelectTrigger>
                                 <SelectContent
                                 className="bg-[#262626] text-white border-[#3b3c3c] "
                                 >
                                     {Type.map((type) => (
                                         <SelectItem key={type.value} value={type.value}>
                                             {type.label}
                                         </SelectItem>
                                     ))}
                                 </SelectContent>
                             </Select>
                         </div>

                         {/* Tone Dropdown */}
                         <div className='space-y-2 text-[#c1cccd]'>
                           <div className='mb-2 text-white'>
                             <Label>Tone</Label>
                           </div>
                             <Select value={tone} onValueChange={setTone}>
                                 <SelectTrigger className="w-full border-[#3b3c3c]">
                                     <SelectValue/>
                                 </SelectTrigger>
                                 <SelectContent
                                   className="bg-[#262626] text-white border-[#3b3c3c] "
                                 >
                                     {Tone.map((toneOption) => (
                                         <SelectItem key={toneOption.value} value={toneOption.value}>
                                             {toneOption.label}
                                         </SelectItem>
                                     ))}
                                 </SelectContent>
                             </Select>
                         </div>
                     </div>

                     {error && (
                         <Alert variant="destructive">
                             <AlertDescription>{error}</AlertDescription>
                         </Alert>
                     )}

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
                 </CardContent>
             </Card>
            </div>
        </div>
    );
};

export default Xpost;














