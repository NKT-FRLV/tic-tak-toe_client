export type GameModeType = 'Standard' | 'Half';
export type RoleType = 'X' | 'O' | ''; 
export type RoleProps = { role: Exclude<RoleType, ''>, skills: Skills };
export type WinnerType = 'X' | 'O' | 'Ничья';
export type SkillType = 'borrow' | 'lock' | 'unlock';
export type Skills = Record<SkillType, number>;
export type PleyerType = {id: string, name: string, role: string, score: number, skills?: Skills}
export type SquareValue = 'X' | 'O' | 'X_HALF' | 'O_HALF' | '' | null;

export interface StateServer {
    gameMode: GameModeType;
    players: PleyerType[];
    state: {
        squares: SquareValue[];
        currentPlayer: WinnerType;
        locks: Record<number, number>;
    };
};

export interface ReternedServerState {
    players: PleyerType[];
    squares: SquareValue[];
    currentPlayer: WinnerType;
    updeteSkills: boolean;
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
    skills: Skills;
    activeSkill: SkillType | null;
    updateSkills: (newSkills: Skills) => void;
}