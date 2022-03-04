import axios from "axios";
const API_URL = 'http://localhost:3005'

class MainService {
  static async addStatementFile(file) {
    console.info('📫 - Add statement file');
    const res = await axios.put(`${API_URL}/bk/statement/add`, file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.info('👏 - Statement file returned', res);
  }
}

export default MainService;