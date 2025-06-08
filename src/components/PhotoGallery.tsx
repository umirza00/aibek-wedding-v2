import React, { useState } from 'react'
import { X, Heart, Sparkles, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'

const PhotoGallery: React.FC = () => {
  const [content, setContent] = React.useState({
    title: 'Our Journey Together',
    subtitle: 'Captured moments from our beautiful journey of love',
    photos: [
      {
        id: 1,
        src: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Couple holding hands',
        category: 'Engagement'
      },
      {
        id: 2,
        src: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Wedding rings',
        category: 'Details'
      },
      {
        id: 3,
        src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Couple dancing',
        category: 'Romance'
      },
      {
        id: 4,
        src: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Sunset engagement',
        category: 'Engagement'
      },
      {
        id: 5,
        src: 'https://images.pexels.com/photos/1667069/pexels-photo-1667069.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Proposal moment',
        category: 'Proposal'
      },
      {
        id: 6,
        src: 'https://images.pexels.com/photos/1616408/pexels-photo-1616408.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Wedding preparation',
        category: 'Details'
      }
    ]
  })
  
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('web_content')
          .select('key, value, type')
          .eq('section', 'photo_gallery')

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
        console.error('Error fetching photo gallery content:', error)
      }
    }

    fetchContent()
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-white via-violet-50 to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 bg-violet-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-32 h-32 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <Sparkles className="absolute top-1/3 left-1/4 w-8 h-8 text-violet-300 opacity-30 animate-pulse" />
        <Star className="absolute bottom-1/4 right-1/3 w-6 h-6 text-purple-300 opacity-40 animate-bounce delay-700" />
        <Heart className="absolute top-1/2 right-1/6 w-5 h-5 text-indigo-300 opacity-35 animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center items-center mb-6">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-violet-400"></div>
            <div className="mx-4 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xl text-white">📸</span>
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
          
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Enhanced Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {content.photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
              onClick={() => setSelectedImage(index)}
            >
              {/* Photo Container */}
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.category}
                </div>
                
                {/* Hover Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🔍</span>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-violet-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-purple-400 rounded-full opacity-50 animate-bounce"></div>
              </div>
              
              {/* Photo Number */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-5xl max-h-full">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-16 right-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300 group"
              >
                <X className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
              
              {/* Image */}
              <div className="relative">
                <img
                  src={content.photos[selectedImage].src}
                  alt={content.photos[selectedImage].alt}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
                
                {/* Image Info */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <p className="text-gray-800 font-semibold">{content.photos[selectedImage].alt}</p>
                  <p className="text-violet-600 text-sm">{content.photos[selectedImage].category}</p>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                  onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : content.photos.length - 1)}
                  className="p-4 text-white hover:text-violet-300 transition-colors duration-300 bg-white/10 backdrop-blur-sm rounded-full ml-4 hover:bg-white/20"
                  disabled={content.photos.length <= 1}
                >
                  <span className="text-3xl">‹</span>
                </button>
              </div>
              
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={() => setSelectedImage(selectedImage < content.photos.length - 1 ? selectedImage + 1 : 0)}
                  className="p-4 text-white hover:text-violet-300 transition-colors duration-300 bg-white/10 backdrop-blur-sm rounded-full mr-4 hover:bg-white/20"
                  disabled={content.photos.length <= 1}
                >
                  <span className="text-3xl">›</span>
                </button>
              </div>
              
              {/* Image Counter */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                {selectedImage + 1} of {content.photos.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default PhotoGallery