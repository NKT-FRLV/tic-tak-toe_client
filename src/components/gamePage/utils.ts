import { GameModeType, SquareValue, ProcessMoveParams } from "../../types";
interface WinnerAndCombination {
    winner: string | null;
    combination: number[] | null;
  }
  
export const calculateWinner = (squares: (string | null)[]): WinnerAndCombination | null => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
        if ( !squares[a]?.includes('HALF') && squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], combination: [a, b, c] };;
        }
    }
    if (squares.every((square) => square !== null && !square.includes('HALF'))) {
        return { winner: 'Ничья', combination: null };;
    }
    return null;
};

export const isGameModeType = (value: string | null): value is GameModeType => {
    if (value === null) return false;
    return ['Standard', 'Half', 'Blitz'].includes(value);
};
  
export const processMove = ({
    index,
    squares,
    role,
    gameMode,
  }: ProcessMoveParams): { marker: SquareValue; isValid: boolean } => {
    const copySquares = [...squares];
    const currentValue = copySquares[index];
    let marker: SquareValue = null;
    let isValid = true;
  
    if (currentValue === 'X' || currentValue === 'O') {
      isValid = false; // Клетка уже занята
    } else if (gameMode === 'Half') {
      if (currentValue === null) {
        marker = role === 'X' ? 'X_HALF' : 'O_HALF'; // Половинный ход
      } else if (currentValue === 'X_HALF' && role === 'X') {
        marker = 'X'; // Завершение крестика
      } else if (currentValue === 'O_HALF' && role === 'O') {
        marker = 'O'; // Завершение нолика
    } else if (currentValue === 'X_HALF' && role === 'O') {
        marker = null;
      } else if (currentValue === 'O_HALF' && role === 'X') {
        marker = null;
      } else {
        isValid = false; // Нельзя завершить чужой половинчатый ход
      }
    } else if (gameMode === 'Standard') {
      marker = role; // Стандартный ход
    }
    
    return { marker, isValid };
  };