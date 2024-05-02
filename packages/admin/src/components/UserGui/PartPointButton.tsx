export default function PartPointButton(props: {
  isActive: boolean;
  isFocus : boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
  name: string;
}) {
  return (
    <div
      onClick={props.onClick}
      onMouseOver={props.onHover}
      onMouseLeave={props.onLeave}
      class={"flex items-center gap-2 group border py-1 px-2 rounded-md " + (props.isFocus ? 'border-blue-500' : 'border-gray-500 hover:border-white-950 cursor-pointer')}
    >
      <div class={"w-3 h-3 rounded-full " + (props.isActive ? 'bg-blue-500' : ' border border-gray-500')} />
      <span class="pointer-events-none">{props.name}</span>
    </div>
  );
}
