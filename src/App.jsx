import { AppContext } from "./context/app-context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorRoute from "./components/ErrorRoute";
import Scores from "./components/Scores";
import Auth from "./components/Auth";
import Game from "./components/Game";
//hooks
import { useColorMode } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";

//css
import "./App.css";

function App() {
  //variables de control
  const [username, setUsername] = useState(null);
  const [userScore, setUserScore] = useState(0); //puntuación temporal de la partida
  const [hoursDiff, setHoursDiff] = useState(0);

  const { colorMode, toggleColorMode } = useColorMode();

  //función para manejar la introducción de usuario y guardado en localStorage
  const handleSetUsername = useCallback((user) => {
    setUsername(user);
    console.log("User introducido es: " + user);

    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (storedData && storedData.username) {
      //si ya hay un usuario anterior
      storedData.username = user;
      localStorage.setItem("userData", JSON.stringify(storedData));
    } else {
      localStorage.setItem("userData", JSON.stringify({ username: user }));
    }
  });

  const handleUpdateUserScore = useCallback((increment) => {
    setUserScore(userScore + increment); //incrementamos la puntuación del jugador

    const storedData = JSON.parse(localStorage.getItem("userData"));
    storedData.userScore = userScore + increment;
    localStorage.setItem("userData", JSON.stringify(storedData));
  });

  //función para resetear el juego y mantener solo el tiempo que ha pasado desde la ultima partida
  const handleResetGame = useCallback(() => {
    localStorage.setItem(
      "userData",
      JSON.stringify({
        username: username,
        lastPlayed: new Date(),
        userScore: userScore,
      })
    );
    //reseteamos variables
    setHoursDiff(0);
    setUserScore(0);
    setUsername(null);
  });

  //se ejecutará cada vez que la página se recargue
  useEffect(() => {
    //con eso forzamos a que el la página esté siempre en modo claro
    if (colorMode == "dark") toggleColorMode();

    //localstorage
    const storedData = JSON.parse(localStorage.getItem("userData"));

    //ponemos la variable userScore en el estado
    if (storedData && storedData.userScore) {
      //para recordar la puntuación en la tabla de puntuaciones
      setUserScore(storedData.userScore);
    }

    //tenemos que comprobar que el usuario haya jugado la partida ya
    if (storedData && storedData.lastPlayed) {
      var currentDate = new Date();
      var storedDate = new Date(storedData.lastPlayed);
      //calculamos directamente aquí la diferencia temporal entre la última
      //vez que jugó el jugador y hoy
      setHoursDiff(
        (currentDate.getTime() - storedDate.getTime()) / (1000 * 60 * 60)
      );

      /* console.log(
        "hour diff: " +
          (currentDate.getTime() - storedDate.getTime()) / (1000 * 60 * 60)
      ); */
    } else {
      //si es la primera vez que vienes automaticamente puedes jugar
      setHoursDiff(25);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        username: username,
        userScore: userScore,
        lastPlayed: hoursDiff,
        updateUsername: handleSetUsername,
        resetGame: handleResetGame,
        updateUserScore: handleUpdateUserScore,
      }}
    >
      <BrowserRouter>
        <main>
          <Routes>
            {hoursDiff > 24 && (
              <>
                <Route path="/" element={<Auth />} />
                <Route path="main" element={<Game />} />
              </>
            )}

            <Route path="scores" element={<Scores />} />
            <Route path="*" element={<ErrorRoute />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
