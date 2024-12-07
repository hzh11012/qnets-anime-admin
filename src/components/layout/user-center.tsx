import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { userStore } from '@/store/user';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { logout } from '@/apis/auth';
import { LOGIN_URL } from '@/lib/config';
import { useRequest } from 'ahooks';

const UserCenter = () => {
    const userInfo = userStore(state => state.userInfo);
    const { t } = useTranslation();

    const { run: runLogout } = useRequest(logout, {
        manual: true,
        debounceWait: 300,
        onSuccess() {
            window.location.reload();
            window.location.href = `${LOGIN_URL}/?redirect=${encodeURIComponent(window.location.href)}`;
        }
    });

    const handleLogout = () => {
        runLogout();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn('relative h-8 w-8 rounded-full !ml-7')}
                >
                    <Avatar className={cn('w-8 h-8')}>
                        <AvatarImage src={userInfo.avatar} />
                        <AvatarFallback>
                            {userInfo.nickname?.slice(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn('w-40')} align="end" forceMount>
                <DropdownMenuLabel className={cn('font-normal')}>
                    <div className={cn('flex flex-col space-y-1')}>
                        <p
                            className={cn(
                                'text-sm font-medium leading-none overflow-hidden text-ellipsis whitespace-nowrap'
                            )}
                        >
                            {userInfo.nickname}
                        </p>
                        <p
                            className={cn(
                                'text-xs leading-none text-muted-foreground'
                            )}
                        >
                            {userInfo.phone}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className={cn('cursor-pointer')}
                        onClick={handleLogout}
                    >
                        {t('user_center.logout')}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserCenter;
