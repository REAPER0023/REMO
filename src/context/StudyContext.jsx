import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const StudyContext = createContext();

const defaultStudyData = {
  sessions: [],
};

function loadStudyData() {
  const saved = localStorage.getItem("remoStudyData");

  if (!saved) {
    return defaultStudyData;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultStudyData;
  }
}

export function StudyProvider({ children }) {
  const [studyData, setStudyData] =
    useState(loadStudyData);

  const [isStudying, setIsStudying] =
    useState(false);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  useEffect(() => {
    localStorage.setItem(
      "remoStudyData",
      JSON.stringify(studyData)
    );
  }, [studyData]);

  useEffect(() => {
    if (!isStudying) return;

    const timer = setInterval(() => {
      setElapsedSeconds(
        (prev) => prev + 1
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [isStudying]);

  const startStudy = () => {
    setIsStudying(true);
  };

  const pauseStudy = () => {
    setIsStudying(false);
  };

  const stopStudy = () => {
    if (elapsedSeconds < 1) {
      setIsStudying(false);
      return;
    }

    const session = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: elapsedSeconds,
    };

    setStudyData((prev) => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        session,
      ],
    }));

    setElapsedSeconds(0);
    setIsStudying(false);
  };

  const resetStudyData = () => {
    setStudyData(defaultStudyData);
    setElapsedSeconds(0);
    setIsStudying(false);
  };

  return (
    <StudyContext.Provider
      value={{
        studyData,
        isStudying,
        elapsedSeconds,
        startStudy,
        pauseStudy,
        stopStudy,
        resetStudyData,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  return useContext(StudyContext);
}