import { A, useNavigate } from "@solidjs/router";
import { AxiosError } from "axios";
import { Show, createSignal } from "solid-js";
import { Input } from "~/commons/components/input";
import { UserType, useAuthCtx } from "~/commons/contexts/auth.context";

export function Login(){
  const authContext = useAuthCtx()!;
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal<string | undefined>();
  const navigate = useNavigate();

  if(authContext.user.get() !== undefined && typeof authContext.user.get() !== 'string'){
    if((authContext.user.get() as UserType).isAdmin){
      navigate('/admin');
    }else{
      navigate('/');
    }
  }

  const login = async ()=>{
    try{
      const res = await authContext.login(
        username(),
        password()
      );
      if(typeof res === 'string'){
        if(res === 'loading'){
          return;
        }
        setError('Username atau password salah');
        return;
      }
      if(res.isAdmin){
        navigate('/admin');
      }else{
        navigate('/');
      }

    }catch(e){
      if(e instanceof AxiosError){
        if(e.response?.status === 401){
          setError('Username atau password salah');
        }
        if(e.response?.status === 500){
          setError('Terjadi kesalahan pada server');
        }
      }
    }
    
  }


  return <div class="w-full h-screen grid place-content-center bg-slate-300 relative">
    <Show when={error()}>
      <div class="absolute top-4 left-1/2 transform -translate-x-1/2 p-2 bg-red-200 border border-red-500 text-red-500 rounded-md">
        {error()}
      </div>
    </Show>
    <div class="flex flex-col gap-6 items-center justify-center">
      <img src="/assets/stranough-logo.jpg" class="w-40 h-40" alt="" />
      <div class="bg-slate-50 p-5 w-80 flex flex-col gap-2">
        <div class="flex flex-col rounded-md gap-2">
          <span class="text-sm -mb-1">Username / Email</span>
          <Input
            class="w-full"
            placeholder="Username / Email"
            value={username()}
            oninput={(e) => {
              setUsername(e.currentTarget.value);
            }}
          />
          <span class="text-sm -mb-1">Password</span>
          <Input
            class="w-full"
            type="password"
            placeholder="password"
            value={password()}
            oninput={(e) => {
              setPassword(e.currentTarget.value);
            }}
            onkeydown={(e) => {
              if(e.key === 'Enter'){
                login();
              }
            }}
          />
          <button class="bg-[#D10D0F] text-white p-2 rounded-md" onclick={login}>Login</button>
        </div>
        <div>
          <span class="text-gray-500">Belum punya akun? <A href="/register" class="text-[#D10D0F]">Daftar</A></span>
        </div>
      </div>
    </div>
  </div>
}