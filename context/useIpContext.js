import { createContext, useState, useContext, useEffect } from 'react';

const IpContext = createContext();
export const IpProvider = ({ children }) => {
    const [ipConfigData, setIpConfigData] = useState({});

    useEffect(() => {
        getIpConfigData();
    }, []);

    const getIpConfigData = async () => {
        try {
            const res = await fetch("https://ipapi.co/json/");
            if (res?.status === 200) {
                const data = await res?.json();
                setIpConfigData(data);
            }
            else {
                setIpConfigData({});
            }
        }
        catch (e) { }
    }


    return (
        <IpContext.Provider value={{ ipConfigData, setIpConfigData }}>
            {children}
        </IpContext.Provider>
    );
};

export const useIpContext = () => useContext(IpContext);