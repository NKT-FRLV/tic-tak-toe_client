export type GameModeType = 'Standard' | 'Half' |  'Blitz';
export type RoleType = 'X' | 'O' | ''; 
export type RoleProps = { role: Exclude<RoleType, ''> }
export type WinnerType = 'X' | 'O' | 'Ничья';
export type PleyerType = {id: string, name: string, role: string, score: number}
export type SquareValue = 'X' | 'O' | 'X_HALF' | 'O_HALF' | '' | null;

export interface StateServer {
    gameMode: GameModeType;
    players: PleyerType[];
    state: {
        squares: SquareValue[];
        currentPlayer: WinnerType;
    };
};

export interface ReternedServerState {
    players: PleyerType[];
    squares: SquareValue[];
    currentPlayer: WinnerType;
    winCombination: number[] | null;
    winner: WinnerType | null;
}

export interface ServerRestartState {
    players: PleyerType[];
    newSquares: SquareValue[];
    currentPlayer: WinnerType;
}

export interface ProcessMoveParams {
    index: number;
    squares: SquareValue[];
    role: RoleType;
    gameMode: GameModeType;
}