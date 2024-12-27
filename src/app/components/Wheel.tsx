import { useState } from "react";
import styles from "./CustomWheel.module.css";

const CustomWheel: React.FC<{ onFinished: (winner: string) => void }> = ({ onFinished }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const options = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const spinWheel = () => {
    const randomSpin = Math.floor(Math.random() * 360) + 1800; // Random rotation between 1800 and 2160 degrees
    setRotation(randomSpin);
    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false);
      const winningIndex = Math.floor(((randomSpin % 360) / 36) + options.length) % options.length;
      onFinished(options[winningIndex]);
    }, 3000); // Correspond au temps d'animation en millisecondes
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.wheel} ${isSpinning ? styles.spin : ""}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {options.map((option, index) => (
          <div key={index} className={styles.segment}>
            {option}
          </div>
        ))}
      </div>
      <button onClick={spinWheel} disabled={isSpinning}>
        Tourner la roue
      </button>
    </div>
  );
};

export default CustomWheel;
