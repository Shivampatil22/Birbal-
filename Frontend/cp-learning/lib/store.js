import { io } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBattleStore = create(
    persist(
        (set, get) => ({
            socket: null, // Do not persist socket

            userInfo: {},
            roomData: {},
            problem:{},

            connectSocket: () => {
                if (!get().socket) {
                    const socket = io("http://localhost:8000");

                    // Register event listeners
                    socket.on("matchFound", ({ roomId,opponent }) => {
                        console.log("✅ Match Found! Room:", roomId);
                        set((state) => ({ ...state, roomData:{roomId,opponent} })); // Ensure reactivity
                    });

                    socket.on("sentRoomdata", ({ problem }) => {
                        console.log("📌 Received problem:", problem);
                        set((state) => ({ ...state, problem }));
                    });

                    set({ socket });
                }
            },

            disconnectSocket: () => {
                const socket = get().socket;
                if (socket) {
                    socket.disconnect();
                    set({ socket: null, roomId: null });
                }
            },

            setUserInfo: (data) => {
                
                set({ userInfo: { ...data, timestamp: Date.now() } });
            },

            setRoomData: (data) => {
                set({ roomData: data });
            },

            clearUserInfo: () => {
                set({ userInfo: {} });
            },
        }),
        {
            name: "battle-store",
            getStorage: () => sessionStorage, // Use sessionStorage
            partialize: (state) => ({ userInfo: state.userInfo }), // Exclude socket from persistence
            onRehydrateStorage: () => (state) => {
                if (state?.userInfo?.timestamp) {
                    const isExpired = Date.now() - state.userInfo.timestamp > 6 * 60 * 60 * 1000; // 6 hours
                    if (isExpired) {
                        state.userInfo = {}; // Clear expired data
                    }
                }
            },
        }
    )
);
