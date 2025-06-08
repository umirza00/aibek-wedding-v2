import React from 'react'
import { useInView } from 'react-intersection-observer'
import { Heart, Star, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

const OurStory: React.FC = () => {
  const [content, setContent] = React.useState({
    title: 'Our Love Story',
    subtitle: 'Every love story is beautiful, but ours is our favorite',
    storyEvents: [
      {
        title: "When Our Eyes First Met",
        date: "Spring 2020",
        description: "It was a beautiful spring day at the local coffee shop. John was reading his favorite book when Jane walked in, and something magical happened. Their eyes met across the room, and they both knew this was the beginning of something special.",
        icon: "💕",
        gradient: "from-violet-500 to-purple-500",
        bgGradient: "from-violet-50 to-purple-50"
      },
      {
        title: "A Perfect Evening",
        date: "Summer 2020",
        description: "Our first official date was a sunset picnic in the park. We talked for hours about our dreams, our fears, and everything in between. That night, we both knew we had found something rare and beautiful.",
        icon: "🌹",
        gradient: "from-purple-500 to-indigo-500",
        bgGradient: "from-purple-50 to-indigo-50"
      },
      {
        title: "Will You Marry Me?",
        date: "Winter 2024",
        description: "On a snowy December evening, John got down on one knee at the same coffee shop where they first met. With tears of joy, Jane said yes, and they began planning the rest of their lives together.",
        icon: "💍",
        gradient: "from-indigo-500 to-violet-500",
        bgGradient: "from-indigo-50 to-violet-50"
      }
    ]
  })
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('web_content')
          .select('key, value, type')
          .eq('section', 'our_story')

        if (error) throw error

        if (data) {
          const contentMap = data.reduce((acc, item) => {
            if (item.type === 'json') {
              try {
                acc[item.key] = JSON.parse(item.value)
              } catch {
                acc[item.key] = item.value
              }
            } else {
              acc[item.key] = item.value
            }
            return acc
          }, {} as Record<string, any>)

          setContent(prev => ({
            ...prev,
            ...contentMap
          }))
        }
      } catch (error) {
        console.error('Error fetching our story content:', error)
      }
    }

    fetchContent()
  }, [])

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-white via-violet-50 to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-violet-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <Sparkles className="absolute top-1/4 right-1/4 w-8 h-8 text-violet-300 opacity-30 animate-pulse" />
        <Star className="absolute bottom-1/3 left-1/4 w-6 h-6 text-purple-300 opacity-40 animate-bounce delay-500" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center items-center mb-6">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-violet-400"></div>
            <Heart className="mx-4 w-8 h-8 text-violet-500 animate-pulse" />
            <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-violet-400"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            {content.title}
          </h2>
          
          <div className="flex justify-center mb-6">
            <div className="w-32 h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-400 rounded-full"></div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
          
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Enhanced Story Timeline */}
        <div className="space-y-20">
          {content.storyEvents.map((event, index) => (
            <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${index * 300}ms` }}>
              <div className={`${index % 2 === 0 ? 'order-2 md:order-1' : 'order-1'} group`}>
                <div className={`bg-gradient-to-br ${event.bgGradient} rounded-3xl p-8 h-80 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-violet-200 relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-16 h-16 border-2 border-violet-300 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-purple-300 rounded-full"></div>
                  </div>
                  
                  <div className="text-center relative z-10">
                    <div className={`w-24 h-24 bg-gradient-to-br ${event.gradient} rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{event.icon}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-400"></div>
                      </div>
                      <p className={`text-lg font-semibold bg-gradient-to-r ${event.gradient} bg-clip-text text-transparent`}>
                        Chapter {index + 1}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`${index % 2 === 0 ? 'order-1 md:order-2' : 'order-2'} space-y-6`}>
                <div className="relative">
                  <div className={`bg-gradient-to-r ${event.gradient} text-white px-8 py-4 rounded-full inline-block text-sm font-semibold shadow-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    <span className="relative z-10">{event.date}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-400 rounded-full animate-ping"></div>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-serif text-gray-800 leading-tight">
                  {event.title}
                </h3>
                
                <div className="w-16 h-1 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"></div>
                
                <p className="text-gray-600 leading-relaxed text-lg">
                  {event.description}
                </p>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Heart className="w-5 h-5 text-violet-500 animate-pulse" />
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Connector */}
        <div className="flex justify-center mt-16">
          <div className="w-1 h-20 bg-gradient-to-b from-violet-400 via-purple-400 to-indigo-400 rounded-full relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory