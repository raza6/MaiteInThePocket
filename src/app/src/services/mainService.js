import axios from "axios";
const API_URL = 'http://maite.raza6.fr/mp'

class MainService {
  static async searchSummary(term, pageIndex = 0, pageSize = 20) {
    console.info('📫 - Search summary recipes');
    const res = await axios.post(`${API_URL}/recipe/search`, { searchTerm: term, pageIndex, pageSize });
    console.info('👏 - Search summary recipes', res);
    return handleAPIResponse(res);
  }

  static handleAPIResponse(response) {
    if (response.status === 200) {
      return res.data
    } else {
      return null;
    }
  }
}

export default MainService;