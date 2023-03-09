import config from '../config';
import { EHttpVerb, MainService } from './mainService';

class AuthService {
  public static async checkAuth(): Promise<any> {
    console.info('📫 - Check auth');
    const res = await MainService.handleApiCall(EHttpVerb.GET, `${config.API_URL}/auth/check`, null, 
      { 
        withCredentials: true, 
        headers: { 'Access-Control-Allow-Credentials': true }
      }
    );
    console.info('👏 - Check auth', res);
    return res;
  }
}

export default AuthService;