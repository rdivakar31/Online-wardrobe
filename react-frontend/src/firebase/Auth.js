import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext(null);

//通过React.createContext创建了一个新的Context对象AuthContext。Context在React中用于跨组件传递数据，避免了通过每个组件手动传递props的麻烦。
//AuthContext将用于提供一个全局的认证状态，使得应用中的任何组件都可以访问当前认证的用户信息。
//AuthProvider是一个React组件，它接受任何子组件作为children。这个组件的目的是监听Firebase的认证状态变化，并将当前用户状态通过AuthContext.Provider提供给所有子组件。
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // 正确地传递 `auth` 对象和回调函数给 `onAuthStateChanged`
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // 清理订阅
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {children}
    </AuthContext.Provider>
  );
};