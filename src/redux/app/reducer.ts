export interface AppState {
  loading: boolean;
  error: string | null;
  initialized?: boolean;
}

const INITIAL_STATE: AppState = {
  loading: true,
  error: null,
  initialized: false,
};

type Action = { type: string; payload?: any };

export default function appReducer(
  state: AppState = INITIAL_STATE,
  action: Action
): AppState {
  switch (action.type) {
    case "APP/SET_LOADING":
      return { ...state, loading: !!action.payload };
    case "APP/SET_ERROR":
      return { ...state, error: action.payload ?? null, loading: false };
    case "APP/SET_INITIALIZED":
      return { ...state, initialized: !!action.payload };
    case "APP/RESET":
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}
