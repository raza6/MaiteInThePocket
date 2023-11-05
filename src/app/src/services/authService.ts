import config from '../config';
import { AuthCheck } from '../types/user';
import { EHttpVerb, MainService } from './mainService';

class AuthService {
  public static async checkAuth(): Promise<AuthCheck> {
    console.info('📫 - Check auth');
    const res = await MainService.handleApiCall(EHttpVerb.GET, `${config.API_URL}/auth/check`, null);
    console.info('👏 - Check auth', res);
    return res;
  }

  public static async logout(): Promise<string> {
    console.info('📫 - Logout');
    const res = await MainService.handleApiCall(EHttpVerb.POST, `${config.API_URL}/auth/logout`, null);
    console.info('👏 - Logout', res);
    return res;
  }
}

export default AuthService;