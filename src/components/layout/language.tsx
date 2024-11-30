import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';

export default function Language() {
    const [lang, setLang] = useStorage({
        key: 'qnets-lng',
        defaultValue: 'en-US'
    });
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        setLang(lng);
        i18n.changeLanguage(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className={cn('rounded-full')}
                >
                    <Languages size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={'end'}>
                <DropdownMenuRadioGroup
                    value={lang}
                    onValueChange={changeLanguage}
                >
                    <DropdownMenuRadioItem value="zh-CN">
                        中文
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="en-US">
                        English
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
