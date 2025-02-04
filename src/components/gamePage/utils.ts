import { GameModeType, SquareValue, ProcessMoveParams } from "../../types";
interface WinnerAndCombination {
    winner: string | null;
    combination: number[] | null;
  }

const gameModes: string[] = ['Standard', 'Half', "AI"];
  
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
    return gameModes.includes(value);
};
  export const processMove = ({
    index,
    squares,
    role,
    gameMode,
    skills,
    activeSkill,
    updateSkills
  }: ProcessMoveParams): { marker: SquareValue; isValid: boolean } => {
    const copySquares = [...squares];
    const currentValue = copySquares[index];
    let marker: SquareValue = null;
    let isValid = true;
    // if (activeSkill !== null && activeSkill !== 'borrow') {
    //   alert('Ра');
    //   return { marker: null, isValid: false };
    // }
    if (currentValue === 'X' || currentValue === 'O') {
      if (activeSkill === 'borrow' && skills.borrow > 0) {
        alert('Нельзя стереть завершенную клетку');
      }
      isValid = false; // Клетка уже занята
    } else if (gameMode === 'Half') {
      if (currentValue === null) {
        if ( activeSkill === 'borrow') {
          alert('Нельзя стереть пустую клетку');
          return { marker: null, isValid: false };
        }
        marker = role === 'X' ? 'X_HALF' : 'O_HALF'; // Половинный ход
      } else if (currentValue === 'X_HALF' && role === 'X' && !activeSkill) {
        marker = 'X'; // Завершение крестика
      } else if (currentValue === 'O_HALF' && role === 'O' && !activeSkill) {
        marker = 'O'; // Завершение нолика
    } else if (
      (currentValue === 'X_HALF' && role === 'O') ||
      (currentValue === 'O_HALF' && role === 'X')
    ) {
      // Проверяем лимит стираний и является ли скил активированным
      if (skills.borrow > 0 && activeSkill !== 'borrow') {
        alert('Для стирания половинчатых клеток активируйте скил "borrow"');
        return { marker: null, isValid: false };
      }
      if (skills.borrow > 0 && activeSkill === 'borrow') {
        marker = null; // Стираем половинчатую клетку
        updateSkills({
          ...skills,
          borrow: skills.borrow - 1
        });
      } else {
        alert('Лимит стираний исчерпан');
        isValid = false; // Нельзя стирать, лимит исчерпан
      }
    } else {
        isValid = false; // Нельзя завершить чужой половинчатый ход
      }
    } else if (gameMode === 'Standard') {
      marker = role; // Стандартный ход
    }
    
    return { marker, isValid };
  };
