import SpinnerSrc from '~/commons/assets/spinner.svg';
import RedSpinnerSrc from '~/commons/assets/red-spinner.svg';
import { mergeProps } from 'solid-js';
export function Spinner(_props : {
  type ?: 'normal' | 'red',
  class ?: string
}){
  const props = mergeProps({type : 'normal'}, _props);
  return <div class="flex justify-center items-center h-full">
    <div class="animate-spin rounded-full ">
      <img src={
        props.type === 'normal' ? SpinnerSrc : RedSpinnerSrc
      } alt="spinner" class={props.class ? props.class : 'h-16 w-16'} />
    </div>
  </div>
}