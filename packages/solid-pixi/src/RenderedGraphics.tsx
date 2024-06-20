import { GraphicsContext, Sprite as pxSprite, type SpriteOptions, Graphics as pxGraphics, Renderer, Container } from 'pixi.js'
import { createEffect, onCleanup, splitProps, untrack } from 'solid-js'
import { type Events, EventTypes } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'
import { ParentContext, useParent } from './ParentContext'
import { DrawCalls } from './Graphics'
import { ExtendedSprite } from './Sprite'
import { useApplication } from './Application'

export type RenderedGraphicsProps<Data extends object> = CommonProps<pxSprite, Data> &
  Omit<SpriteOptions, 'texture'> &
  Events &
  Data & {
    draw: DrawCalls
  }

function renderGraphics(draw: DrawCalls, renderer : Renderer, parent : Container) {
  const graphics = new pxGraphics()
  if (draw) {
    draw.forEach(([method, ...args]) => {
      ;(graphics[method] as any).bind(graphics)(...args)
    })
  }

  const g = renderer.generateTexture({antialias : true, target : graphics})
  parent?.emit('textureGenerated', {g})
  return g;
}

export function RenderedGraphics<Data extends object = object>(props: RenderedGraphicsProps<Data>) {
  const [ours, events, pixis] = splitProps(props, [...CommonPropKeys,'draw'], EventTypes)
  const app = useApplication()!;
  const parent = useParent();
  if(!app) throw new Error('RenderedGraphics must be a child of Application')
  const sprite = (ours.as || new pxSprite({...pixis, texture : renderGraphics(ours.draw, app?.renderer, parent)})) as ExtendedSprite<Data>

  createEffect(() => {
    for (const prop in pixis) {
      ;(sprite as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const previousTex = sprite.texture
    sprite.texture = renderGraphics(ours.draw, app.renderer, parent)
    previousTex.destroy(true)
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      sprite.on(event, handler)
      return () => sprite.off(event, handler)
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
        cleanups = untrack(() => uses.map(fn => fn(sprite)))
      } else {
        cleanups = untrack(() => [uses(sprite)])
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  parent.addChild(sprite)
  onCleanup(() => {
    parent?.removeChild(sprite)
    sprite.destroy(true)
  })

  return <ParentContext.Provider value={sprite}>{ours.children}</ParentContext.Provider>
}
