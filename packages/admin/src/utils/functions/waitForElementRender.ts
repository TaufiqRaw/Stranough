export function waitForElementRender(el :HTMLElement, callback : (el: HTMLElement) => void){
  const resizeObserver = new ResizeObserver(entries => {
    const lastEntry = entries.pop();
  
    if (!lastEntry) {
      return;
    }

    if(lastEntry.contentRect.width === 0 && lastEntry.contentRect.height === 0){
      return;
    }
    
    callback(el);
  
    resizeObserver.disconnect();
  });
  
  resizeObserver.observe(el);
}