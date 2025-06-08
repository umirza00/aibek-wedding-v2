import React from 'react'
import { Heart, Instagram, Facebook, Twitter, Sparkles, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ThankYou: React.FC = () => {
  const [content, setContent] = React.useState({
    title: 'Thank You',
    message: 'We are so grateful for your love and support as we begin this new chapter of our lives. Your presence on our special day means the world to us.',
    hashtag: '#JohnAndJane2025',
    shareTitle: 'Share the Love',
    shareMessage: 'Don\'t forget to share your photos using our wedding hashtag:',
    socialMessage: 'Connect with us on social media',
    signatureMessage: 'With all our love,',
    coupleNames: 'John & Jane'
  })

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('web_content')
          .select('key, value')
          .eq('section', 'thank_you')

        if (error) throw error

        if (data) {
          const contentMap = data.reduce((acc, item) => {
            acc[item.key] = item.value
            return acc
          }, {} as Record<string, string>)

          setContent(prev => ({
            ...prev,
            ...contentMap
          }))
        }
      } catch (error) {
        console.error('Error fetching thank you content:', error)
      }
    }

    fetchContent()
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-violet-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-200 rounded-full opacity-15 animate-pulse delay-1000"></div>
        <Sparkles className="absolute top-1/4 right-1/4 w-10 h-10 text-violet-300 opacity-30 animate-bounce" />
        <Star className="absolute bottom-1/3 left-1/3 w-8 h-8 text-purple-300 opacity-40 animate-pulse delay-700" />
        <Heart className="absolute top-1/3 left-1/4 w-6 h-6 text-indigo-300 opacity-35 animate-bounce delay-500" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Enhanced Heart Icon */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Heart className="w-12 h-12 text-white fill-current" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-ping delay-500"></div>
          </div>
        </div>

        {/* Enhanced Thank You Message */}
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-serif bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
            {content.title}
          </h2>
          
          <div className="flex justify-center mb-8">
            <div className="w-32 h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-400 rounded-full"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            {content.message}
          </p>
          
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-violet-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Enhanced Wedding Hashtag */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-16 border border-violet-200 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 w-20 h-20 border-2 border-violet-300 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-purple-300 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-indigo-200 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl text-white">📱</span>
              </div>
              
              <h3 className="text-2xl font-serif bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {content.shareTitle}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6 text-lg">
              {content.shareMessage}
            </p>
            
            <div className="relative inline-block">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent bg-violet-50 px-8 py-4 rounded-full border-2 border-violet-200 shadow-lg">
                {content.hashtag}
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-300"></div>
            </div>
            
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Social Media Links */}
        <div className="mb-16">
          <p className="text-gray-600 mb-8 text-lg">{content.socialMessage}</p>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="group relative w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
            </a>
            <a
              href="#"
              className="group relative w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
            </a>
            <a
              href="#"
              className="group relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
            </a>
          </div>
        </div>

        {/* Enhanced Final Message */}
        <div className="text-gray-600 space-y-4">
          <p className="font-semibold text-lg">{content.signatureMessage}</p>
          <div className="relative inline-block">
            <p className="text-4xl font-serif bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              {content.coupleNames}
            </p>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-500"></div>
          </div>
          
          <div className="flex justify-center space-x-1 mt-6">
            <Heart className="w-5 h-5 text-violet-500 animate-pulse" />
            <Heart className="w-4 h-4 text-purple-500 animate-pulse delay-200" />
            <Heart className="w-5 h-5 text-indigo-500 animate-pulse delay-400" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ThankYou