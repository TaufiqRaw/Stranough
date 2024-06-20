import { For, JSX, createEffect, createSignal, onMount } from "solid-js"
import {Swiper as _Swiper} from "swiper"
import { SwiperOptions } from "swiper/types";

export function Swiper<T>(props :{
  items : T[],
  slide : (item : T)=>JSX.Element,
  slidesPerView ?: number,
  spaceBetween ?: number,
  breakpoints?: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
}
}){
  const [swiper, setSwiper] = createSignal<_Swiper | undefined>(undefined);
  let swiperContainer : HTMLDivElement | undefined;

  onMount(()=>{
    const swiper = new _Swiper(swiperContainer!, {
      slidesPerView: props.slidesPerView ?? "auto",
      breakpoints : props.breakpoints,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
    setSwiper(swiper);
  })

  createEffect(()=>{
    props.items && swiper()!.update();
  })

  return <div class="swiper w-full" ref={swiperContainer}>
    <div class="swiper-wrapper">
      <For each={props.items}>
        {(item)=>(
          <div class="swiper-slide">
            {props.slide(item)}
          </div>
        )}
      </For>
    </div>
    {/* <div class="swiper-pagination"></div> */}

    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>

    <div class="swiper-scrollbar"></div>
  </div>
}