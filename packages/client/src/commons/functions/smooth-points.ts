export type integer = number

export type SmoothOption = {
  factor?: number
  iteration?: integer
  dimension?: integer
}

export interface MinSizeArray<T> extends Array<T> {}

export function isMinSizeArray<T>(
  array: ArrayLike<T>,
  length: number
): array is MinSizeArray<T> {
  return (<MinSizeArray<T>>array).length >= length
}

export interface Point extends MinSizeArray<number> {}

export class Path extends Array<Point> {}

export function smoothPoints(
  path: Path,
  { factor, iteration, dimension }: SmoothOption = {
    factor: 0.75,
    iteration: 1
  }
) {
  if (dimension && !path.every((point) => isMinSizeArray(point, dimension)))
    throw new Error('Dimension min size Error')
  if (!factor) factor = 0.75
  if (!iteration) iteration = 1
  while (iteration > 0) {
    path = singlesmooth(path, factor, dimension)
    iteration--
  }
  return path
}

function singlesmooth(
  points: Path = [],
  factor: number = 0.75,
  dimension?: number
) {
  const output = []
  if (points.length > 0) output.push(Array.from(points[0]))
  for (const i in points) {
    const current = dimension ? points[i].slice(0, dimension) : points[i]
    const next = points[Number(i) + 1]
    if (!next) break
    const Q = current.map(
      (axis, index) => factor * axis + (1 - factor) * next[index]
    )
    const R = current.map(
      (axis, index) => (1 - factor) * axis + factor * next[index]
    )
    output.push(Q)
    output.push(R)
  }
  if (points.length > 1) output.push(Array.from(points[points.length - 1]))
  return output
}