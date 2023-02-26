import { Recipe, RecipeSummary, RecipeSummarySearchResponse } from '../types/recipes';
import config from '../config';
import { EHttpVerb, MainService } from './mainSercice';

class RecipeService {
  public static async searchSummary(term: string, pageIndex = 0, pageSize = 20): Promise<RecipeSummarySearchResponse> {
    console.info('📫 - Search summary recipes');
    const res = await MainService.handleApiCall(EHttpVerb.POST, `${config.API_URL}/recipe/search`, { searchTerm: term, pageIndex, pageSize });
    console.info('👏 - Search summary recipes', res);
    return res;
  }

  public static async getRecipe(id: string): Promise<Recipe<RecipeSummary>> {
    console.info('📫 - Get recipe detail');
    const res = await MainService.handleApiCall(EHttpVerb.GET, `${config.API_URL}/recipe/${id}`);
    console.info('👏 - Get recipe detail', res);
    return res;
  }

  public static async addImgRecipe(id: string, file: File): Promise<boolean> {
    console.info('📫 - Add recipe image');
    const formData = new FormData();
    formData.append('img', file);
    const requestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const res = await MainService.handleApiCall(EHttpVerb.POST, `${config.API_URL}/recipe/img/${id}`, formData, requestConfig);
    console.info('👏 - Add recipe image', res);
    return res;
  }

  public static async addRecipe(recipe: Recipe<RecipeSummary>): Promise<string> {
    console.info('📫 - Add recipe');
    const res = await MainService.handleApiCall(EHttpVerb.PUT, `${config.API_URL}/recipe/add`, recipe);
    console.info('👏 - Add recipe', res);
    return res;
  }

  public static async deleteRecipe(id: string): Promise<void> {
    console.info('📫 - Delete recipe');
    await MainService.handleApiCall(EHttpVerb.DELETE, `${config.API_URL}/recipe/${id}`);
    console.info('👏 - Delete recipe');
    return;
  }

  public static async editRecipe(id: string, recipe: Recipe<RecipeSummary>): Promise<Recipe<RecipeSummary>> {
    console.info('📫 - Edit recipe');
    const res = await MainService.handleApiCall(EHttpVerb.PUT, `${config.API_URL}/recipe/${id}`, recipe);
    console.info('👏 - Edit recipe', res);
    return res;
  }
}

export default RecipeService;