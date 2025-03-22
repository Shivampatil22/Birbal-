const { io } = require("socket.io-client");
const { create } = require("zustand");
const { persist } = require("zustand/middleware");

export const useBattleStore = create(
    persist(
        (set, get) => ({
            socket: null, // Socket should not be persisted

            userInfo: {},
            roomId: null,

            connectSocket: () => {
                if (!get().socket) {
                    const socket = io("http://localhost:8000");

                    // Register matchFound event once
                    socket.on("matchFound", ({ roomId }) => {
                        console.log(`Match Found! Room: ${roomId}`);
                        set({ roomId }); // Store roomId in Zustand
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

            clearUserInfo: () => {
                set({ userInfo: {} });
            }
        }),
        {
            name: "battle-store",
            getStorage: () => sessionStorage, // Use sessionStorage
            partialize: (state) => ({ userInfo: state.userInfo }), // Exclude 'socket' from persistence
            onRehydrateStorage: () => (state) => {
                if (state?.userInfo?.timestamp) {
                    const isExpired = Date.now() - state.userInfo.timestamp > 6 * 60 * 60 * 1000; // 6 hours
                    if (isExpired) {
                        state.userInfo = {}; // Clear expired data
                    }
                }
            }
        }
    )
);
