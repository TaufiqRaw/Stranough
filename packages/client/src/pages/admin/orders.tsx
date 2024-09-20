import { useNavigate } from "@solidjs/router";
import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { For, Show, Suspense, createMemo, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { axios } from "~/commons/axios-instance";
import { Button } from "~/commons/components/button";

export function Orders(){
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(12);
  const items = createQuery(()=>({
    queryKey : ["orders", {
      page : page(),
      limit : limit(),
      finishedOnly : true
    }],
    queryFn : async ()=>{
      const {data} = await axios.get<[ServerEntities.Order[], number]>(`/orders?page=${page()}&limit=${limit()}&finishedOnly=true`);
      return data;
    }
  }))

  const maxPage = createMemo(()=> items.data? Math.ceil(items.data[1] / limit()): 1);

  async function deleteItem(id : number){
    if(confirm("Are you sure you want to delete this item?")){
      await axios.delete(`/orders/${id}`);
      queryClient.invalidateQueries({
        queryKey : ["orders"]
      });
    }
  }

  return <div class="p-3 min-h-full bg-gray-200">
    <Suspense>  
      <Show when={items.isSuccess}>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 mt-12 rounded-md overflow-hidden">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3">Username</th>
              <th scope="col" class="px-6 py-3">Email</th>
              <th scope="col" class="px-6 py-3">Ordered At</th>
            </tr>
          </thead>
          <tbody>
            <For each={items.data![0]}>
              { item => 
                <tr class="bg-white border-b group hover:bg-blue-100 cursor-pointer relative"
                  onClick={()=> navigate(`/builder/${item.id}`)}
                >
                  
                  <td class="px-6 py-4">
                      {item.createdBy.username as unknown as string}
                  </td>
                  <td class="px-6 py-4">
                      {item.createdBy.email as unknown as string}
                  </td>
                  <td class="px-6 py-4">
                      {item.createdAt as unknown as string}
                      <div class="hidden group-hover:block absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Button class="!bg-red-500" onClick={(e)=>{e.stopPropagation();deleteItem(item.id)}}>
                          <i class="bi bi-trash"/>
                        </Button>
                      </div>
                  </td>
                </tr>
              }
            </For>
          </tbody>
        </table>
        <div class="flex justify-center gap-2 mt-3">
          <Button onClick={()=> setPage(page() - 1)} disabled={page() === 1}>
            Prev
          </Button>
          <Button onClick={()=> setPage(page() + 1)} disabled={page() >= maxPage()}>
            Next
          </Button>
        </div>
      </Show>
    </Suspense>
  </div>
}