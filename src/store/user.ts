import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
    userInfo: {
        nickname: string;
        phone: string;
        scope: number;
        avatar?: string;
        created_at: string;
    };
}

interface Action {
    setUserInfo: (value: State['userInfo']) => void;
}

const userStore = create(
    persist<State & Action>(
        set => ({
            userInfo: {
                nickname: '',
                phone: '',
                scope: -999,
                avatar: '',
                created_at: ''
            },
            setUserInfo: value => {
                set(() => ({ userInfo: value }));
            }
        }),
        {
            name: 'user-store',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export { userStore };
