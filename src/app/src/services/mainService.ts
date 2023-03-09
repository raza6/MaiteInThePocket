import axios, { AxiosRequestConfig } from 'axios';

enum EHttpVerb {
  GET, POST, PUT, DELETE
} 

class MainService {
  public static async handleApiCall<D = any>(verb: EHttpVerb, url: string, data: D | null = null, conf: AxiosRequestConfig<any> | undefined = undefined) {
    let res;
    try {
      let axiosResponse;
      switch (verb) {
      case EHttpVerb.GET:
        axiosResponse = await axios.get(url, conf);
        break;
      case EHttpVerb.POST:
        axiosResponse =await axios.post(url, data, conf);
        break;
      case EHttpVerb.PUT:
        axiosResponse = await axios.put(url, data, conf);
        break;
      case EHttpVerb.DELETE:
        axiosResponse = await axios.delete(url, conf);
        break;
      }
      res = axiosResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status !== 401) {
          console.error('😰 - Network error', error.response?.status, error.toJSON());
        }
        res = null;
      } else {
        throw error;
      }
    }
    return res;
  }
}

export { MainService, EHttpVerb };
