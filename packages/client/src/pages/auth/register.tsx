import { A, useNavigate } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { ServerDtos } from "stranough-server";
import { axios } from "~/commons/axios-instance";
import { Input } from "~/commons/components/input";

export function Register(){
const [username, setUsername] = createSignal('');
const [password, setPassword] = createSignal('');
const [email, setEmail] = createSignal('');
const [error, setError] = createSignal<string | undefined>();
const navigate = useNavigate();

const register = async ()=>{
  try{
    if(username() === '' || password() === '' || email() === ''){
      setError('Username, password, dan email harus diisi');
      return;
    }
    if(password().length < 8){
      setError('Password minimal 8 karakter');
      return;
    }
    if(!email().includes('@')){
      setError('Email tidak valid');
      return;
    }
    if(username().length < 4){
      setError('Username minimal 4 karakter');
      return;
    }

    await axios.post<ServerDtos.RegisterDto>('/auth/register', {
      username : username(),
      password : password(),
      email : email(),
    })
    navigate('/login');

  }catch(e){
    setError('Terjadi kesalahan pada server');
  }
  
}


return <div class="w-full h-screen grid place-content-center bg-slate-300 relative">
  <Show when={error()}>
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 p-2 bg-red-200 border border-red-500 text-red-500 rounded-md">
      {error()}
    </div>
  </Show>
  <div class="bg-slate-50 p-5 w-80 flex flex-col gap-2">
    <div class="flex flex-col rounded-md gap-2">
      <span class="text-sm -mb-1">Username</span>
      <Input
        class="w-full"
        placeholder="Username"
        value={username()}
        oninput={(e) => {
          setUsername(e.currentTarget.value);
        }}
      />
      <span class="text-sm -mb-1">Email</span>
      <Input
        class="w-full"
        placeholder="Email"
        value={email()}
        oninput={(e) => {
          setEmail(e.currentTarget.value);
        }}
        type="email"
      />
      <span class="text-sm -mb-1">Password</span>
      <Input
        class="w-full"
        type="password"
        placeholder="Username"
        value={password()}
        oninput={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />
      <button class="bg-[#D10D0F] text-white p-2 rounded-md" onclick={register}>Register</button>
    </div>
    <div>
      <span class="text-gray-500">Sudah punya akun? <A href="/login" class="text-[#D10D0F]">Login</A></span>
    </div>
  </div>
</div>
}