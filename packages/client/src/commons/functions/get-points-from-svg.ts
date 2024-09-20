import { parse } from "svgson";
import {svgPathProperties} from 'svg-path-properties'
import { Position } from "../interfaces/position";
import { smoothPoints } from "./smooth-points";

export async function getPointsFromSVG(svgString : string) {
  const parsedSvg = await parse(svgString)
  const svgPath = parsedSvg.children.filter((child) =>
    child.name === "path" && child.attributes.d)
    .map((child) =>
        child.attributes.d);

  const properties = new svgPathProperties(svgPath.join(''));

  const points = [] as [number,number][]
  const totalLength = properties.getTotalLength()
  const step = totalLength / 75;
  for (let i = 0; i < properties.getTotalLength(); i += step) {
    const point = properties.getPointAtLength(i)
    points.push([point.x, point.y])
  }
  points.push(points[0])
  
  const smoothedPoints = smoothPoints(points, {
    iteration : 4,
  });
  return smoothedPoints.map((point) => ({
    x: point[0],
    y: point[1],
  }));
}
