import { A } from "@solidjs/router";

export function Unauthorized(){
  return <div class="flex items-center justify-center h-screen">
  <div class="text-center flex flex-col items-center gap-2">
    <div class="flex items-center">
      <img src="/assets/stranough-logo.jpg" class="w-40 h-40" alt="" />
      <div class="border-2 border-red-500 h-40 w-40 grid place-items-center">
        <div>
          <i class="bi bi-exclamation-triangle text-6xl text-red-500"></i>
          <h1 class="text-6xl text-red-500">403</h1>
        </div>
      </div>
    </div>
    <h2 class="text-2xl mt-2">Anda tidak diizinkan untuk mengakses halaman ini</h2>
    <span class="text-gray-600">Kembali ke halaman <A class="text-red-500 underline" href="/">utama</A></span>
  </div>
  </div>
}