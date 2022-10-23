import { useEffect, useRef } from 'react'

type TNetParticles = {
  // Particle Stats
  maxSize?: number
  minSize?: number
  maxSpeed?: number

  // Life settings
  lifeTime?: number
  minOpacity?: number
  minSizeByLife?: number

  // Lines
  lineLength?: number
  lineReason?: 'length' | 'all' | 'opacity'

  // Mouse
  mouseCollision?: number

  // Global Particles settings
  particlesRgbColors?: string[] | string
  numberOfParticles?: number
  forceRandomColors?: number

  // Canvas Settings
  showMouseBorder?: boolean
  mouseBorderColor?: string
  CanvasWidth?: number
  CanvasHeight?: number
  className?: string
}

type TMouse = {
  x: number
  y: number
}

export const NetParticles = ({
  // Particle Stats
  maxSize = 10,
  minSize = 5,
  maxSpeed = 2,

  //Life settings
  lifeTime = 200,
  minOpacity = 0.3,
  minSizeByLife = 5,

  // Lines
  lineLength = 100,
  lineReason = 'length',

  // Mouse
  mouseCollision = 25,

  // Global Particles settings
  particlesRgbColors = '255,255,255',
  numberOfParticles = 0,
  forceRandomColors = 100,

  // Canvas Settings
  showMouseBorder = false,
  mouseBorderColor = 'yellow',
  CanvasWidth = 0,
  CanvasHeight = 0,
  className = '',
}: TNetParticles) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      // Создание случайных цветов
      let localRgbColors = particlesRgbColors
      if (forceRandomColors) {
        if (!Array.isArray(particlesRgbColors)) {
          localRgbColors = [particlesRgbColors]
        }
        const randomColor = () => Math.floor(Math.random() * 257)
        for (let i = 0; i < forceRandomColors; i++) {
          const colorRGB = `${randomColor()},${randomColor()},${randomColor()}`
          localRgbColors = localRgbColors as string[]
          localRgbColors.push(colorRGB)
        }
      }

      // Настройки контекста и обработка изменения размера окна
      const ctx = canvas.getContext('2d')!

      let w = (canvas.width = CanvasWidth || window.innerWidth - 5)
      let h = (canvas.height = CanvasHeight || window.innerHeight - 5)

      // Отслеживание изменения размера окна
      const resizeFunc = () => {
        w = canvas.width = CanvasWidth || window.innerWidth - 5
        h = canvas.height = CanvasHeight || window.innerHeight - 5
      }

      if (!CanvasHeight || !CanvasWidth) {
        window.addEventListener('resize', resizeFunc)
      }

      // Отслеживание мыши
      const mouse: TMouse = {
        x: 0,
        y: 0,
      }

      const mouseMoveFunc = (e: MouseEvent) => {
        mouse.x = e.x
        mouse.y = e.y
      }

      if (mouseCollision) {
        canvas.addEventListener('mousemove', mouseMoveFunc)
      }

      // Класс точки
      class Particle {
        public x: number
        public y: number
        public opacity: number

        private life: number
        private dirX: number
        private dirY: number
        private size: number

        // Параметры при инициализации
        constructor(public color: string) {
          this.x = Math.random() * w
          this.y = Math.random() * h
          this.dirX = Math.random() * maxSpeed
          this.dirY = Math.random() * maxSpeed
          this.size = maxSize === minSize || minSize === 0 ? maxSize : Math.floor(Math.random() * (maxSize - minSize + 1) + minSize)
          this.life = Math.floor(Math.random() * lifeTime)
          this.opacity = minOpacity !== 0 ? this.calculateOpacity() : 1
        }

        private calculateOpacity() {
          const newOpacity = this.life / lifeTime
          return newOpacity < minOpacity! ? minOpacity! : newOpacity
        }

        private calculateSize() {
          const newSize = this.size - this.size / this.life
          return newSize < minSizeByLife ? minSizeByLife : newSize
        }

        public draw() {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.closePath()
          ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`
          ctx.fill()
        }

        public calculateLife() {
          if (lifeTime !== 0) {
            if (minOpacity !== 0) {
              this.opacity = this.calculateOpacity()
            }
            if (minSizeByLife && this.life % 10 === 0) {
              this.size = this.calculateSize()
            }

            if (this.life < 1) {
              this.life = Math.floor(Math.random() * lifeTime)
              this.x = Math.random() * w
              this.y = Math.random() * h
              this.dirX = Math.random() * maxSpeed * 2 - maxSpeed
              this.dirY = Math.random() * maxSpeed * 2 - maxSpeed
              this.size = Math.random() * maxSize
            }
            this.life--
          }
        }

        public move() {
          if (mouseCollision) {
            // Взаимодействие с мышкой
            const distanceX = mouse.x - this.x
            const distanceY = mouse.y - this.y
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
            if (distance < mouseCollision + this.size) {
              if (this.x < mouse.x) {
                this.dirX = this.dirX < 0 ? this.dirX * 1.5 : -this.dirX
              }
              if (this.x > mouse.x) {
                this.dirX = this.dirX > 0 ? this.dirX * 1.5 : -this.dirX
              }

              if (this.y < mouse.y) {
                this.dirY = this.dirY < 0 ? this.dirY * 1.5 : -this.dirY
              }

              if (this.y > mouse.y) {
                this.dirY = this.dirY > 0 ? this.dirY * 1.5 : -this.dirY
              }
            }
          }

          if (this.x > w || this.x < 0) {
            this.dirX = -this.dirX
          }
          if (this.y > h || this.y < 0) {
            this.dirY = -this.dirY
          }

          // Основное движение
          this.x += this.dirX
          this.y += this.dirY
        }
      }

      const particleArr: Particle[] = []

      const init = () => {
        const localNumberOfParticles = numberOfParticles || (h * w) / 9000
        for (let i = 0; i < localNumberOfParticles; i++) {
          const colorId = Math.floor(Math.random() * localRgbColors.length)
          const currentColor = Array.isArray(localRgbColors) ? localRgbColors[colorId] : localRgbColors
          particleArr.push(new Particle(currentColor))
        }
      }

      const drawLines = (i: number) => {
        if (lineLength)
          for (let i2 in particleArr) {
            const x1 = particleArr[i].x
            const y1 = particleArr[i].y
            const x2 = particleArr[i2].x
            const y2 = particleArr[i2].y

            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
            if (length < lineLength) {
              // Чем меньше осталось жить точке, тем более прозрачна к ней линия
              const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
              gradient.addColorStop(0, `rgba(${particleArr[i].color}, 0)`)
              gradient.addColorStop(0.1, `rgba(${particleArr[i].color}, ${particleArr[i].opacity})`)

              gradient.addColorStop(0.9, `rgba(${particleArr[i2].color}, ${particleArr[i2].opacity})`)
              gradient.addColorStop(1, `rgba(${particleArr[i2].color}, 0)`)

              // Линия становится тоньше от расстояния или остатка жизни точки
              const lengthReason = 1 - length / lineLength!
              const opacityReason = Math.min(particleArr[i].opacity, particleArr[i2].opacity)
              const moreWeightReason = Math.min(opacityReason, lengthReason)
              switch (lineReason) {
                case 'length':
                  ctx.lineWidth = lengthReason
                  break
                case 'all':
                  ctx.lineWidth = moreWeightReason
                  break
                case 'opacity':
                  ctx.lineWidth = opacityReason
                  break
              }
              ctx.strokeStyle = gradient
              ctx.beginPath()
              ctx.moveTo(x1, y1)
              ctx.lineTo(x2, y2)
              ctx.closePath()
              ctx.stroke()
            }
          }
      }

      const drawMouseBorder = () => {
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, mouseCollision!, 0, Math.PI * 2)
        ctx.closePath()
        ctx.lineWidth = 2
        ctx.strokeStyle = mouseBorderColor!
        ctx.stroke()
      }

      const animate = () => {
        if (particleArr.length > 0) {
          requestAnimationFrame(animate)
          // Clear bg
          ctx.clearRect(0, 0, w, h)
          showMouseBorder && mouseCollision && drawMouseBorder()

          for (let i = 0; i < particleArr.length; i++) {
            // draw particles
            particleArr[i].calculateLife()
            particleArr[i].move()
            particleArr[i].draw()

            // Lines
            drawLines(i)
          }
        }
      }

      init()
      animate()

      return () => {
        canvas.removeEventListener('mousemove', mouseMoveFunc)
        window.removeEventListener('resize', resizeFunc)
        particleArr.length = 0
      }
    }
  }, [
    canvasRef,
    lifeTime,
    lineLength,
    numberOfParticles,
    maxSize,
    maxSpeed,
    particlesRgbColors,
    lineReason,
    mouseCollision,
    forceRandomColors,
    CanvasWidth,
    CanvasHeight,
    minOpacity,
    minSize,
    minSizeByLife,
    mouseBorderColor,
    showMouseBorder,
  ])
  return <canvas id={'canvas'} ref={canvasRef} className={className}></canvas>
}
