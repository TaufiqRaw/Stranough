import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { For, Show, createMemo, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { axios } from "~/commons/axios-instance";
import { Button } from "~/commons/components/button";
import { UserType, useAuthCtx } from "~/commons/contexts/auth.context";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";

export function UserDashboard() {
  const queryClient = useQueryClient();
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(8);

  const authCtx = useAuthCtx()!;

  const items = createQuery(()=>({
    queryKey : ["orders", {
      page : page(),
      limit : limit(),
      userOnly : !(authCtx.user?.get() as UserType).isAdmin ,
      userId : (authCtx.user?.get() as UserType).id
    }],
    queryFn : async ()=>{
      const {data} = await axios.get<[ServerEntities.Order[], number]>(`/orders?page=${page()}&limit=${limit()}`);
      return data;
    }
  }))

  const maxPage = createMemo(()=> items.data? Math.ceil(items.data[1] / limit()): 1);

  async function deleteItem(id : number){
    if(confirm("Apakah anda yakin akan menghapus item ini?")){
      await axios.delete(`/orders/${id}`);
      queryClient.invalidateQueries({
        queryKey : ["orders"]
      });
    }
  }
  return <div class="p-3 min-h-screen bg-gray-200">
    <div class="flex flex-col lg:flex-row gap-2">
      <Button href={`/builder/new`} class="w-full lg:w-max">
        <span>Buat Gitar Baru</span>
      </Button>
      <Button onClick={authCtx.logout} class="bg-red-500 flex items-center gap-2 justify-center">
        <span>Logout</span>
        <i class="bi bi-box-arrow-right"/>
      </Button>
    </div>
    <Show when={items.isSuccess}>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
        <For each={items.data![0]}>
          {item => <div class="bg-white p-2 rounded-md group relative max-h-72 h-min overflow-hidden">
            <div class="absolute right-2 p-2 rounded-md border border-gray-500 bg-white shadow-md gap-2 flex z-10">
              <Button href={`/builder/${item.id}`}>
                <i class="bi bi-pen"/>
              </Button>
              <Button class="!bg-red-500" onClick={()=>deleteItem(item.id)}>
                <i class="bi bi-trash"/>
              </Button>
            </div>
            <div class="p-2">
              <div class="text-gray-500 flex flex-col">
                <Show when={item.isFinished}
                  fallback={<span class="text-yellow-500 font-bold">Belum Selesai</span>}
                >
                  <span class="text-green-500 font-bold">Selesai</span>
                </Show>
                <span class="text-gray-950">Deskripsi :</span>
                <span>{item.preferencesDescription}</span>
                <Show when={(item.preferencesImgLength ?? 0) > 0}>
                  <span class="text-gray-950 mt-2">Gambar :</span>
                  <div class="grid grid-cols-2 gap-2">
                    <For each={Array.from({length : item.preferencesImgLength!}, (_, i)=> `preference-${item.oldId}-${i}.png`)}>
                      { (url) => <img src={serverImgUrl(url)} class="object-cover rounded-md overflow-hidden"/>}
                    </For>
                  </div>
                </Show>
              </div>
              <div class="bg-gradient-to-t from-white to-[#ffffff00] h-10 absolute bottom-0 w-full" />
            </div>
          </div>}
        </For>
      </div>
      <div class="flex justify-center gap-2 mt-3">
        <Button onClick={()=> setPage(page() - 1)} disabled={page() === 1}>
          Prev
        </Button>
        <Button onClick={()=> setPage(page() + 1)} disabled={page() >= maxPage()}>
          Next
        </Button>
      </div>
    </Show>
  </div>
}