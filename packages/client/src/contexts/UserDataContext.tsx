import { Accessor, createContext, useContext } from "solid-js";
import createStoredSignal from "../utils/createStoredSignal";

interface UserData {
  isBottomSideMenuSwiped : [
    Accessor<boolean>,
    {
      swiped : ()=>void,
    }
  ]
}

const UserDataContext = createContext<UserData>();

export function UserDataProvider(props : any){
  const [_isBottomSideMenuSwiped, setIsBottomSideMenuSwiped] = createStoredSignal<boolean>('isBottomSideMenuSwiped', false);

  const isBottomSideMenuSwiped : UserData = {
    isBottomSideMenuSwiped : [
      _isBottomSideMenuSwiped,
      {
        swiped : ()=>setIsBottomSideMenuSwiped(true)
      }
    ]
  }
  
  return <UserDataContext.Provider value={isBottomSideMenuSwiped}>
    {props.children}
  </UserDataContext.Provider>
} 

export function useUserData(){
  return useContext(UserDataContext);
}