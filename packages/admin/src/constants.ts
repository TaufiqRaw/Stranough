export namespace Constants {
  export const serverUrl = `${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}`;
  export const serverImgUrl = `${serverUrl}/${import.meta.env.VITE_SERVER_IMAGES_URL}`;
}
