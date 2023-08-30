import { UserManager, User, WebStorageStateStore } from 'oidc-client-ts';

export interface IUserData {
  userData: string;
  timestamp: string;
}
const envEndpoints = import.meta.env;

const config = {
  authority: envEndpoints.VITE_Authority,
  client_id: envEndpoints.VITE_Client_Id,
  client_secret: envEndpoints.VITE_Client_Secret,
  redirect_uri: envEndpoints.VITE_Redirect_Uri,
  response_type: 'code',
  scope: 'openid profile email roles permissions UiTest.API',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  silent_redirect_uri: envEndpoints.VITE_Silent_Redirect_Uri,
};

const userManager = new UserManager(config);
const handleSignInCallback = async (): Promise<User | string> => {
  try {
    const user = await userManager.signinRedirectCallback();
    return user;
  } catch (error) {
    return 'Ошибка при обработке ответа после авторизации:';
  }
};
const signIn = async () => {
  try {
    return await userManager.signinRedirect();
  } catch (error) {
    return 'Ошибка при выполнении авторизации:';
  }
};

const signOut = () => {
  userManager.signoutRedirect();
  localStorage.clear();
};

const getUser = async (): Promise<User | string | null> => {
  try {
    const user = await userManager.getUser();
    return user;
  } catch (error) {
    return 'Ошибка при получении данных пользователя:';
  }
};

const fetchDataFromApi = async (
  token: string,
  path: string
): Promise<IUserData | string> => {
  try {
    const response = await fetch(`https://api.intelwash.ru/uitest${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Передаем токен в заголовке запроса
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return 'Пройдите авторизацию нажав кнопку войти';
    }

    const data: IUserData = await response.json();
    return data;
  } catch (error) {
    return 'Обновите авторизацию нажав кнопку Войти';
  }
};

const fetchData = async (path: string) => {
  try {
    const user = await getUser();
    if (user && typeof user !== 'string' && user.access_token) {
      const token: string = user?.access_token;

      const data = await fetchDataFromApi(token, path);

      return data;
    }
    return 'Пользователь не аутентифицирован';
  } catch (error) {
    return 'Ошибка при получении данных:';
  }
};

export default {
  signIn,
  signOut,
  getUser,
  handleSignInCallback,
  fetchData,
  fetchDataFromApi,
};
