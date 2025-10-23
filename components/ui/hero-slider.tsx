import { useEffect, useState } from 'react'

export type ImageConfig = {
  src: string
  mediaType?: 'image' | 'video'
  posX?: number // 0 a 100 (%)
  posY?: number // 0 a 100 (%)
  scale?: number // porcentagem (ex.: 100)
}

type HeroSliderProps = {
  images?: string[]
  imageConfigs?: ImageConfig[]
  intervalMs?: number
  className?: string
  children?: React.ReactNode
}

export default function HeroSlider({
  images,
  imageConfigs,
  intervalMs = 5000,
  className = '',
  children,
}: HeroSliderProps) {
  const [index, setIndex] = useState(0)

  // Garantir lista tipada para evitar erro de união de tipos
  const renderList: ImageConfig[] = imageConfigs?.length
    ? imageConfigs
    : (images || []).map((src) => ({ src } as ImageConfig))

  useEffect(() => {
    const list: ImageConfig[] = imageConfigs?.length
      ? imageConfigs
      : (images || []).map((src) => ({ src } as ImageConfig))
    if (!list || list.length === 0) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [images, imageConfigs, intervalMs])

  return (
    <section className={`relative h-[75vh] w-full overflow-hidden rounded-2xl shadow ${className}`}>
      {/* Slides */}
      {renderList.map((cfg, i) => (
        <div
          key={`${cfg.src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          style={
            (cfg.mediaType === 'video')
              ? undefined
              : {
                  backgroundImage: `url('${cfg.src}')`,
                  backgroundSize: cfg.scale ? `${cfg.scale}%` : 'cover',
                  backgroundPosition:
                    cfg.posX !== undefined || cfg.posY !== undefined
                      ? `${cfg.posX ?? 50}% ${cfg.posY ?? 50}%`
                      : 'center',
                }
          }
        >
          {cfg.mediaType === 'video' && (
            <video
              src={cfg.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full"
              style={{
                objectFit: 'cover',
                objectPosition:
                  cfg.posX !== undefined || cfg.posY !== undefined
                    ? `${cfg.posX ?? 50}% ${cfg.posY ?? 50}%`
                    : 'center',
                transform: `scale(${(cfg.scale ?? 100) / 100})`,
                transformOrigin: 'center',
              }}
            />
          )}
        </div>
      ))}

      {/* Overlay com tom vermelho campeão */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/60 via-black/50 to-black/40 dark:from-red-950/60 dark:via-black/60 dark:to-black/50" />

      {/* Conteúdo sobre a imagem */}
      <div className="relative z-10 flex h-full items-center">
        {children}
      </div>
    </section>
  )
}