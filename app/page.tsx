'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles, Gift, Pause, Play, Volume2 } from 'lucide-react'

export default function EnchantedBirthday() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)
  const [currentPhrase, setCurrentPhrase] = useState('')
  const [showPhrase, setShowPhrase] = useState(false)

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    setIsLoading(false)
  }, [])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
    setIsLoading(false)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setShowPlayButton(true)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Add event listeners
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplaythrough', () => {
      // Try autoplay only when audio is ready
      if (!isPlaying && !showPlayButton) {
        playPromiseRef.current = audio.play()
        playPromiseRef.current
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            setShowPlayButton(true)
          })
      }
    })

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
    }
  }, [handlePlay, handlePause, handleError, isPlaying, showPlayButton])

  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || isLoading) return

    setIsLoading(true)

    try {
      if (isPlaying) {
        // Wait for any pending play promise before pausing
        if (playPromiseRef.current) {
          await playPromiseRef.current
        }
        audio.pause()
        playPromiseRef.current = null
      } else {
        // Only play if not already playing
        if (audio.paused) {
          playPromiseRef.current = audio.play()
          await playPromiseRef.current
          setShowPlayButton(false)
        }
      }
    } catch (error) {
      console.log('Audio playback interrupted or failed:', error)
      setIsLoading(false)
      if (!isPlaying) {
        setShowPlayButton(true)
      }
    }
  }, [isPlaying, isLoading])

  const romanticPhrases = [
    "Eres la luz que ilumina mis días más oscuros ✨",
    "Contigo he encontrado mi hogar, mi paz y mi felicidad 🏠💕",
    "Cada día a tu lado es un regalo del cielo 🎁",
    "Eres mi sueño hecho realidad, mi amor eterno 💫",
    "Tu sonrisa es mi razón favorita para despertar cada mañana ☀️",
    "Eres la melodía más hermosa de mi corazón 🎵💖",
    "Contigo el tiempo se detiene y la eternidad comienza ⏰",
    "Eres mi estrella, mi luna, mi universo completo 🌟🌙",
    "Tu amor es el tesoro más valioso que poseo 💎",
    "Eres la respuesta a todas mis oraciones 🙏✨",
    "Contigo he aprendido que el amor verdadero existe 💕",
    "Eres mi complemento perfecto, mi media naranja 🍊",
    "Tu amor me hace sentir invencible y completo 💪❤️",
    "Eres la princesa de mi cuento de hadas 👑✨",
    "Contigo cada momento es mágico e inolvidable 🪄"
  ]

  const showRandomPhrase = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * romanticPhrases.length)
    setCurrentPhrase(romanticPhrases[randomIndex])
    setShowPhrase(true)
    
    // Hide phrase after 5 seconds
    setTimeout(() => {
      setShowPhrase(false)
    }, 5000)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
      >
        <source src="/audio/romantic-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Control */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={toggleMusic}
          disabled={isLoading}
          size="lg"
          className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white shadow-xl rounded-full w-14 h-14 p-0 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : showPlayButton ? (
            <Play className="w-6 h-6" fill="currentColor" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" fill="currentColor" />
          )}
        </Button>
        
        {/* Music indicator */}
        {isPlaying && !isLoading && (
          <div className="absolute -bottom-2 -right-2">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-pink-400 rounded-full animate-pulse"
                  style={{
                    height: `${8 + Math.random() * 8}px`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Initial Play Button Overlay (if autoplay fails) */}
      {showPlayButton && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <Button
              onClick={toggleMusic}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-xl shadow-2xl rounded-full disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
              ) : (
                <Volume2 className="w-6 h-6 mr-3" />
              )}
              {isLoading ? 'Cargando...' : 'Iniciar Música Romántica'}
            </Button>
            <p className="text-white/80 mt-4 text-sm">
              Haz clic para comenzar la experiencia mágica
            </p>
          </div>
        </div>
      )}

      {/* Rest of the component remains the same */}
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fondo.png"
          alt="Fantasy landscape background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-pink-300 opacity-70" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Birthday Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
            <Gift className="w-8 h-8 text-purple-400" />
            <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl mb-4">
            ¡Feliz Cumpleaños!
          </h1>
          
          <p className="text-xl md:text-2xl text-pink-200 drop-shadow-lg">
            Para la mujer más especial de mi vida
          </p>
        </div>

        {/* Enchanted Glass Dome */}
        <div className="relative">
          {/* Glass dome container */}
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            
            {/* Glass dome effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-pink-100/10 to-purple-200/20 backdrop-blur-sm border-2 border-white/30 shadow-2xl">
              
              {/* Inner glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-pink-200/20 via-transparent to-purple-200/20 animate-pulse"></div>
              
              {/* Highlight on glass */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-white/40 rounded-full blur-xl"></div>
              <div className="absolute top-12 left-12 w-8 h-8 bg-white/60 rounded-full blur-sm"></div>
              
              {/* Orchid in the center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative animate-float-gentle">
                  <Image
                    src="/images/orquidea1.png"
                    alt="Beautiful orchids"
                    width={200}
                    height={280}
                    className="drop-shadow-2xl"
                  />
                  
                  {/* Magical glow around orchid */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Base of the dome */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-72 h-8 bg-gradient-to-r from-amber-600/80 via-yellow-600/80 to-amber-600/80 rounded-full shadow-lg border border-amber-500/50"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-4 bg-gradient-to-r from-amber-700/60 via-yellow-700/60 to-amber-700/60 rounded-full"></div>
          </div>

          {/* Floating hearts around dome */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-heart"
              style={{
                left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <Heart className="w-6 h-6 text-pink-400 opacity-80" fill="currentColor" />
            </div>
          ))}
        </div>

        {/* Birthday Message */}
        <div className="text-center mt-12 max-w-2xl">
          <p className="text-lg md:text-xl text-white/90 drop-shadow-lg leading-relaxed mb-6">
            Como esta orquídea encantada, tu belleza y gracia iluminan cada día de mi vida. 
            En este día especial, quiero que sepas que eres mi tesoro más preciado.
          </p>
          
          <Button 
            onClick={showRandomPhrase}
            size="lg" 
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Heart className="w-5 h-5 mr-2" fill="currentColor" />
            Con todo mi amor
          </Button>

          {/* Romantic Phrase Display */}
          {showPhrase && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-2xl max-w-lg mx-auto">
                <p className="text-white text-lg md:text-xl font-medium text-center leading-relaxed">
                  {currentPhrase}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-heart {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }
        
        .animate-float-heart {
          animation: float-heart 2s ease-in-out infinite;
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
