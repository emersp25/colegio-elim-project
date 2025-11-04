// src/components/PhotoCarousel.tsx
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type CarouselImage = {
    src: string
    alt?: string
    caption?: string
}

interface PhotoCarouselProps {
    images: CarouselImage[]
    autoPlay?: boolean
    interval?: number // ms
}

export default function PhotoCarousel({ images, autoPlay = true, interval = 5000 }: PhotoCarouselProps) {
    const [current, setCurrent] = useState(0)

    // cambio automático
    useEffect(() => {
        if (!autoPlay || images.length <= 1) return
        const id = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length)
        }, interval)
        return () => clearInterval(id)
    }, [autoPlay, interval, images.length])

    const goPrev = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goNext = () => {
        setCurrent((prev) => (prev + 1) % images.length)
    }

    if (images.length === 0) return null

    return (
        <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white">
            {/* imagen */}
            <div className="relative h-72 sm:h-80 md:h-96">
                <img
                    src={images[current].src}
                    alt={images[current].alt ?? `Imagen ${current + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                />
                {/* overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent pointer-events-none" />
                {/* caption */}
                {images[current].caption && (
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-2xl text-sm sm:text-base">
                        {images[current].caption}
                    </div>
                )}
            </div>

            {/* botones */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        className="absolute top-1/2 -translate-y-1/2 left-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                        onClick={goNext}
                        className="absolute top-1/2 -translate-y-1/2 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                </>
            )}

            {/* dots */}
            {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`w-3 h-3 rounded-full transition ${
                                idx === current ? 'bg-white' : 'bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
