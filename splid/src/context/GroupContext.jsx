    import React, { useState } from 'react'
    import { createContext } from 'react'
    export const GroupContext = createContext();
    export const GroupProvider = ({ children }) => {
        const [activeGroup, setActiveGroup] = useState(null);
        return (
            <GroupContext.Provider value={{ activeGroup, setActiveGroup }}>
                {children}
            </GroupContext.Provider>
        );
    };
        
   