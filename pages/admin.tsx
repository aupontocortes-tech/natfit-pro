import { useEffect, useState } from 'react'
import HeroSlider, { ImageConfig } from '../components/ui/hero-slider'
import MobileNav from '../components/ui/mobile-nav'
import Head from 'next/head'

const navigation = [
  { name: 'Produtos', href: '/' },
  { name: 'Recursos', href: '#' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Empresa', href: '/empresa' },
]

export default function Admin() {
  const [images, setImages] = useState<ImageConfig[]>([
    { src: '/training/olympia.jpg', posX: 50, posY: 50, scale: 100 },
    { src: '/training/2.svg', posX: 50, posY: 50, scale: 100 },
    { src: '/training/3.svg', posX: 50, posY: 50, scale: 100 },
  ])
  const [urlInput, setUrlInput] = useState('')
  const [urlVideoInput, setUrlVideoInput] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedCfg = window.localStorage.getItem('natfit_images_configs')
    if (savedCfg) {
      try {
        const parsed = JSON.parse(savedCfg)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setImages(parsed as ImageConfig[])
        }
      } catch {}
    }
  }, [])

  const handleAddUrl = () => {
    if (!urlInput.trim()) return
    setImages((prev) => [...prev, { src: urlInput.trim(), posX: 50, posY: 50, scale: 100 }])
    setUrlInput('')
  }

  const handleAddVideoUrl = () => {
    if (!urlVideoInput.trim()) return
    setImages((prev) => [...prev, { src: urlVideoInput.trim(), mediaType: 'video', posX: 50, posY: 50, scale: 100 }])
    setUrlVideoInput('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImages((prev) => [...prev, { src: dataUrl, posX: 50, posY: 50, scale: 100 }])
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImages((prev) => [...prev, { src: dataUrl, mediaType: 'video', posX: 50, posY: 50, scale: 100 }])
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSave = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('natfit_images_configs', JSON.stringify(images))
  }

  const handleResetDefault = () => {
    setImages([
      { src: '/training/olympia.jpg', posX: 50, posY: 50, scale: 100 },
      { src: '/training/2.svg', posX: 50, posY: 50, scale: 100 },
      { src: '/training/3.svg', posX: 50, posY: 50, scale: 100 },
    ])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <MobileNav navigation={navigation} />
      </div>

      <main className="px-6 py-10">
        <Head>
          <title>NatFit Pro — Admin</title>
          <meta name="description" content="Painel de administração e editor de slider." />
        </Head>
        <div className="max-w-7xl mx-auto space-y-10">
          <section className="bg-card text-card-foreground rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold">Editor de Imagens do Slider (somente desenvolvedor)</h2>
            <p className="mt-2 text-sm text-foreground/80">
              Adicione URLs ou carregue imagens do seu computador. Ajuste posição X/Y e tamanho.
            </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Adicionar por URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="flex-1 rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                    <button
                      onClick={handleAddUrl}
                      className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Carregar do computador</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-white hover:file:bg-secondary/80"
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-2">Adicionar vídeos (sem som)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Adicionar vídeo por URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={urlVideoInput}
                      onChange={(e) => setUrlVideoInput(e.target.value)}
                      placeholder="https://exemplo.com/video.mp4"
                      className="flex-1 rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                    <button
                      onClick={handleAddVideoUrl}
                      className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
                    >
                      Adicionar vídeo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Carregar vídeo do computador</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-white hover:file:bg-secondary/80"
                  />
                </div>
              </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Imagens atuais</h3>
              {images.length === 0 ? (
                <p className="text-sm text-foreground/70">Nenhuma imagem. Adicione pelo menos uma.</p>
              ) : (
                <ul className="space-y-2">
                  {images.map((cfg, i) => (
                    <li key={`${cfg.src}-${i}`} className="space-y-2 border border-border rounded-md p-3 bg-background">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {cfg.mediaType === 'video' ? (
                            <video
                              src={cfg.src}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="h-12 w-20 overflow-hidden rounded border border-border object-cover"
                              style={{
                                objectPosition: `${cfg.posX ?? 50}% ${cfg.posY ?? 50}%`,
                                transform: `scale(${(cfg.scale ?? 100) / 100})`,
                              }}
                            />
                          ) : (
                            <div
                              className="h-12 w-20 overflow-hidden rounded border border-border bg-gray-200"
                              style={{
                                backgroundImage: `url('${cfg.src}')`,
                                backgroundSize: `${cfg.scale ?? 100}%`,
                                backgroundPosition: `${cfg.posX ?? 50}% ${cfg.posY ?? 50}%`,
                              }}
                            />
                          )}
                          <span className="text-sm truncate max-w-[200px]">
                            {cfg.mediaType === 'video'
                              ? (cfg.src.startsWith('data:') ? 'Vídeo carregado' : (cfg.src.split('?')[0].split('/').pop() || 'Vídeo'))
                              : (cfg.src.startsWith('data:') ? 'Imagem carregada' : (cfg.src.split('?')[0].split('/').pop() || 'Imagem'))}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemove(i)}
                          className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                        >
                          Remover
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium">Posição X (%)</label>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={cfg.posX ?? 50}
                            onChange={(e) =>
                              setImages((prev) => prev.map((c, idx) => (idx === i ? { ...c, posX: Number(e.target.value) } : c)))
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium">Posição Y (%)</label>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={cfg.posY ?? 50}
                            onChange={(e) =>
                              setImages((prev) => prev.map((c, idx) => (idx === i ? { ...c, posY: Number(e.target.value) } : c)))
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium">Tamanho (%)</label>
                          <input
                            type="range"
                            min={50}
                            max={200}
                            value={cfg.scale ?? 100}
                            onChange={(e) =>
                              setImages((prev) => prev.map((c, idx) => (idx === i ? { ...c, scale: Number(e.target.value) } : c)))
                            }
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={handleSave} className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80">Salvar alterações</button>
                <button onClick={handleResetDefault} className="rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">Restaurar padrão</button>
              </div>
            </div>
          </section>

          {/* Preview do slider */}
          <HeroSlider imageConfigs={images} intervalMs={5000}>
            <div className="px-6 sm:px-12 lg:px-16 max-w-3xl">
              <h1 className="text-3xl font-bold text-white drop-shadow">Preview</h1>
              <p className="mt-2 text-white/80">Ajuste acima e veja aqui o resultado.</p>
            </div>
          </HeroSlider>
        </div>
      </main>
    </div>
  )
}