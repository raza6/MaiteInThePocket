import axios, { AxiosResponse } from 'axios';
import { Recipe, RecipeSummaryShort } from '../types/recipes';
const API_URL = 'http://maite.raza6.fr/mp';

class MainService {
  public static async searchSummary(term: string, pageIndex = 0, pageSize = 20): Promise<Array<RecipeSummaryShort>> {
    console.info('📫 - Search summary recipes');
    const res = await axios.post(`${API_URL}/recipe/search`, { searchTerm: term, pageIndex, pageSize });
    console.info('👏 - Search summary recipes', res);
    return MainService.handleAPIResponse(res);
  }

  public static async getRecipe(id: string): Promise<Recipe> {
    console.info('📫 - Get recipe detail');
    const res = await axios.get(`${API_URL}/recipe/${id}`);
    console.info('👏 - Get recipe detail', res);
    return MainService.handleAPIResponse(res);
  }

  private static handleAPIResponse(response: AxiosResponse<any,any>) {
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  }
}

export default MainService;