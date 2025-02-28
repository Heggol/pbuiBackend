export interface SongState {
    status: string;
    player: number;
    step: number;
    name: string
}

export interface SongStates {
    [bsr: string]: SongState;
}

export interface FlowStep {
    label: string;
    player: number;
    action: string;
}

export interface PBState {
    songStates: SongStates;
    currentFlowStep: number;
}