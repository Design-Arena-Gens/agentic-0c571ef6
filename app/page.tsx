'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

const levels = [
  // Easy levels
  { grid: 3, emoji: '😀', odd: '😃', time: 10 },
  { grid: 4, emoji: '🐶', odd: '🐱', time: 12 },
  { grid: 4, emoji: '⭐', odd: '✨', time: 12 },
  { grid: 5, emoji: '🍎', odd: '🍏', time: 15 },
  { grid: 5, emoji: '🔵', odd: '🔴', time: 15 },

  // Medium levels
  { grid: 6, emoji: '😊', odd: '😉', time: 18 },
  { grid: 6, emoji: '🌙', odd: '☀️', time: 18 },
  { grid: 7, emoji: '💙', odd: '💚', time: 20 },
  { grid: 7, emoji: '🦁', odd: '🐯', time: 20 },
  { grid: 8, emoji: '🌸', odd: '🌺', time: 22 },

  // Hard levels
  { grid: 8, emoji: '😄', odd: '😁', time: 22 },
  { grid: 9, emoji: '🟢', odd: '🟩', time: 25 },
  { grid: 9, emoji: '🌟', odd: '⭐', time: 25 },
  { grid: 10, emoji: '😺', odd: '😸', time: 28 },
  { grid: 10, emoji: '🔷', odd: '🔶', time: 28 },
]

export default function Home() {
  const [level, setLevel] = useState(0)
  const [grid, setGrid] = useState<string[]>([])
  const [oddIndex, setOddIndex] = useState(-1)
  const [timeLeft, setTimeLeft] = useState(levels[0].time)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [showCorrect, setShowCorrect] = useState(false)

  useEffect(() => {
    initLevel(level)
  }, [level])

  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('lost')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  const initLevel = (lvl: number) => {
    if (lvl >= levels.length) {
      setGameState('won')
      return
    }

    const currentLevel = levels[lvl]
    const size = currentLevel.grid * currentLevel.grid
    const newGrid = Array(size).fill(currentLevel.emoji)
    const randomIndex = Math.floor(Math.random() * size)
    newGrid[randomIndex] = currentLevel.odd

    setGrid(newGrid)
    setOddIndex(randomIndex)
    setTimeLeft(currentLevel.time)
    setGameState('playing')
    setShowCorrect(false)
  }

  const handleClick = (index: number) => {
    if (gameState !== 'playing') return

    if (index === oddIndex) {
      setShowCorrect(true)
      setScore(score + timeLeft * 10)

      setTimeout(() => {
        setLevel(level + 1)
      }, 1000)
    } else {
      setTimeLeft(Math.max(0, timeLeft - 3))
    }
  }

  const restart = () => {
    setLevel(0)
    setScore(0)
    setGameState('playing')
    initLevel(0)
  }

  if (gameState === 'won') {
    return (
      <div className={styles.container}>
        <div className={styles.victoryCard}>
          <h1 className={styles.victoryTitle}>🎉 You Won! 🎉</h1>
          <p className={styles.victoryText}>You completed all levels!</p>
          <p className={styles.finalScore}>Final Score: {score}</p>
          <button className={styles.restartButton} onClick={restart}>
            Play Again
          </button>
        </div>
      </div>
    )
  }

  if (gameState === 'lost') {
    return (
      <div className={styles.container}>
        <div className={styles.gameOverCard}>
          <h1 className={styles.gameOverTitle}>⏰ Time's Up! ⏰</h1>
          <p className={styles.gameOverText}>Level {level + 1} was too tricky!</p>
          <p className={styles.finalScore}>Score: {score}</p>
          <button className={styles.restartButton} onClick={restart}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.gameCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Find the Odd One Out</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>Level</span>
              <span className={styles.value}>{level + 1}/{levels.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Time</span>
              <span className={`${styles.value} ${timeLeft <= 5 ? styles.urgent : ''}`}>
                {timeLeft}s
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Score</span>
              <span className={styles.value}>{score}</span>
            </div>
          </div>
        </div>

        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${levels[level].grid}, 1fr)`,
            gridTemplateRows: `repeat(${levels[level].grid}, 1fr)`
          }}
        >
          {grid.map((emoji, index) => (
            <button
              key={index}
              className={`${styles.cell} ${showCorrect && index === oddIndex ? styles.correct : ''}`}
              onClick={() => handleClick(index)}
            >
              {emoji}
            </button>
          ))}
        </div>

        <p className={styles.hint}>💡 Wrong click = -3 seconds penalty!</p>
      </div>
    </div>
  )
}
