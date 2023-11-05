import axios, { AxiosRequestConfig } from 'axios';

enum EHttpVerb {
  GET, POST, PUT, DELETE
} 

class MainService {
  public static async handleApiCall<D = any>(verb: EHttpVerb, url: string, data: D | null = null, conf: AxiosRequestConfig<any> | undefined = undefined) {
    let res;
    const logCong = {
      withCredentials: true,
      headers: { 'Access-Control-Allow-Credentials': true },
      ...conf
    };
    try {
      let axiosResponse;
      switch (verb) {
      case EHttpVerb.GET:
        axiosResponse = await axios.get(url, logCong);
        break;
      case EHttpVerb.POST:
        axiosResponse =await axios.post(url, data, logCong);
        break;
      case EHttpVerb.PUT:
        axiosResponse = await axios.put(url, data, logCong);
        break;
      case EHttpVerb.DELETE:
        axiosResponse = await axios.delete(url, logCong);
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
