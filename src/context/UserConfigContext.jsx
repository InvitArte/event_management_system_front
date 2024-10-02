import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/Api";
import { defaultConfig } from "../config/Config";

const UserConfigContext = createContext();

export const UserConfigProvider = ({ children }) => {
  const [userConfig, setUserConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserConfig = async () => {
      try {
        setIsLoading(true);
        const config = await api.userConfig.getUserConfig();

        if (!config || typeof config.userId === "undefined") {
          console.warn("API response does not include userId, using default");
          setUserConfig({
            ...defaultConfig,
            ...config,
            userId: defaultConfig.userId,
          });
        } else {
          setUserConfig(config);
        }
      } catch (error) {
        console.error("Error fetching user config:", error);
        setUserConfig(defaultConfig);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserConfig();
  }, []);

  const updateUserConfig = async (newConfig) => {
    try {
      await api.userConfig.updateUserConfig({ config_data: newConfig });
      setUserConfig(newConfig);
    } catch (error) {
      console.error("Error updating user config:", error);
    }
  };


  return (
    <UserConfigContext.Provider
      value={{ userConfig, updateUserConfig, isLoading }}
    >
      {children}
    </UserConfigContext.Provider>
  );
};

export const useUserConfig = () => {
  const context = useContext(UserConfigContext);
  if (!context) {
    throw new Error("useUserConfig must be used within a UserConfigProvider");
  }
  return context;
};

export default () => {
  const { userConfig, isLoading } = useUserConfig();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Configuration</h1>
      <p>User ID: {userConfig?.userId || "Not available"}</p>
      <pre>{JSON.stringify(userConfig, null, 2)}</pre>
    </div>
  );
};
