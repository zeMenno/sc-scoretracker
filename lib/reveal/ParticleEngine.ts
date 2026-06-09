import { animate } from "animejs"

const POOL_SIZE = 60
const MAX_CONCURRENT = 120

export class ParticleEngine {
  private container: HTMLElement
  private pool: HTMLSpanElement[] = []
  private active = 0

  constructor(container: HTMLElement) {
    this.container = container
    for (let i = 0; i < POOL_SIZE; i++) {
      const el = document.createElement("span")
      el.className = "reveal-particle"
      el.style.display = "none"
      this.container.appendChild(el)
      this.pool.push(el)
    }
  }

  emitBurst(x: number, y: number, color: string, count = 24): void {
    const actual = Math.min(count, MAX_CONCURRENT - this.active, this.pool.length)
    for (let i = 0; i < actual; i++) {
      const particle = this.acquire()
      if (!particle) break
      this.animateParticle(particle, x, y, color)
    }
  }

  emitConfetti(count = 40): void {
    const w = window.innerWidth
    const h = window.innerHeight
    const colors = ["#ffd700", "#ff6b6b", "#4ecdc4", "#a78bfa", "#f97316", "#ffffff"]
    for (let i = 0; i < Math.min(count, MAX_CONCURRENT - this.active); i++) {
      const particle = this.acquire()
      if (!particle) break
      const color = colors[i % colors.length]
      this.animateParticle(particle, w * 0.5, h * 0.35, color, true)
    }
  }

  destroy(): void {
    this.pool.forEach((p) => p.remove())
    this.pool = []
  }

  private acquire(): HTMLSpanElement | null {
    const free = this.pool.find((p) => p.style.display === "none")
    if (!free) return null
    this.active++
    return free
  }

  private release(particle: HTMLSpanElement): void {
    particle.style.display = "none"
    particle.style.opacity = "0"
    particle.style.transform = "translate(0, 0) scale(0)"
    this.active = Math.max(0, this.active - 1)
  }

  private animateParticle(
    particle: HTMLSpanElement,
    x: number,
    y: number,
    color: string,
    confetti = false,
  ): void {
    const angle = Math.random() * Math.PI * 2
    const distance = confetti ? 80 + Math.random() * 400 : 40 + Math.random() * 120
    const dx = Math.cos(angle) * distance
    const dy = confetti
      ? Math.sin(angle) * distance + 200 + Math.random() * 300
      : Math.sin(angle) * distance - 40

    const size = confetti ? 6 + Math.random() * 8 : 3 + Math.random() * 5

    particle.style.display = "block"
    particle.style.left = `${x}px`
    particle.style.top = `${y}px`
    particle.style.width = `${size}px`
    particle.style.height = confetti ? `${size * 0.4}px` : `${size}px`
    particle.style.backgroundColor = color
    particle.style.borderRadius = confetti ? "1px" : "50%"
    particle.style.opacity = "1"
    particle.style.transform = "translate(0, 0) scale(1)"

    animate(particle, {
      translateX: dx,
      translateY: dy,
      scale: [{ to: 1 }, { to: 0 }],
      opacity: [{ to: 1 }, { to: 0 }],
      duration: confetti ? 1800 + Math.random() * 800 : 600 + Math.random() * 400,
      ease: confetti ? "outQuad" : "outExpo",
      onComplete: () => this.release(particle),
    })
  }
}
