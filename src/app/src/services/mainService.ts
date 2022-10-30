import axios, { AxiosRequestConfig } from 'axios';
import { Recipe, RecipeSummarySearchResponse } from '../types/recipes';
const API_URL = 'http://maite.raza6.fr/mp';

enum EHttpVerb {
  GET, POST, PUT, DELETE
} 

class MainService {
  public static async searchSummary(term: string, pageIndex = 0, pageSize = 20): Promise<RecipeSummarySearchResponse> {
    console.info('📫 - Search summary recipes');
    const res = await MainService.handleApiCall(EHttpVerb.POST, `${API_URL}/recipe/search`, { searchTerm: term, pageIndex, pageSize });
    console.info('👏 - Search summary recipes', res);
    return res;
  }

  public static async getRecipe(id: string): Promise<Recipe> {
    console.info('📫 - Get recipe detail');
    const res = await MainService.handleApiCall(EHttpVerb.GET, `${API_URL}/recipe/${id}`);
    console.info('👏 - Get recipe detail', res);
    return res;
  }

  public static async addImgRecipe(id: string, file: File): Promise<Recipe> {
    console.info('📫 - Add recipe image');
    const formData = new FormData();
    formData.append('img', file);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const res = await MainService.handleApiCall(EHttpVerb.POST, `${API_URL}/recipe/img/${id}`, formData, config);
    console.info('👏 - Add recipe image', res);
    return res;
  }

  private static async handleApiCall<D = any>(verb: EHttpVerb, url: string, data: D | null = null, conf: AxiosRequestConfig<any> | undefined = undefined) {
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
        res = null;
        console.error('😰 - Network error', error.response?.status, error.toJSON());
      } else {
        throw error;
      }
    }
    return res;
  }
}

export default MainService;