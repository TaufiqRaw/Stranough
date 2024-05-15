export function loadImageFromInput(arg : {onLoad : (image : HTMLImageElement)=>void, onError : (error : ErrorEvent)=>void}) {
  return (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    const file = target.files[0];
    const image_element = new Image();
  
    image_element.addEventListener("load", () => arg.onLoad(image_element));

    image_element.addEventListener("error", arg.onError);
  
    image_element.src = URL.createObjectURL(file);
  }
}