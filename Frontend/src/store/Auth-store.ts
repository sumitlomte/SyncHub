import { createStore } from '@tanstack/store'
import type { User } from "../types/user";

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

export function saveUserToLocalStorage(user: User) {
  try {
    localStorage.setItem('user', JSON.stringify(user));
    userStore.setState((state) => ({ ...state, user }));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
}

export function clearUserFromLocalStorage() {
  try {
    localStorage.removeItem('user');
    userStore.setState((state) => ({ ...state, user: null }));
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error);
  }
} 