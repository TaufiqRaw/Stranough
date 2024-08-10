import { pointsOnPath } from "points-on-path";
import { parse } from "svgson";

export async function getPointsFromSVG(svgString : string) {
  const parsedSvg = await parse(svgString)
  const svgPath = parsedSvg.children.filter((child) =>
    child.name === "path" && child.attributes.d)
    .map((child) =>
        child.attributes.d);

  return pointsOnPath(svgPath.join(''), 0.001)[0].map((point) => {
    return {
      x: point[0],
      y: point[1],
      }
  });
}
