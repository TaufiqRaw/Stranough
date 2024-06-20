import { JSX, Show } from "solid-js";
import { EditorGuiGroup } from "~/commons/components/editor-gui";
import { Input } from "~/commons/components/input";
import { Textarea } from "~/commons/components/textarea";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { ImageType } from "../interfaces/image-type";
import ImageInput from "./image-input";
import { NullableImageTypeSignal } from "../interfaces/image-type-signal";

export function NameDescriptionGroup(
  props : {
    name ?: SignalObject<string | undefined>,
    description ?: SignalObject<string | undefined>,
    placeholder ?: {
      name ?: SignalObject<string>,
      description ?: SignalObject<string>,
    }
    children ?: JSX.Element,
    price ?: SignalObject<number>,
    thumbnail ?: SignalObject<ImageType | null | undefined> | NullableImageTypeSignal,
  }
){
  return <EditorGuiGroup>
    <span class="text-sm -mt-1">Names</span>
    <Input
      class="!bg-gray-800 !text-white-950"
      placeholder="Model Name"
      value={props.name?.get() ?? props.placeholder?.name?.get()}
      oninput={(e) => {
        props.name?.set(e.target.value);
      }}
    />
    <span class="text-sm -mt-1">Description</span>
    <Textarea
      class="!bg-gray-800 !text-white-950"
      placeholder="Description"
      value={props.description?.get() ?? props.placeholder?.description?.get()}
      oninput={(e) => props.description?.set(e.target.value)}
    />
    <span class="text-sm -mt-1">Price</span>
    <Input
        class="!bg-gray-800 !text-white-950"
        value={props.price?.get()}
        oninput={(e) => props.price?.set(parseInt(e.target.value ?? '0'))}
        type="number"
        min={0}
      />

    <Show when={props.thumbnail}>
      <ImageInput
        label={<span class="text-sm">Thumbnail</span>}
        imageFilename={
          props.thumbnail?.get()?.filename
        }
        onLoad={(id) => props.thumbnail?.set(id)}
        onRemove={() => props.thumbnail?.set(null)}
        partType={"body"}
      />
    </Show>
    
    {props.children}
  </EditorGuiGroup>
}