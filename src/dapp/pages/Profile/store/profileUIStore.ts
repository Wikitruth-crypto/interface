// import { create } from 'zustand';
// import { ProfileUIState, ProfileUIActions } from '../types/profile.types';

// interface ProfileUIStore extends ProfileUIState, ProfileUIActions {}

// export const useProfileUIStore = create<ProfileUIStore>((set, get) => ({
//   // 状态
//   viewMode: 'grid',
//   selectedItems: [],
//   showFilters: true,
//   cardSize: 'medium',

//   // 操作
//   setViewMode: (mode) => {
//     set({ viewMode: mode });
//   },
  
//   toggleSelection: (tokenId) => {
//     const currentSelected = get().selectedItems;
//     const isSelected = currentSelected.includes(tokenId);
    
//     const newSelected = isSelected
//       ? currentSelected.filter(id => id !== tokenId)
//       : [...currentSelected, tokenId];

//     set({ selectedItems: newSelected });
//   },
  
//   clearSelection: () => {
//     const currentCount = get().selectedItems.length;
//     set({ selectedItems: [] });
//   },
  
//   toggleFilters: () => {
//     const newState = !get().showFilters;
//     set({ showFilters: newState });
//   },
  
//   setCardSize: (size) => {
//     set({ cardSize: size });
//   },
// })); 