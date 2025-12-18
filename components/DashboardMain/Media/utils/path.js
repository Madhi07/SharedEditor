

import { getCarousel, updateSlides } from "./apiPaths/carousel"
import { reelsPath } from "./apiPaths/reels"





const PATH_CONFIG = {
    reels: {
        POST: (id) => `/reels/${id ? `${id}/create/` : ""}`,
        GET_WITHOUT_ID: () => `${reelsPath}`,
        GET: (id) => `${reelsPath}${id ? `${id}/` : ""}`,
        UPDATE: (id) => `/reels/${id}/update/`,
        DELETE: (id) => `/reels/${id}/delete/`,
    },

    carousel: {
        POST: (id) => `/blog/${id ? `${id}/create/` : ""}`,
        GET_WITHOUT_ID: () => `${getCarousel}`,
        GET: (id) => `${getCarousel}${id ? `${id}/` : ""}`,
        // UPDATE: (id) => `${updateSlides}${id ? `${id}/` : ""}`,
        UPDATE_SLIDE: (id) => `${updateSlides}${id ? `${id}/` : ""}`,
        DELETE: (id) => `/blog/${id}/delete/`,
    }

    
}




export const getPath = (subcategory, method, id=null) => {
  const config = PATH_CONFIG[subcategory]
  if (!config) {
    throw new Error(`Unknown subcategory: ${subcategory}`);
  }

  if (method === "GET") {
    return id ? config.GET(id) : config.GET_WITHOUT_ID();
  }

   return config[method](id);


  
};