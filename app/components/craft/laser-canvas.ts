// Supplied by Wide for the Craft process timeline (24 Nov 2026).
export type LaserLook =
  | "plan"
  | "orbit"
  | "draft"
  | "mill"
  | "cut"
  | "layup"
  | "heat"
  | "qc"
  | "assemble"
  | "polish"
  | "release"
  | "ship"

export type LaserPaint = {
  intro: number
  line: number
  x: number
  y: number
  velocity: number
  look: LaserLook
  /** 0..1 head position within the active row */
  rowProgress?: number
  /** Free space to the right of the head, up to the viewport edge */
  width: number
  burst: number
  /** 0..1 exit after the last step: charge, launch to the right, streak off-screen */
  outro: number
  /** Viewport position of the timeline origin; x/y are relative to it */
  ox: number
  oy: number
}

type Spark = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  size: number
  hot: number
}

type Rgb = [number, number, number]

const LOOK: Record<LaserLook, { core: Rgb; glow: Rgb; radius: number; trail: number }> = {
  plan: { core: [232, 255, 236], glow: [57, 255, 20], radius: 7, trail: 10 },
  orbit: { core: [240, 255, 242], glow: [57, 255, 20], radius: 6, trail: 10 },
  draft: { core: [255, 255, 255], glow: [120, 255, 160], radius: 4, trail: 8 },
  mill: { core: [255, 255, 255], glow: [57, 255, 20], radius: 5, trail: 10 },
  assemble: { core: [240, 255, 240], glow: [57, 255, 20], radius: 5, trail: 6 },
  cut: { core: [255, 255, 255], glow: [57, 255, 20], radius: 5, trail: 16 },
  layup: { core: [236, 255, 252], glow: [120, 255, 220], radius: 4, trail: 6 },
  heat: { core: [255, 236, 170], glow: [190, 255, 40], radius: 18, trail: 22 },
  qc: { core: [255, 255, 255], glow: [57, 255, 20], radius: 8, trail: 8 },
  polish: { core: [255, 255, 255], glow: [170, 255, 140], radius: 6, trail: 12 },
  release: { core: [244, 255, 246], glow: [57, 255, 20], radius: 6, trail: 6 },
  ship: { core: [255, 255, 255], glow: [57, 255, 20], radius: 8, trail: 18 },
}

const SHIP_ANGLES = [-2.5, -1.75, -1.05, -0.45, 0.05, 0.55, 1.15, 1.85, 2.6]
const smoothstep01 = (t: number) => t * t * (3 - 2 * t)

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const rgba = (c: Rgb, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function mountLaser(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return { paint() {}, destroy() {} }

  const sparks: Spark[] = []
  const trail: { x: number; y: number }[] = []
  let shown: LaserLook = "plan"
  let toward: LaserLook = "plan"
  let mix = 1
  let lastBurst = 0
  let shotFlash = 0
  let raf = 0
  let running = false
  let latest: LaserPaint | null = null

  const spawn = (x: number, y: number, count: number, speed: number, hot = 1) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const force = speed * (0.35 + Math.random())
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force - speed * 0.25,
        life: 1,
        decay: 0.7 + Math.random() * 1.1,
        size: 0.8 + Math.random() * 1.8,
        hot,
      })
    }
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    if (canvas.width === Math.round(w * dpr) && canvas.height === Math.round(h * dpr)) return
    canvas.width = Math.max(1, Math.round(w * dpr))
    canvas.height = Math.max(1, Math.round(h * dpr))
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const bloom = (x: number, y: number, radius: number, alpha: number, glow: Rgb, core: Rgb) => {
    const halo = ctx.createRadialGradient(x, y, 0, x, y, radius * 4.2)
    halo.addColorStop(0, rgba(core, alpha * 0.95))
    halo.addColorStop(0.18, rgba(glow, alpha * 0.55))
    halo.addColorStop(0.45, rgba(glow, alpha * 0.16))
    halo.addColorStop(1, rgba(glow, 0))
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(x, y, radius * 4.2, 0, Math.PI * 2)
    ctx.fill()
  }

  const frame = (now: number) => {
    if (!latest) return
    const input = latest
    const dt = Math.min(0.05, (now - ((frame as { t?: number }).t ?? now)) / 1000)
    ;(frame as { t?: number }).t = now

    resize()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    ctx.translate(input.ox, input.oy)
    ctx.globalCompositeOperation = "lighter"

    if (input.look !== toward) {
      shown = toward
      toward = input.look
      mix = 0
    }
    mix = Math.min(1, mix + dt * 2.2)
    const from = LOOK[shown]
    const target = LOOK[toward]
    const core: Rgb = [
      lerp(from.core[0], target.core[0], mix),
      lerp(from.core[1], target.core[1], mix),
      lerp(from.core[2], target.core[2], mix),
    ]
    const glow: Rgb = [
      lerp(from.glow[0], target.glow[0], mix),
      lerp(from.glow[1], target.glow[1], mix),
      lerp(from.glow[2], target.glow[2], mix),
    ]
    const radius = lerp(from.radius, target.radius, mix)
    const trailLen = Math.round(lerp(from.trail, target.trail, mix))

    if (input.burst !== lastBurst) {
      lastBurst = input.burst
      spawn(input.x, input.y, 8, 140, 1)
    }

    const intro = input.intro
    const junctionY = input.line > 0 ? input.y : input.y
    if (intro > 0 && input.line <= 0.002) {
      const noise = hash(Math.floor(intro * 48))
      const flicker = intro < 0.36 ? 0.15 + noise * (intro < 0.2 ? 0.9 : 0.45) : 1
      if (noise > 0.72 && intro < 0.4) spawn(input.x, junctionY, 3, 90, noise)
      bloom(input.x, junctionY, 10 + intro * 18, flicker, glow, core)

      if (intro > 0.34 && intro < 0.52) {
        const ring = (intro - 0.34) / 0.18
        ctx.strokeStyle = rgba(glow, (1 - ring) * 0.8)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(input.x, junctionY, 8 + ring * 90, 0, Math.PI * 2)
        ctx.stroke()
      }

      if (intro > 0.48 && intro < 0.84) {
        const scanT = (intro - 0.48) / 0.36
        const reach = scanT < 0.55 ? scanT / 0.55 : 1 - (scanT - 0.55) / 0.45
        const length = Math.max(0, reach) * Math.max(40, input.width - 24)
        const steps = 18
        for (let i = 0; i < steps; i++) {
          const t = i / steps
          ctx.strokeStyle = rgba(i > steps - 3 ? core : glow, (1 - t) * 0.55 * reach)
          ctx.lineWidth = i > steps - 2 ? 2.4 : 1
          ctx.beginPath()
          ctx.moveTo(input.x + length * t, junctionY)
          ctx.lineTo(input.x + length * Math.min(1, t + 1 / steps), junctionY)
          ctx.stroke()
        }
        if (hash(Math.floor(intro * 30)) > 0.6) spawn(input.x + length, junctionY, 2, 60, 0.4)
      }

      if (intro > 0.84) {
        shotFlash = 1
        const k = (intro - 0.84) / 0.16
        ctx.fillStyle = rgba([255, 80, 40], (1 - k) * 0.35)
        ctx.fillRect(input.x - 2, junctionY - 30, 2, 60)
        ctx.fillStyle = rgba([80, 180, 255], (1 - k) * 0.28)
        ctx.fillRect(input.x + 2, junctionY - 24, 2, 48)
        bloom(input.x, junctionY, 16 + (1 - k) * 20, 1, glow, core)
      }
    }

    const outro = input.outro
    const shipping = input.look === "ship" || outro > 0
    const split = shipping ? (outro > 0 ? 1 : smoothstep01(clamp01((input.rowProgress ?? 0) * 1.6))) : 0
    const launched = outro >= 0.3
    const headAlpha = shipping ? (launched ? 0 : 1 - split * 0.9) : 1

    if (split > 0) {
      const tension = outro > 0 && !launched ? outro / 0.3 : 0
      const view = { l: -input.ox, t: -input.oy, r: window.innerWidth - input.ox, b: window.innerHeight - input.oy }
      const run = launched ? clamp01((outro - 0.3) / 0.7) : 0
      if (launched && shotFlash <= 0) {
        shotFlash = 1
        spawn(input.x, input.y, 22, 200, 1)
      }
      for (let i = 0; i < SHIP_ANGLES.length; i++) {
        const lane = i - (SHIP_ANGLES.length - 1) / 2
        const jitter = Math.sin(now / 140 + i * 1.7) * tension * 1.5
        const ox = input.x + lane * 7 * split + jitter
        const oy = input.y
        if (!launched) {
          // Strands peel out of the beam and run alongside the head
          const len = 60 + split * 40
          ctx.strokeStyle = rgba(i % 2 ? glow : core, 0.25 + split * 0.45 + tension * 0.3)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(input.x, oy - len - 40)
          ctx.quadraticCurveTo(input.x, oy - len * 0.4, ox, oy)
          ctx.stroke()
          bloom(ox, oy, 3 + tension * 3, 0.5 + tension * 0.5, glow, core)
          continue
        }
        const angle = SHIP_ANGLES[i]
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)
        const tx = dx > 0 ? (view.r - ox) / dx : dx < 0 ? (view.l - ox) / dx : Infinity
        const ty = dy > 0 ? (view.b - oy) / dy : dy < 0 ? (view.t - oy) / dy : Infinity
        const reach = Math.min(tx, ty) + 40
        const tip = Math.min(1, run * 3) * reach
        const tail = Math.pow(run, 1.5) * reach
        if (tip - tail <= 0.5) continue
        const beam = ctx.createLinearGradient(ox + dx * tail, oy + dy * tail, ox + dx * tip, oy + dy * tip)
        beam.addColorStop(0, rgba(glow, 0))
        beam.addColorStop(0.7, rgba(glow, 0.75))
        beam.addColorStop(1, rgba(core, 1))
        ctx.strokeStyle = beam
        ctx.lineWidth = 1 + (1 - run) * 1.6
        ctx.beginPath()
        ctx.moveTo(ox + dx * tail, oy + dy * tail)
        ctx.lineTo(ox + dx * tip, oy + dy * tip)
        ctx.stroke()
        if (tip < reach) bloom(ox + dx * tip, oy + dy * tip, 6, 0.9, glow, core)
      }
      if (launched) bloom(input.x, input.y, 22 * (1 - run), 0.7 * (1 - run), glow, core)
    }

    if (input.line > 0.002 && headAlpha > 0) {
      ctx.globalAlpha = headAlpha
      const speed = clamp01(input.velocity / 900)
      const comet = 1 + speed * 2.4
      trail.push({ x: input.x, y: input.y })
      while (trail.length > trailLen + Math.round(speed * 10)) trail.shift()
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i]
        const t = i / trail.length
        bloom(p.x, p.y, radius * (0.35 + t * 0.4) * (1 + speed), t * (0.18 + speed * 0.25), glow, core)
      }
      bloom(input.x, input.y, radius * comet, 0.9, glow, core)
      ctx.fillStyle = rgba(core, 1)
      ctx.beginPath()
      ctx.arc(input.x, input.y, Math.max(1.4, radius * 0.22), 0, Math.PI * 2)
      ctx.fill()

      if (input.look === "cut") {
        ctx.strokeStyle = rgba(glow, 0.85)
        ctx.lineWidth = 1
        ctx.beginPath()
        const arm = 22
        const gap = 6
        ctx.moveTo(input.x - arm, input.y)
        ctx.lineTo(input.x - gap, input.y)
        ctx.moveTo(input.x + gap, input.y)
        ctx.lineTo(input.x + arm, input.y)
        ctx.moveTo(input.x, input.y - arm)
        ctx.lineTo(input.x, input.y - gap)
        ctx.moveTo(input.x, input.y + gap)
        ctx.lineTo(input.x, input.y + arm)
        ctx.stroke()
        ctx.strokeStyle = rgba(glow, 0.35)
        ctx.beginPath()
        ctx.arc(input.x, input.y, arm * 0.7, 0, Math.PI * 2)
        ctx.stroke()
      }
      if (input.look === "layup") {
        // Ply orientations 0 / 45 / 90 / -45, laid one after another
        const angles = [0, Math.PI / 4, Math.PI / 2, -Math.PI / 4]
        const step = (now / 520) % angles.length
        const ply = Math.floor(step)
        const t = step - ply
        for (let i = 0; i <= ply; i++) {
          const a = angles[i]
          const len = 26 * (i === ply ? Math.min(1, t * 2.2) : 1)
          ctx.strokeStyle = rgba(i === ply ? core : glow, i === ply ? 0.85 : 0.3)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(input.x - Math.cos(a) * len, input.y - Math.sin(a) * len)
          ctx.lineTo(input.x + Math.cos(a) * len, input.y + Math.sin(a) * len)
          ctx.stroke()
        }
        ctx.strokeStyle = rgba(glow, 0.4)
        ctx.strokeRect(input.x - 9, input.y - 9, 18, 18)
      }
      if (input.look === "qc") {
        const sweep = (now / 280) % (Math.PI * 2)
        ctx.strokeStyle = rgba(core, 0.9)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(input.x, input.y, 16, sweep, sweep + 1.1)
        ctx.stroke()
      }
      const weight = (look: LaserLook) =>
        (toward === look ? mix : 0) + (shown === look && shown !== toward ? 1 - mix : 0)
      const hx = input.x
      const hy = input.y

      const wOrbit = weight("orbit")
      if (wOrbit > 0.01) {
        const rings = [
          { r: 22, inc: 1.15, rot: 0.35, speed: 1.1, n: 2 },
          { r: 30, inc: 1.3, rot: -0.6, speed: -0.75, n: 2 },
          { r: 16, inc: 0.9, rot: 1.4, speed: 1.6, n: 1 },
        ]
        for (const ring of rings) {
          const cr = Math.cos(ring.rot)
          const sr = Math.sin(ring.rot)
          ctx.globalAlpha = headAlpha * wOrbit * 0.12
          ctx.strokeStyle = rgba(glow, 1)
          ctx.lineWidth = 0.75
          ctx.beginPath()
          ctx.ellipse(hx, hy, ring.r, ring.r * Math.cos(ring.inc), ring.rot, 0, Math.PI * 2)
          ctx.stroke()
          for (let k = 0; k < ring.n; k++) {
            const a = (now / 1000) * ring.speed + (k / ring.n) * Math.PI * 2
            const px = Math.cos(a) * ring.r
            const py = Math.sin(a) * ring.r * Math.cos(ring.inc)
            const pz = Math.sin(a) * ring.r * Math.sin(ring.inc)
            const s = 110 / (110 + pz)
            const sx = hx + (px * cr - py * sr) * s
            const sy = hy + (px * sr + py * cr) * s
            const front = clamp01(0.5 - pz / (ring.r * 2))
            ctx.globalAlpha = headAlpha * wOrbit * (0.25 + front * 0.75)
            bloom(sx, sy, 1.6 * s, 0.5, glow, core)
            ctx.fillStyle = rgba(core, 1)
            ctx.beginPath()
            ctx.arc(sx, sy, (0.7 + front * 0.9) * s, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.globalAlpha = headAlpha
      }

      const wDraft = weight("draft")
      if (wDraft > 0.01) {
        ctx.globalAlpha = headAlpha * wDraft
        ctx.lineWidth = 0.75
        ctx.strokeStyle = rgba(glow, 0.28)
        ctx.setLineDash([3, 4])
        ctx.beginPath()
        ctx.moveTo(hx - 56, hy)
        ctx.lineTo(hx + 72, hy)
        ctx.moveTo(hx, hy - 44)
        ctx.lineTo(hx, hy + 44)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.strokeStyle = rgba(glow, 0.4)
        ctx.beginPath()
        ctx.arc(hx, hy, 13, 0, Math.PI * 2)
        ctx.stroke()

        const grow = clamp01(((now / 2200) % 1) * 1.6)
        const dimY = hy - 24
        const dimEnd = hx + 20 + 44 * grow
        ctx.strokeStyle = rgba(glow, 0.3)
        ctx.beginPath()
        ctx.moveTo(hx, hy - 15)
        ctx.lineTo(hx, dimY - 5)
        ctx.moveTo(dimEnd, hy - 4)
        ctx.lineTo(dimEnd, dimY - 5)
        ctx.stroke()
        ctx.strokeStyle = rgba(core, 0.7)
        ctx.beginPath()
        ctx.moveTo(hx, dimY)
        ctx.lineTo(dimEnd, dimY)
        for (const tx of [hx, dimEnd]) {
          ctx.moveTo(tx - 3, dimY + 3)
          ctx.lineTo(tx + 3, dimY - 3)
        }
        ctx.stroke()

        const rulerY = hy + 26
        ctx.strokeStyle = rgba(glow, 0.45)
        ctx.beginPath()
        ctx.moveTo(hx - 40, rulerY)
        ctx.lineTo(hx + 40, rulerY)
        for (let i = 0; i <= 10; i++) {
          const tx = hx - 40 + i * 8
          ctx.moveTo(tx, rulerY)
          ctx.lineTo(tx, rulerY - (i % 5 === 0 ? 6 : 3))
        }
        ctx.stroke()
        const marker = hx - 40 + (Math.sin(now / 900) * 0.5 + 0.5) * 80
        ctx.strokeStyle = rgba(core, 0.8)
        ctx.beginPath()
        ctx.moveTo(marker, rulerY + 4)
        ctx.lineTo(marker, rulerY - 9)
        ctx.stroke()
        ctx.globalAlpha = headAlpha
      }

      const wMill = weight("mill")
      if (wMill > 0.01) {
        ctx.globalAlpha = headAlpha * wMill
        const spin = now / 110
        ctx.lineWidth = 1
        ctx.strokeStyle = rgba(glow, 0.35)
        ctx.beginPath()
        ctx.arc(hx, hy, 11, 0, Math.PI * 2)
        ctx.stroke()
        for (let k = 0; k < 4; k++) {
          const a = spin + (k * Math.PI) / 2
          ctx.strokeStyle = rgba(k === 0 ? core : glow, k === 0 ? 0.85 : 0.55)
          ctx.beginPath()
          ctx.moveTo(hx + Math.cos(a) * 2, hy + Math.sin(a) * 2)
          ctx.quadraticCurveTo(
            hx + Math.cos(a - 0.9) * 8,
            hy + Math.sin(a - 0.9) * 8,
            hx + Math.cos(a - 0.2) * 11,
            hy + Math.sin(a - 0.2) * 11
          )
          ctx.stroke()
        }

        const segs = 7
        const pitch = 7
        const amp = 9
        const run = (now / 1500) % 1
        const drawn = run * segs
        const pt = (i: number) => ({ x: hx - 18 - (segs - i) * pitch, y: hy + (i % 2 ? -amp : amp) })
        ctx.lineWidth = 1
        for (let i = 0; i < segs; i++) {
          const local = clamp01(drawn - i)
          if (local <= 0) break
          const a = pt(i)
          const b = pt(i + 1)
          ctx.strokeStyle = rgba(glow, 0.2 + (i / segs) * 0.5)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(lerp(a.x, b.x, local), lerp(a.y, b.y, local))
          ctx.stroke()
          if (local < 1) bloom(lerp(a.x, b.x, local), lerp(a.y, b.y, local), 1.6, 0.8, glow, core)
        }
        ctx.globalAlpha = headAlpha
      }

      const wAssemble = weight("assemble")
      if (wAssemble > 0.01) {
        ctx.globalAlpha = headAlpha * wAssemble
        const spread = Math.sin(Math.PI * clamp01(input.rowProgress ?? 0)) * 18
        const length = 170
        const fade = ctx.createLinearGradient(0, hy - length, 0, hy)
        fade.addColorStop(0, rgba(glow, 0))
        fade.addColorStop(1, rgba(glow, 0.75))
        ctx.strokeStyle = fade
        ctx.lineWidth = 1
        const strands = 5
        for (let j = 0; j < strands; j++) {
          const lane = j / (strands - 1) - 0.5
          const sway = Math.sin(now / 520 + j * 1.7) * spread * 0.12
          const off = lane * spread * 2.2 + sway
          ctx.beginPath()
          ctx.moveTo(hx, hy - length)
          ctx.bezierCurveTo(hx + off, hy - length * 0.7, hx + off, hy - length * 0.3, hx, hy)
          ctx.stroke()
        }
        ctx.globalAlpha = headAlpha
      }

      const wPolish = weight("polish")
      if (wPolish > 0.01) {
        ctx.globalAlpha = headAlpha * wPolish
        const turn = now / 650
        ctx.lineCap = "round"
        for (let k = 0; k < 3; k++) {
          const start = turn + (k * Math.PI * 2) / 3
          ctx.strokeStyle = rgba(k === 0 ? core : glow, 0.18 + (k === 0 ? 0.3 : 0.1))
          ctx.lineWidth = 2.2 - k * 0.5
          ctx.beginPath()
          ctx.ellipse(hx, hy, 21 - k * 3, 9 - k, -0.35, start, start + 1.4)
          ctx.stroke()
        }
        ctx.lineCap = "butt"

        const cycle = (now / 2600) % 1
        if (cycle < 0.35) {
          const t = cycle / 0.35
          const sx = hx - 34 + t * 68
          const glint = ctx.createLinearGradient(sx - 6, hy + 16, sx + 6, hy - 16)
          glint.addColorStop(0, rgba(core, 0))
          glint.addColorStop(0.5, rgba(core, Math.sin(Math.PI * t) * 0.85))
          glint.addColorStop(1, rgba(core, 0))
          ctx.strokeStyle = glint
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(sx - 6, hy + 16)
          ctx.lineTo(sx + 6, hy - 16)
          ctx.stroke()
          const twinkle = Math.max(0, 1 - Math.abs(t - 0.5) * 5)
          if (twinkle > 0) {
            ctx.strokeStyle = rgba(core, twinkle * 0.9)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(hx - 10 * twinkle, hy)
            ctx.lineTo(hx + 10 * twinkle, hy)
            ctx.moveTo(hx, hy - 10 * twinkle)
            ctx.lineTo(hx, hy + 10 * twinkle)
            ctx.stroke()
          }
        }
        ctx.globalAlpha = headAlpha
      }
      if (input.look === "heat") {
        const breathe = 0.8 + Math.sin(now / 260) * 0.2
        bloom(input.x, input.y + 6, radius * 2.6 * breathe, 0.32, [255, 150, 30], core)
      }
      if (input.line > 0.985 && outro <= 0) {
        const pulse = (Math.sin(now / 180) + 1) / 2
        ctx.strokeStyle = rgba(glow, 0.45 * (1 - pulse))
        ctx.beginPath()
        ctx.arc(input.x, input.y, 8 + pulse * 26, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    } else {
      trail.length = 0
    }

    if (shotFlash > 0 && outro <= 0) shotFlash = Math.max(0, shotFlash - dt * 2)

    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i]
      spark.vy += 220 * dt
      spark.x += spark.vx * dt
      spark.y += spark.vy * dt
      spark.life -= spark.decay * dt
      if (spark.life <= 0) {
        sparks.splice(i, 1)
        continue
      }
      ctx.fillStyle = rgba(spark.hot > 0.7 ? core : glow, spark.life)
      ctx.fillRect(spark.x, spark.y, spark.size, spark.size)
    }

    ctx.globalCompositeOperation = "source-over"
    raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (running) return
    running = true
    raf = requestAnimationFrame(frame)
  }

  return {
    paint(input: LaserPaint) {
      latest = input
      start()
    },
    resize,
    destroy() {
      running = false
      cancelAnimationFrame(raf)
    },
  }
}
