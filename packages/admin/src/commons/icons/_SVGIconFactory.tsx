import {  JSX, JSXElement, mergeProps, splitProps } from "solid-js"
import { Dynamic, DynamicProps } from "solid-js/web"

// Takes svg attributes and children and returns a function that accept svg attributes and returns a JSX element
export default function SVGIconFactory(props : JSX.SvgSVGAttributes<SVGSVGElement> , children : JSXElement){
  const [oldClasses, oldProps] = splitProps(props, ["class"]);
  return (props : JSX.SvgSVGAttributes<SVGSVGElement>) => {
    const [classes, _props] = splitProps(props, ["class"]);
    const newProps = mergeProps(oldProps, _props, {xmlns:"http://www.w3.org/2000/svg"})
    return <Dynamic component="svg" {...newProps} class={"w-full h-full icon " + (oldClasses ? oldClasses : '') + " " + (classes ? classes : '')}>
      {children}
    </Dynamic>
  }
}