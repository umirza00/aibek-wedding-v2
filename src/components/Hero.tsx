import React, { useState, useEffect } from 'react'
import { Heart, Calendar, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Hero: React.FC = () => {
  const [content, setContent] = useState({
    coupleNames: 'Aibek & Aigerim',
    weddingDate: '2025-08-09T19:00:00',
    subtitle: 'БІЗ ҮЙЛЕНІП ЖАТЫРМЫЗ',
    dateText: '09 тамыз 2025 жыл',
    scrollText: 'Зерттеу үшін айналдырыңыз'
  })
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Wedding date - set to a future date
  const weddingDate = new Date(content.weddingDate)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('web_content')
          .select('key, value')
          .eq('section', 'hero')

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
        console.error('Error fetching hero content:', error)
      }
    }

    fetchContent()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = weddingDate.getTime() - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-violet-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-violet-300 rounded-full opacity-20 animate-bounce delay-500"></div>
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-1/4 left-1/4 w-6 h-6 text-violet-300 opacity-40 animate-pulse" />
        <Heart className="absolute top-1/3 right-1/4 w-4 h-4 text-purple-400 opacity-50 animate-bounce delay-300" />
        <Heart className="absolute bottom-1/3 left-1/3 w-5 h-5 text-indigo-300 opacity-30 animate-pulse delay-700" />
        <Sparkles className="absolute top-1/2 left-1/6 w-5 h-5 text-violet-400 opacity-40 animate-bounce delay-1000" />
        <Sparkles className="absolute bottom-1/4 right-1/6 w-4 h-4 text-purple-300 opacity-50 animate-pulse delay-500" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Decorative Elements */}
        <div className="mb-8 flex justify-center items-center space-x-4">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-violet-400"></div>
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <Heart className="w-10 h-10 text-white fill-current" />
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-violet-400"></div>
        </div>

        {/* Couple Names with Enhanced Typography */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-gray-800 mb-2 tracking-wide relative">
            <span className="relative">
              {content.coupleNames.split(' & ')[0] || 'Aibek'}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-400 rounded-full opacity-60 animate-ping"></div>
            </span>
            <span className="mx-4 text-transparent bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text animate-pulse">
              &
            </span>
            <span className="relative">
              {content.coupleNames.split(' & ')[1] || 'Aigerim'}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-ping delay-500"></div>
            </span>
          </h1>
          <div className="flex justify-center mt-4">
            <div className="w-32 h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-400 rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Subtitle */}
        <div className="mb-8">
          <p className="text-xl md:text-3xl text-gray-700 mb-4 font-light tracking-[0.3em] relative">
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-medium">
              {content.subtitle}
            </span>
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Wedding Date with Enhanced Design */}
        <div className="flex items-center justify-center mb-12 text-gray-700">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-violet-200">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-violet-500" />
              <span className="text-lg font-medium">{content.dateText}</span>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 md:gap-6 mb-12 max-w-lg mx-auto">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <div key={unit} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-violet-200 hover:border-violet-300 transition-all duration-300 hover:scale-105">
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-medium">
                  {unit}
                </div>
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse ${
                  index % 2 === 0 ? 'bg-violet-400' : 'bg-purple-400'
                }`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="animate-bounce">
          <div className="relative mx-auto w-8 h-12 border-2 border-violet-400 rounded-full flex justify-center bg-white/20 backdrop-blur-sm">
            <div className="w-1.5 h-4 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full mt-2 animate-pulse"></div>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-violet-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-300"></div>
          </div>
          <p className="text-sm text-violet-600 mt-2 font-medium tracking-wide">{content.scrollText}</p>
        </div>
      </div>
    </section>
  )
}

export default Hero