// userContext.js
// ... (imports) ...
export const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [adminBtn, setAdminBtn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        // User is logged out
        setUser(null);
        setIsLogged(false);
        setAdminBtn(false);
        setLoading(false);
        return;
      }

      // User is logged in, start async operations
      setLoading(true);

      try {
        const res = await fetch(`${BASE_URL}/api/users/userGet/${firebaseUser.uid}`);
        const data = await res.json();
        setUser(data.result);
        setIsLogged(true);
        setAdminBtn(firebaseUser.email === "joven.serdanbataller21@gmail.com");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser(null);
        setIsLogged(false);
        setAdminBtn(false);
      } finally {
        // All async operations for this auth change are complete
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ isLogged, user, adminBtn, loading }}>
      {children}
    </UserContext.Provider>
  );
};