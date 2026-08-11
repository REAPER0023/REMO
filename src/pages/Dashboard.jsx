import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  MessageSquare,
  Clock,
  Flame,
  Target,
  Plus,
  Play,
  Pause,
  Square,
} from "lucide-react";

import { useChat } from "../context/ChatContext";
import { useSettings } from "../context/SettingsContext";
import { useStudy } from "../context/StudyContext";

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const secs = seconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function Dashboard() {
  const navigate = useNavigate();

  const { chats } = useChat();

  const { settings } = useSettings();

  const {
    studyData,
    isStudying,
    elapsedSeconds,
    startStudy,
    pauseStudy,
    stopStudy,
  } = useStudy();

  const dailyGoal =
    settings.dailyGoal || 60;

  /* ===============================
     TODAY
  =============================== */

  const today = new Date();

  const todayKey =
    today.toDateString();

  const studyMinutesToday = useMemo(() => {
    return studyData.sessions
      .filter(
        (session) =>
          new Date(session.date).toDateString() ===
          todayKey
      )
      .reduce(
        (total, session) =>
          total + session.duration,
        0
      ) / 60;
  }, [studyData.sessions, todayKey]);

  const currentSessionMinutes =
    elapsedSeconds / 60;

  const totalToday =
    studyMinutesToday +
    currentSessionMinutes;

  const progress = Math.min(
    Math.round(
      (totalToday / dailyGoal) * 100
    ),
    100
  );


  /* ===============================
     STREAK
  =============================== */

  const studyDates = useMemo(() => {
    return new Set(
      studyData.sessions.map(
        (session) =>
          new Date(
            session.date
          ).toDateString()
      )
    );
  }, [studyData.sessions]);

  let streak = 0;

  const checkDate = new Date();

  while (
    studyDates.has(
      checkDate.toDateString()
    )
  ) {
    streak++;

    checkDate.setDate(
      checkDate.getDate() - 1
    );
  }


  /* ===============================
     WEEK
  =============================== */

/* ===============================
   WEEK
=============================== */

const weeklyData = useMemo(() => {
  const now = new Date();

  // JavaScript:
  // Sunday = 0
  // Monday = 1
  // ...
  // Saturday = 6
  //
  // Convert it so Monday = 0
  const mondayOffset =
    (now.getDay() + 6) % 7;

  const monday = new Date(now);

  monday.setDate(
    now.getDate() - mondayOffset
  );

  monday.setHours(0, 0, 0, 0);

  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);

    date.setDate(
      monday.getDate() + i
    );

    const key = date.toDateString();

    const minutes =
      studyData.sessions
        .filter(
          (session) =>
            new Date(
              session.date
            ).toDateString() === key
        )
        .reduce(
          (total, session) =>
            total + session.duration,
          0
        ) / 60;

    days.push({
      label: date.toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
        }
      ),

      minutes,

      isToday:
        date.toDateString() ===
        now.toDateString(),
    });
  }

  return days;
}, [studyData.sessions]);

  /* ===============================
     CHAT COUNT
  =============================== */

  const totalChats =
    chats.length;


  /* ===============================
     TIMER
  =============================== */

  const handleStudyButton = () => {
    if (isStudying) {
      pauseStudy();
    } else {
      startStudy();
    }
  };


  return (
    <main className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            Your study progress at a glance.
          </p>
        </div>

        <button
          className="dashboard-new-chat"
          onClick={() =>
            navigate("/chat")
          }
        >
          <Plus size={18} />

          New Chat
        </button>

      </div>


      {/* STATS */}

      <section className="dashboard-stats">

        <div className="dashboard-stat">

          <div className="dashboard-stat-icon">
            <Clock size={20} />
          </div>

          <div>

            <span>
              Study Today
            </span>

            <strong>
              {Math.floor(
                totalToday / 60
              )}h{" "}
              {Math.floor(
                totalToday % 60
              )}m
            </strong>

            <small>
              / {dailyGoal} min goal
            </small>

          </div>

        </div>


        <div className="dashboard-stat">

          <div className="dashboard-stat-icon">
            <Flame size={20} />
          </div>

          <div>

            <span>
              Study Streak
            </span>

            <strong>
              {streak} days
            </strong>

            <small>
              Keep building it
            </small>

          </div>

        </div>


        <div className="dashboard-stat">

          <div className="dashboard-stat-icon">
            <MessageSquare size={20} />
          </div>

          <div>

            <span>
              Conversations
            </span>

            <strong>
              {totalChats}
            </strong>

            <small>
              Total chats
            </small>

          </div>

        </div>


        <div className="dashboard-stat">

          <div className="dashboard-stat-icon">
            <Target size={20} />
          </div>

          <div>

            <span>
              Goal Progress
            </span>

            <strong>
              {progress}%
            </strong>

            <small>
              Today
            </small>

          </div>

        </div>

      </section>


      {/* STUDY SESSION */}

      <section className="dashboard-card focus-card">

        <div className="dashboard-card-header">

          <div>

            <h2>
              Focus Session
            </h2>

            <p>
              Start a study session and let Remo
              track your time.
            </p>

          </div>

          <Clock size={22} />

        </div>


        <div className="focus-timer">

          {formatTime(
            elapsedSeconds
          )}

        </div>


        <div className="focus-controls">

          <button
            onClick={handleStudyButton}
          >

            {isStudying ? (
              <>
                <Pause size={17} />
                Pause
              </>
            ) : (
              <>
                <Play size={17} />
                Start
              </>
            )}

          </button>


          <button
            className="stop-session"
            onClick={stopStudy}
            disabled={
              elapsedSeconds === 0
            }
          >

            <Square size={16} />

            Finish Session

          </button>

        </div>

      </section>


      {/* GOAL */}

      <section className="dashboard-card">

        <div className="dashboard-card-header">

          <div>

            <h2>
              Today's Goal
            </h2>

            <p>
              Stay consistent with your target.
            </p>

          </div>

          <Target size={22} />

        </div>


        <div className="goal-display">

          <strong>
            {Math.floor(totalToday)}
          </strong>

          <span>
            / {dailyGoal} min
          </span>

        </div>


        <div className="goal-progress">

          <div
            style={{
              width: `${progress}%`,
            }}
          />

        </div>


        <p className="goal-message">

          {progress >= 100
            ? "Daily goal completed! 🔥"
            : `${dailyGoal - Math.floor(
                totalToday
              )} minutes remaining.`}

        </p>

      </section>


      {/* WEEKLY ACTIVITY */}

      <section className="dashboard-card">

        <div className="dashboard-card-header">

          <div>

            <h2>
              Weekly Activity
            </h2>

            <p>
              Your study time over the last 7 days.
            </p>

          </div>

        </div>


        <div className="weekly-chart">

          {weeklyData.map((day) => {

            const height = Math.min(
              (day.minutes / dailyGoal) *
                100,
              100
            );

            return (
              <div
                className="week-day"
                key={day.label}
              >

                <div className="week-bar">

                  <div
                    style={{
                      height: `${height}%`,
                    }}
                  />

                </div>

                <span>
                  {day.label}
                </span>

                <small>
                  {Math.round(
                    day.minutes
                  )}m
                </small>

              </div>
            );
          })}

        </div>

      </section>


      {/* RECENT CHATS */}

      <section className="dashboard-card">

        <div className="dashboard-card-header">

          <div>

            <h2>
              Recent Chats
            </h2>

            <p>
              Continue where you left off.
            </p>

          </div>

          <MessageSquare size={22} />

        </div>


        {chats.length === 0 ? (

          <div className="empty-activity">

            <MessageSquare size={30} />

            <h3>
              No conversations yet
            </h3>

            <p>
              Start chatting with Remo.
            </p>

            <button
              onClick={() =>
                navigate("/chat")
              }
            >
              Start a Chat
            </button>

          </div>

        ) : (

          <div className="activity-list">

            {chats
              .slice(0, 5)
              .map((chat) => (

                <div
                  className="activity-item"
                  key={chat.id}
                  onClick={() =>
                    navigate("/chat")
                  }
                >

                  <div className="activity-icon">

                    <MessageSquare
                      size={18}
                    />

                  </div>

                  <div>

                    <strong>
                      {chat.title ||
                        "New Chat"}
                    </strong>

                    <span>
                      {chat.messages?.length ||
                        0}{" "}
                      messages
                    </span>

                  </div>

                </div>

              ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Dashboard;