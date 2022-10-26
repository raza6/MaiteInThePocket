import axios from 'axios';
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

  private static async handleApiCall<D = any>(verb: EHttpVerb, url: string, data: D | null = null) {
    let res;
    try {
      let axiosResponse;
      switch (verb) {
      case EHttpVerb.GET:
        axiosResponse = await axios.get(url);
        break;
      case EHttpVerb.POST:
        axiosResponse =await axios.post(url, data);
        break;
      case EHttpVerb.PUT:
        axiosResponse = await axios.put(url, data);
        break;
      case EHttpVerb.DELETE:
        axiosResponse = await axios.delete(url);
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