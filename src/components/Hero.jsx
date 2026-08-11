import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RemoOrb from "./RemoOrb";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">

      {/* REMO ORB */}

   <RemoOrb />

      {/* HERO TEXT */}

      <div className="hero-badge">
        <span></span>
        Your AI Study Companion
      </div>

      <h1>
        Meet <span>Remo</span>
      </h1>

      <h2>
        Learn smarter. Understand faster.
      </h2>

      <p>
        Your personal AI study companion for learning,
        asking questions, analyzing files, practicing
        concepts and tracking your progress.
      </p>

      {/* BUTTONS */}

      <div className="hero-buttons">

        <button
          className="hero-primary"
          onClick={() => navigate("/chat")}
        >
          Start Studying
          <ArrowRight size={18} />
        </button>

        <button
          className="secondary"
          onClick={() =>
            document
              .querySelector(".features")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          Explore Remo
        </button>

      </div>

    </section>
  );
}

export default Hero;