import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeLabFilter: string | null;
  searchQuery: string;
  activeTab: 'chat' | 'marketplace' | 'agents' | 'research';
  modelDetailModalId: string | null;
}

const initialState: UiState = {
  sidebarOpen: true,
  rightPanelOpen: true,
  activeLabFilter: null,
  searchQuery: '',
  activeTab: 'chat',
  modelDetailModalId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebar: (state, action: PayloadAction<boolean>) => { state.sidebarOpen = action.payload; },
    toggleRightPanel: (state) => { state.rightPanelOpen = !state.rightPanelOpen; },
    setLabFilter: (state, action: PayloadAction<string | null>) => { state.activeLabFilter = action.payload; },
    setSearchQuery: (state, action: PayloadAction<string>) => { state.searchQuery = action.payload; },
    setActiveTab: (state, action: PayloadAction<UiState['activeTab']>) => { state.activeTab = action.payload; },
    openModelModal: (state, action: PayloadAction<string>) => { state.modelDetailModalId = action.payload; },
    closeModelModal: (state) => { state.modelDetailModalId = null; },
  },
});

export const { toggleSidebar, setSidebar, toggleRightPanel, setLabFilter, setSearchQuery, setActiveTab, openModelModal, closeModelModal } = uiSlice.actions;
export default uiSlice.reducer;
