import { JSX, Show, createContext, createEffect, createSignal, on, onMount, useContext } from "solid-js";
import { SignalObject } from "../interfaces/signal-object";
import { createSignalObject } from "../functions/signal-object.util";
import { axios } from "../axios-instance";
import {jwtDecode} from 'jwt-decode';
import { Spinner } from "../components/spinner";

export type UserType = {
  id : number,
  username : string,
  isAdmin : boolean,
};

type AuthContextType = {
  user : SignalObject<UserType | 'loading' | 'error' | undefined>,
  login : (username : string, password : string)=>Promise<UserType>,
  logout : ()=>void,
};
const authContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider(props : {children : JSX.Element}){
  
  const user = createSignalObject<UserType | 'loading' | 'error' | undefined>('loading');

  const [refreshToken, setRefreshToken] = createSignal<string>();
  const [accessToken, setAccessToken] = createSignal<string>();

  function logout(){
    user.set(undefined);
    setRefreshToken(undefined);
    setAccessToken(undefined);
    localStorage.removeItem('refreshToken');
  }

  async function login(username : string, password : string){
    user.set('loading');
    const {data} = await axios.post('/auth/login', {
      username,
      password,
    })
    const decoded = jwtDecode<{
      id : number,
      username : string,
      isAdmin : boolean,
    }>(data.accessToken);
    setRefreshToken(data.refreshToken);
    setAccessToken(data.accessToken);
    user.set(decoded);
    return decoded;
  };

  createEffect(on(refreshToken,()=>{
    let isRefreshed = false;
    axios.interceptors.response.clear();
    axios.interceptors.response.use(
      response=>response,
      async (error)=>{
        if(error.response.status === 401 && !isRefreshed){
          try{
            isRefreshed = true;
            const {data} = await axios.post('/auth/refresh', {
              refreshToken : refreshToken()
            });
            const decoded = jwtDecode<{
              id : number,
              username : string,
              isAdmin : boolean,
            }>(data.accessToken);
  
            user.set(decoded);
            setAccessToken(data.accessToken);
            return axios.request(error.config);
          }catch(e){
            user.set(undefined);
            setRefreshToken(undefined);
            setAccessToken(undefined);
            return Promise.reject(error);
          }
        }else if(error.response.status === 401 && isRefreshed){
          isRefreshed = false;
          user.set('error');
          setRefreshToken(undefined);
          setAccessToken(undefined);
          return Promise.reject(error);
        }
      }
    );
  }))

  createEffect(on(accessToken,()=>{
    axios.interceptors.request.clear();
    axios.interceptors.request.use(
      config=>{
        config.headers.Authorization = `Bearer ${accessToken()}`;
        return config;
      }
    );
  }));

  createEffect(()=>{
    if(refreshToken()){
      localStorage.setItem('refreshToken', refreshToken()!);
    }
  })
  const [isMounted, setIsMounted] = createSignal(false);

  onMount(async ()=>{
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if(storedRefreshToken){
      try{
        const {data} = await axios.post('/auth/refresh', {
          refreshToken : storedRefreshToken
        });
        const decoded = jwtDecode<{
          id : number,
          username : string,
          isAdmin : boolean,
        }>(data.accessToken);
  
        user.set(decoded);
        setAccessToken(data.accessToken);
      }catch(e){
        user.set(undefined);
        setRefreshToken(undefined);
        setAccessToken(undefined);
        console.log(e);
      }
    }
    setIsMounted(true);
  })

  return <authContext.Provider value={{user, login, logout}}>
    <Show when={isMounted()}
      fallback={<div class="w-full h-screen">
        <div class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <div class="flex flex-col items-center gap-4">
            <img src="/assets/stranough-logo.jpg" class="w-52 h-52" alt="" />
            <Spinner type="red" class="w-10 h-10"/>
          </div>
        </div>
      </div>}
    >
      {props.children}
    </Show>
  </authContext.Provider>
}

export const useAuthCtx = () => {
  return useContext(authContext);
};