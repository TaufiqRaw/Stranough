import { type MeshRopeOptions, MeshRope as pxMeshRope } from 'pixi.js'
import { createEffect, onCleanup, splitProps, untrack } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type ExtendedMeshRope<Data extends object> = pxMeshRope & Data
export type MeshRopeProps<Data extends object> = CommonProps<ExtendedMeshRope<Data>> &
  MeshRopeOptions &
  Events &
  Data

export function MeshRope<Data extends object = object>(props: MeshRopeProps<Data>) {
  const [ours, events, pixis] = splitProps(props, [...CommonPropKeys, 'texture'], EventTypes)

  let meshRope = (ours.as || new pxMeshRope({...pixis, texture : ours.texture})) as ExtendedMeshRope<Data>

  createEffect(() => {
    for (const prop in pixis) {
      ;(meshRope as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(()=>{
    if (ours.texture) {
      const parent = useParent()
      parent.removeChild(meshRope)
      meshRope.destroy()

      meshRope = new pxMeshRope({...pixis, texture : ours.texture}) as ExtendedMeshRope<Data>
      parent.addChild(meshRope)
    }

  })
  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      meshRope.on(event, handler)
      return () => meshRope.off(event, handler)
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
        cleanups = untrack(() => uses.map(fn => fn(meshRope)))
      } else {
        cleanups = untrack(() => [uses(meshRope)])
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent.addChild(meshRope)
  onCleanup(() => {
    parent?.removeChild(meshRope)
  })

  return <ParentContext.Provider value={meshRope}>{ours.children}</ParentContext.Provider>
}
