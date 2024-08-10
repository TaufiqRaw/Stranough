export function GuardPage(props : {
  description : string,
}){
  return <div class="flex items-center justify-center h-full">
    <div class="text-center">
      {props.description}
    </div>
  </div>
}