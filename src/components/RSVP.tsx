import React, { useState } from 'react'
import { Send, Check, AlertCircle, Heart, Sparkles } from 'lucide-react'
import { supabase, RSVPData } from '../lib/supabase'

const RSVP: React.FC = () => {
  const [formData, setFormData] = useState<RSVPData>({
    guest_name: '',
    email: '',
    phone: '',
    attendance: 'yes',
    number_of_guests: 1,
    dietary_restrictions: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_guests' ? parseInt(value) || 1 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const { error } = await supabase
        .from('rsvp_responses')
        .insert([formData])

      if (error) throw error

      setSubmitStatus('success')
      setFormData({
        guest_name: '',
        email: '',
        phone: '',
        attendance: 'yes',
        number_of_guests: 1,
        dietary_restrictions: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-violet-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-violet-200 rounded-full opacity-25 animate-bounce"></div>
          <Sparkles className="absolute top-1/3 right-1/4 w-8 h-8 text-green-300 opacity-30 animate-pulse" />
          <Heart className="absolute bottom-1/3 left-1/4 w-6 h-6 text-violet-300 opacity-40 animate-bounce delay-500" />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-green-200 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-20 h-20 border-2 border-green-300 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-violet-300 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl animate-bounce">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl font-serif bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
                Thank You!
              </h2>
              
              <div className="flex justify-center mb-6">
                <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
              </div>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Your RSVP has been received successfully. We can't wait to celebrate with you!
              </p>
              
              <div className="flex justify-center space-x-2 mb-8">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-violet-400 rounded-full animate-bounce delay-200"></div>
              </div>
              
              <button
                onClick={() => setSubmitStatus('idle')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                Submit Another RSVP
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-violet-200 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-200 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <Sparkles className="absolute top-1/4 right-1/4 w-8 h-8 text-violet-300 opacity-30 animate-bounce" />
        <Heart className="absolute bottom-1/3 left-1/3 w-6 h-6 text-purple-300 opacity-40 animate-pulse delay-700" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-violet-400"></div>
            <div className="mx-4 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xl text-white">💌</span>
            </div>
            <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-violet-400"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            RSVP
          </h2>
          
          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-400 rounded-full"></div>
          </div>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            We hope you can join us for our special day!
          </p>
          
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Enhanced RSVP Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-violet-200 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 w-24 h-24 border-2 border-violet-300 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-20 h-20 border-2 border-purple-300 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-indigo-200 rounded-full"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Name and Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="guest_name" className="block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="guest_name"
                    name="guest_name"
                    value={formData.guest_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="John Doe"
                  />
                  <div className="absolute top-4 right-4 w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="john@example.com"
                  />
                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="+1 (555) 123-4567"
                />
                <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-400"></div>
              </div>
            </div>

            {/* Attendance */}
            <div className="space-y-2">
              <label htmlFor="attendance" className="block text-sm font-semibold text-gray-700">
                Will you be attending? *
              </label>
              <div className="relative">
                <select
                  id="attendance"
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleInputChange}
                  required
                  className="w-full px-6 py-4 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none"
                >
                  <option value="yes">Yes, I'll be there! 🎉</option>
                  <option value="no">Sorry, I can't make it 😢</option>
                  <option value="maybe">Maybe 🤔</option>
                </select>
                <div className="absolute top-4 right-4 w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Conditional Fields for Yes Attendance */}
            {formData.attendance === 'yes' && (
              <div className="space-y-6 p-6 bg-violet-50/50 rounded-2xl border border-violet-200">
                <div className="space-y-2">
                  <label htmlFor="number_of_guests" className="block text-sm font-semibold text-gray-700">
                    Number of Guests (including yourself)
                  </label>
                  <div className="relative">
                    <select
                      id="number_of_guests"
                      name="number_of_guests"
                      value={formData.number_of_guests}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dietary_restrictions" className="block text-sm font-semibold text-gray-700">
                    Dietary Restrictions or Allergies
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="dietary_restrictions"
                      name="dietary_restrictions"
                      value={formData.dietary_restrictions}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      placeholder="Vegetarian, Gluten-free, etc."
                    />
                    <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                Special Message (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-6 py-4 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm"
                  placeholder="Share your excitement or any special wishes..."
                />
                <div className="absolute top-4 right-4 w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-center">
                <AlertCircle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-semibold">Unable to submit RSVP</p>
                  <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white py-5 px-8 rounded-2xl hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 relative overflow-hidden group"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex items-center">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Sending RSVP...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 mr-3" />
                    Send RSVP
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default RSVP