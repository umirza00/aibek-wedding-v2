import React from 'react'
import { MapPin, Clock, Camera, Music, Sparkles, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'

const WeddingDetails: React.FC = () => {
  const [content, setContent] = React.useState({
    title: 'Wedding Details',
    subtitle: 'Join us for a day filled with love, laughter, and celebration',
    weddingDate: 'June 15, 2025',
    weddingDay: 'Saturday',
    dressCodeTitle: 'Dress Code',
    dressCodeText: 'Cocktail attire requested. Ladies: cocktail dresses or elegant separates. Gentlemen: suit and tie or sports coat.',
    giftRegistryTitle: 'Gift Registry',
    giftRegistryText: 'Your presence is the greatest gift! If you wish to honor us with a gift, we\'re registered at Target and Amazon.',
    events: [
      {
        title: 'Ceremony',
        time: '4:00 PM',
        location: 'St. Mary\'s Church',
        address: '123 Church Street, Downtown',
        icon: 'Camera',
        color: 'bg-violet-500',
        gradient: 'from-violet-500 to-purple-500',
        bgGradient: 'from-violet-50 to-purple-50'
      },
      {
        title: 'Cocktail Hour',
        time: '5:30 PM',
        location: 'Garden Terrace',
        address: 'Same venue',
        icon: 'Clock',
        color: 'bg-purple-500',
        gradient: 'from-purple-500 to-indigo-500',
        bgGradient: 'from-purple-50 to-indigo-50'
      },
      {
        title: 'Reception',
        time: '7:00 PM',
        location: 'Grand Ballroom',
        address: '456 Reception Ave',
        icon: 'Music',
        color: 'bg-indigo-500',
        gradient: 'from-indigo-500 to-violet-500',
        bgGradient: 'from-indigo-50 to-violet-50'
      }
    ]
  })

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('web_content')
          .select('key, value, type')
          .eq('section', 'wedding_details')

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
        console.error('Error fetching wedding details content:', error)
      }
    }

    fetchContent()
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return Camera
      case 'Clock': return Clock
      case 'Music': return Music
      default: return Camera
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-violet-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-indigo-200 rounded-full opacity-15 animate-pulse delay-1000"></div>
        <Sparkles className="absolute top-1/4 left-1/3 w-8 h-8 text-violet-300 opacity-30 animate-bounce" />
        <Star className="absolute bottom-1/4 right-1/3 w-6 h-6 text-purple-300 opacity-40 animate-pulse delay-700" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center items-center mb-6">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-violet-400"></div>
            <div className="mx-4 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xl text-white">💒</span>
            </div>
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
        </div>

        {/* Enhanced Wedding Date Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-16 text-center border border-violet-200 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 w-20 h-20 border-2 border-violet-300 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-purple-300 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-indigo-200 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">💒</span>
              </div>
              <h3 className="text-3xl font-serif text-gray-800 mb-4">Wedding Day</h3>
              <p className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
                {content.weddingDate}
              </p>
              <p className="text-xl text-gray-600 font-medium">{content.weddingDay}</p>
            </div>
            
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-violet-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Events Timeline */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {content.events.map((event, index) => {
            const IconComponent = getIconComponent(event.icon)
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 border border-violet-200 relative overflow-hidden group-hover:scale-105`}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${event.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-4 h-4 bg-violet-400 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 bg-purple-400 rounded-full opacity-50 animate-bounce delay-300"></div>
                  
                  <div className="relative z-10">
                    <div className={`w-20 h-20 bg-gradient-to-br ${event.gradient} rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-serif text-gray-800 mb-4">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-4 text-gray-600">
                      <div className="flex items-center justify-center bg-white/70 rounded-full px-4 py-2 backdrop-blur-sm">
                        <Clock className="w-5 h-5 mr-3 text-violet-500" />
                        <span className="font-semibold text-violet-600">{event.time}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-800 text-lg">{event.location}</p>
                        <div className="flex items-center justify-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">{event.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-1 mt-6">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-400"></div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline Connector */}
                {index < content.events.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-violet-400 to-purple-400 transform -translate-y-1/2 z-20">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Enhanced Additional Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-4 right-4 w-16 h-16 bg-violet-100 rounded-full opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-purple-100 rounded-full opacity-40"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">👗</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-serif bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
                {content.dressCodeTitle}
              </h3>
              
              <p className="text-gray-600 text-center leading-relaxed">
                {content.dressCodeText}
              </p>
              
              <div className="flex justify-center space-x-2 mt-4">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-4 left-4 w-16 h-16 bg-indigo-100 rounded-full opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-violet-100 rounded-full opacity-40"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">🎁</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-serif bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 text-center">
                {content.giftRegistryTitle}
              </h3>
              
              <p className="text-gray-600 text-center leading-relaxed">
                {content.giftRegistryText}
              </p>
              
              <div className="flex justify-center space-x-2 mt-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WeddingDetails