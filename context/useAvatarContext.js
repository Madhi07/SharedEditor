import { createContext, useState, useContext } from 'react';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
    const [audio, setAudio] = useState(null);
    const [blendFrames, setBlendFrames] = useState([]);
    const [animation, setAnimation] = useState("relaxing");

    return (
        <AvatarContext.Provider value={{ audio, setAudio, blendFrames, setBlendFrames, animation, setAnimation }}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatarContext = () => useContext(AvatarContext);