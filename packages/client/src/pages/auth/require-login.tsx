import { useNavigate } from "@solidjs/router";
import { JSX, Show, createEffect, on } from "solid-js";
import { useAuthCtx } from "~/commons/contexts/auth.context";


export function RequireLogin(props: { 
  children: JSX.Element,
  adminOnly?: boolean
}) {
  const authContext = useAuthCtx()!;
  const navigate = useNavigate();

  createEffect(on(authContext.user.get, (val)=>{
    if(typeof val === 'string' || val === undefined){
      return navigate('/login');
    }

    if(props.adminOnly && !val?.isAdmin){
      navigate('/unauthorized');
    }
  }))
  return (
    <Show when={typeof authContext.user.get() !== 'string' && !!authContext.user.get()}>
      {props.children}
    </Show>
  );
}