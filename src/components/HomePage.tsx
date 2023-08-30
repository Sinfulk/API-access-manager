import { useEffect, useState } from 'react';
import { UserProfile } from 'oidc-client-ts';
import AuthService, { IUserData } from './AuthService';
import './homePage.scss';

const envEndpoints = import.meta.env;

function Home() {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [userProfile, setUserProfile] = useState<
    UserProfile | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignIn = () => {
    AuthService.signIn();
  };

  const handleSignOut = async () => {
    AuthService.signOut();
  };

  const handleFetchData = async (path: string) => {
    setIsLoading(true);
    const data = await AuthService.fetchData(path);

    if (typeof data !== 'string') {
      setUserData(data);
    } else {
      setMessage(data);
    }

    setIsLoading(false);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleGetUser = async () => {
    setIsLoading(true);
    await AuthService.handleSignInCallback();

    const user = await AuthService.getUser();

    if (typeof user !== 'string') {
      setUserProfile(user?.profile);
    } else {
      setMessage(user);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <main>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <div className="buttons">
            {userProfile ? <h1>{userProfile.name}</h1> : null}
            {message ? <h2>{message}</h2> : null}
            <button type="button" onClick={handleSignIn}>
              Войти
            </button>
            <button type="button" onClick={handleSignOut}>
              Выйти
            </button>
            <button
              type="button"
              onClick={() => handleFetchData(envEndpoints.VITE_TestData)}
            >
              DATA
            </button>
            {userProfile?.role === 'TestAdminRole' ? (
              <button
                type="button"
                onClick={() =>
                  handleFetchData(envEndpoints.VITE_TestData_AdminData)
                }
              >
                ADMIN DATA
              </button>
            ) : null}
          </div>
          <div className="contentApi">
            {userData ? (
              <>
                <div>{userData?.userData}</div>
                <div>{userData?.timestamp}</div>
              </>
            ) : (
              <h2>No Content</h2>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default Home;
