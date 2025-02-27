export interface SongState {
    status: string;
    player: number;
    step: number;
}

export interface SongStates {
    [bsr: string]: SongState;
}

export interface FlowStep {
    label: string;
    player: number;
    action: string;
}

export interface PlayerInfo {
    name: string;
    image: string;
}

export interface PBState {
    songStates: SongStates;
    currentFlowStep: number;
    playerInfo: PlayerInfo[];
}