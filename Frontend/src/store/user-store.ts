import { createStore } from '@tanstack/store'

interface UserState {
  user: { name: string; id: string; role: string } | null;
}

export const userStore = createStore<UserState>({
  user: null,
})

userStore.setState((state) => ({
  ...state, 
    user: getUserFromLocalStorage(),
})) 

export function getUserFromLocalStorage() {
  const userData = localStorage.getItem('user');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            return null;
        }           
    }
    return null;
}

export function saveUserToLocalStorage(user: { name: string; id: number, role: string }) {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
}

export function clearUserFromLocalStorage() {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error);
  }
} 