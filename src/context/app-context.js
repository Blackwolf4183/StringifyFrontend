import { createContext } from "react";

export const AppContext = createContext({
    username: null,
    userScore: 0,
    lastPlayed: null,
    updateUserScore: () => {},
    updateUsername: () => {},
    resetGame: () => {},
})