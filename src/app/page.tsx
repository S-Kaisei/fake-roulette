"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Gift } from "lucide-react";

const items = [
  "A",
  "B",
  "C",
  "D",
];
const rinerWeight = "B";
const rounds = 100;
const weightHeight = 80;
const spinDuration = 10;

export default function Home() {
  const [hasSpun, setHasSpun] = useState(false);
  const [isSpining, setIsSpining] = useState(false);
  const [weightsArray, setWeightsArray] = useState<string[]>([]);
  const [winningItem, setWinningItem] = useState<string | null>(null);
  const [animationStyle, setAnimationStyle] = useState({});
  const rouletteRef = useRef<HTMLDivElement>(null);

  const createRoulette = useCallback(() => {
    const newWeightsArray = Array.from(
      { length: rounds + 2 },
      () => items,
    ).flat();
    setWeightsArray(newWeightsArray);
    setHasSpun(false);
    setWinningItem(null);
    setAnimationStyle({});
  }, []);

  const spinRoulette = useCallback(() => {
    if (hasSpun) {
      const roulette = rouletteRef.current;
      if (roulette) {
        roulette.style.transition = "none";
        roulette.style.transform = "translateY(0)";
        void roulette.offsetWidth;
        createRoulette();
      }
    } else {
      setIsSpining(true);

      const selectedIndex = items.indexOf(rinerWeight);
      const totalWeights = items.length;
      const container = document.querySelector(
        ".roulette-container",
      ) as HTMLElement;

      if (container) {
        const containerHeight = container.offsetHeight;
        const totalScrollHeight =
          (rounds * totalWeights + selectedIndex + 1) * weightHeight;
        const centerOffset =
          Math.floor(containerHeight / 2) - Math.floor(weightHeight / 2) - 40;
        const roulette = rouletteRef.current;
        if (roulette) {
          setTimeout(() => {
            roulette.style.transition = `transform ${spinDuration}s ease-out`;
            roulette.style.transform = `translateY(-${totalScrollHeight - centerOffset}px)`;
          }, 50);
        }

        setTimeout(() => {
          const weightDivs = document.querySelectorAll(".weight");
          weightDivs.forEach((div) => {
            (div as HTMLElement).style.opacity = "0.5";
            (div as HTMLElement).style.transform = "scale(1)";
          });

          const selectedDiv = weightDivs[
            rounds * totalWeights + selectedIndex
          ] as HTMLElement;
          selectedDiv.style.opacity = "1";
          selectedDiv.style.transform = "scale(1)";
          selectedDiv.style.transition = "none";

          setWinningItem(items[selectedIndex]); 
          setAnimationStyle({
            transform: "scale(2) rotate(360deg)",
            transition: "transform 1s ease-in-out, opacity 1s ease-in-out",
          });

          setTimeout(() => {
            setIsSpining(false);
          }, 1500);

          setHasSpun(true);
        }, spinDuration * 1000);
      }
    }
  }, [hasSpun, createRoulette]);

  useEffect(() => {
    createRoulette();
  }, [createRoulette]);

  return (
    <div className="bg-gradient-to-b from-[#1F3861] to-[#102442] min-h-screen flex flex-col items-center justify-center py-10 px-4 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 bg-[#2fc1e92e] rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#D5C1FC20] rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Title with elegant arc */}
      <div className="relative w-full max-w-[500px] h-[120px] mb-8">
        <svg
          className="absolute top-5 left-1/2 transform -translate-x-1/2 w-full h-auto"
          viewBox="0 0 500 200"
        >
          <defs>
            <path
              id="arcPath"
              d="M 50,120 A 220,120 0 0,1 450,120"
              fill="none"
              stroke="transparent"
            />
          </defs>
          <text fontSize="30" fontWeight="bold" fill="white" fontFamily="serif">
            <textPath href="#arcPath" startOffset="50%" textAnchor="middle">
              Sample Message
            </textPath>
          </text>
        </svg>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#44BEFF] to-transparent"></div>
      </div>

      {/* Prize list */}
      <div className="prizes-container w-full max-w-[400px] text-center mb-10">
        <h2 className="text-xl font-serif font-bold mb-4 flex items-center justify-center gap-2">
          <Gift className="w-5 h-5 text-[#44BEFF]" />
          <span>景品一覧</span>
          <Gift className="w-5 h-5 text-[#44BEFF]" />
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {items.map((item, index) => (
            <div
              key={index}
              className="px-4 py-3 rounded-lg bg-[#ffffff0f] backdrop-blur-sm text-white shadow-lg border border-[#ffffff15] hover:bg-[#ffffff18] transition-all duration-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Roulette */}
      <div className="roulette-container w-full max-w-[500px] h-[240px] overflow-hidden relative flex items-center justify-center rounded-xl border border-[#ffffff20] bg-[#00000020] backdrop-blur-sm shadow-xl">
        {/* Indicator */}
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-[80px] border-y-2 border-[#44BEFF40] z-10 pointer-events-none">
          <div className="absolute left-0 w-3 h-full bg-gradient-to-r from-[#44BEFF40] to-transparent"></div>
          <div className="absolute right-0 w-3 h-full bg-gradient-to-l from-[#44BEFF40] to-transparent"></div>
        </div>

        <div
          ref={rouletteRef}
          className="roulette absolute top-1/2 transform -translate-y-1/2 transition-all duration-[4000ms] ease-out w-full"
        >
          {weightsArray.map((weight, index) => (
            <div
              key={index}
              className={`weight w-full h-[80px] flex items-center justify-center text-xl font-bold transition-all duration-500 ${
                index % 2 === 0 ? "text-[#D5C1FC]" : "text-[#44BEFF]"
              }`}
              style={weight === winningItem ? animationStyle : {}}
            >
              {weight}
            </div>
          ))}
        </div>
      </div>

      {/* Control button */}
      <div className="controls mt-8 text-center">
        <button
          onClick={spinRoulette}
          disabled={isSpining}
          className="px-8 py-3 bg-gradient-to-r from-[#2fc1e9] to-[#2f86e9] text-white font-bold rounded-full hover:from-[#2fb1e9] hover:to-[#2f76e9] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {isSpining ? "回転中..." : hasSpun ?  "リセット": "スタート"}
        </button>
      </div>

      {/* Add keyframes for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
