import { GraphicsContext, type GraphicsOptions, Graphics as pxGraphics, Texture, ColorSource, FillStyleInputs, Matrix, GraphicsPath, PointData } from 'pixi.js'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type DrawCall =
  | ['fill', FillStyleInputs?]
  | ['fill', ColorSource, number]
  | ['stroke', ...Parameters<GraphicsContext['stroke']>]
  | ['texture', Texture, ColorSource?, number?, number?, number?, number?]
  | ['texture', Texture]
  | ['beginPath']
  | ['cut']
  | ['arc', number, number, number, number, number, boolean?]
  | ['arcTo', number, number, number, number, number]
  | ['arcToSvg', number, number, number, number, number, number, number]
  | ['bezierCurveTo', number, number, number, number, number, number, number?]
  | ['closePath']
  | ['ellipse', number, number, number, number]
  | ['circle', number, number, number]
  | ['path', GraphicsPath]
  | ['lineTo', number, number]
  | ['moveTo', number, number]
  | ['quadraticCurveTo', number, number, number, number, number?]
  | ['rect', number, number, number, number]
  | ['roundRect', number, number, number, number, number?]
  | ['poly', number[] | PointData[], boolean?]
  | ['star', number, number, number, number, number?, number?]
  | ['svg', string]
  | ['restore']
  | ['save']
  | ['getTransform']
  | ['resetTransform']
  | ['rotateTransform', number]
  | ['scaleTransform', number, number?]
  | ['setTransform', number | Matrix, number?, number?, number?, number?, number?]
  | ['transform', number | Matrix, number?, number?, number?, number?, number?]
  | ['translateTransform', number, number?]
  | ['clear']
  
export type DrawCalls = Array<DrawCall>
export type ExtendedGraphics<Data extends object> = pxGraphics & Data
export type GraphicsProps<Data extends object> = CommonProps<pxGraphics, Data> &
  Omit<GraphicsOptions, 'children'> &
  Events & {
    draw?: DrawCalls
    context?: GraphicsContext
  }

export function Graphics<Data extends object = object>(props: GraphicsProps<Data>) {
  const [ours, events, pixis] = splitProps(props, [...CommonPropKeys, 'draw'], EventTypes)

  const graphics = (ours.as || new pxGraphics(pixis)) as ExtendedGraphics<Data>

  createEffect(() => {
    for (const prop in pixis) {
      ;(graphics as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    if (ours.draw) {
      graphics.clear()
      ours.draw.forEach(([method, ...args]) => {
        ;(graphics[method] as any).bind(graphics)(...args)
      })
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      graphics.on(event, handler)
      return () => graphics.off(event, handler)
    })

    onCleanup(() => {
      for (const cleanup of cleanups) {
        cleanup()
      }
    })
  })

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    const uses = props.uses
    if (uses) {
      if (Array.isArray(uses)) {
        cleanups = uses.map(fn => fn(graphics))
      } else {
        cleanups = [uses(graphics)]
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent.addChild(graphics)
  onCleanup(() => {
    parent.removeChild(graphics)
    graphics.destroy()
  })

  return null
}
