import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/Api";
import { defaultConfig } from "../config/Config";

const UserConfigContext = createContext();

export const UserConfigProvider = ({ children }) => {
  const [userConfig, setUserConfig] = useState(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserConfig = async () => {
      try {
        setIsLoading(true);
        const config = await api.userConfig.getUserConfig();
        setUserConfig(config);
      } catch (error) {
        console.error("Error fetching user config:", error);
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

export const useUserConfig = () => useContext(UserConfigContext);
