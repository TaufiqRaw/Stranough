import SimpleBar from 'simplebar';
import {createEffect, createSignal, For, onCleanup, onMount} from 'solid-js';
import Dragable, { DragableController } from '../Dragable';
import Lottie from 'lottie-web';
import { useUserData } from '../../contexts/UserDataContext';

export default function BottomChildSideMenu(
  props : {
    isSideMenuExpanded : () => boolean,
    setIsSideMenuExpanded : (value : boolean) => void,
    onSelectSubmenu : (index : number) => void,
    selectedSubmenuIndex : () => number,
    parentRef : HTMLDivElement | undefined,
    items : { title : string }[],
  }
){
  const {isSideMenuExpanded, setIsSideMenuExpanded, parentRef} = props;

  const [isSwiped, {swiped}] = useUserData()!.isBottomSideMenuSwiped;

  let swipeAnimContainerRef : HTMLDivElement | undefined;
  let dragableRef : DragableController | undefined;
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement | undefined>();
  const [collapsedMenuRef, setCollapsedMenuRef] = createSignal<HTMLDivElement | undefined>();

  const [sideMenuWidth, _setSideMenuWidth] = createSignal(0);
  const [sideMenuTranslateX, setSideMenuTranslateX] = createSignal(0);
  const [recenterLength, setRecenterLength] = createSignal(0);
  const [isSideMenuScrolling, setIsSideMenuScrolling] = createSignal(false);

  function recalculateRecenterLength(){
    const activeItem = collapsedMenuRef()!.children[props.selectedSubmenuIndex()] as HTMLDivElement;
    const activeItemOffsetY = activeItem.offsetTop + activeItem.clientHeight / 2;
    const containerMidY = containerRef()!.offsetHeight / 2;
    const centeredY = containerMidY - activeItemOffsetY;
    setRecenterLength(centeredY);
  }

  createEffect(recalculateRecenterLength);

  function onSideMenuPointerEnter(e:TouchEvent){
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;

    console.log(x, y)

    if(!isSideMenuExpanded()){
      setIsSideMenuExpanded(true);
      console.log('start dragging')
      dragableRef?.startDragging(x,y);
    }
  }
  
  function setSideMenuWidth() {
    if(parentRef){
      if(parentRef.offsetWidth == 0){
        setTimeout(setSideMenuWidth, 100);
      }
      _setSideMenuWidth(parentRef.offsetWidth * 0.3);
    }
  }

  createEffect(()=>{
    isSideMenuExpanded() ? setSideMenuTranslateX(0) : setSideMenuTranslateX(-sideMenuWidth() + 16)

  });

  
  onMount(()=>{
    setSideMenuWidth();

    if(swipeAnimContainerRef){
      var swipeAnimation = Lottie.loadAnimation({
        container: swipeAnimContainerRef!,
        path: 'swipe-up.json', // Required
        renderer: 'svg', // Required
        loop: true, // Optional
        autoplay: true, // Optional
        name: "Hello World", // Name for future reference. Optional.
      })
    }
    
    window.addEventListener('resize', setSideMenuWidth);
    onCleanup(() => window.removeEventListener('resize', setSideMenuWidth));
  });
  

  return <div
      class={'bg-[#4C4C4C] h-44 transform shrink-0 touch-none overflow-hidden relative transition-transform '}
      style={{
        width: sideMenuWidth() + 'px',
        transform: `translateX(${sideMenuTranslateX()}px)`
      }}
      onTouchStart={onSideMenuPointerEnter}
      onClick={()=>{!isSideMenuExpanded() && setIsSideMenuExpanded(true)}}
      ref={setContainerRef}
    > 
      {!isSwiped() && <div class='absolute top-1 w-full h-16 transform scale-[1.9]' ref={swipeAnimContainerRef}></div>}
      <Dragable  
        allowDrag
        controllerRef={(r)=>dragableRef = r}
        onEnter={()=>{
          setIsSideMenuScrolling(true);
        }}
        onDrag={(e)=>{
          const {deltaY, containerRef, resetDelta, forceStop} = e;
          
          const isNextPageAvailable = props.selectedSubmenuIndex() < props.items.length - 1;
          const isPrevPageAvailable = props.selectedSubmenuIndex() > 0;

          const thisItemHeight = containerRef.children[props.selectedSubmenuIndex()].clientHeight;
          let minScroll = recenterLength() + thisItemHeight;
          let maxScroll = recenterLength() - thisItemHeight;

          if(isPrevPageAvailable){
            const prevItemHeight = containerRef.children[props.selectedSubmenuIndex() - 1].clientHeight;
            minScroll = recenterLength() + (thisItemHeight/2 + prevItemHeight/2);
          }

          if(isNextPageAvailable){
            const nextItemHeight = containerRef.children[props.selectedSubmenuIndex() + 1].clientHeight;
            maxScroll = recenterLength() - (thisItemHeight/2 + nextItemHeight/2);
          }

          const yCentered = deltaY + recenterLength();
          const y = Math
            .max(Math.min(yCentered, minScroll), maxScroll)

          if(Math.abs(minScroll - y) == 0 && isPrevPageAvailable ){
            props.onSelectSubmenu(props.selectedSubmenuIndex() - 1)
            swiped();
            resetDelta();
          }else if(Math.abs(maxScroll - y) == 0 && isNextPageAvailable ){
            props.onSelectSubmenu(props.selectedSubmenuIndex() + 1)
            swiped();
            resetDelta();
          }else{
            containerRef.style.transform = `translateY(${y}px)`;
          }

        }}
        onExit={(e)=>{
          const {deltaY, containerRef} = e;
          setIsSideMenuScrolling(false);
          containerRef.style.transform = `translateY(${recenterLength()}px)`;
        }}
        style={{transform : `translateY(${recenterLength()}px)` }}
        class={'side-menu pr-0 px-2 transform py-20 ' + (isSideMenuScrolling() ? '' : 'transition-transform')}
        ref = {setCollapsedMenuRef}
      >
        <For each={props.items}>
          {(item, i) => <div 
            class={'item ' 
              + (props.selectedSubmenuIndex() == i() ? 'active ' : '')}
          >
            {isSideMenuExpanded() ? item.title : <div class='text-end pr-1'>•</div> }
          </div>}
        </For>
      </Dragable>
  </div>
}