import { useContext,useEffect} from "react";
import { AuthCOntext } from "../auth.context";
import { login, register, getMe, logout } from "../services/auth.api";
export const useAuth = () => {
  const context = useContext(AuthCOntext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      const data = await logout();
      setUser(null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() =>{
      const getAndsetUser = async ()=>{
        try{
          const data = await getMe();
          setUser(data.user)
        }catch(err){

        }
        finally{
          setLoading(false)
        }
      }
      getAndsetUser()
  },[])

  return { user, loading, handleLogin, handleRegister, handleLogout };
};
