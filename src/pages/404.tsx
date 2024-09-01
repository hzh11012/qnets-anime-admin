import { useRouteError } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Exception404 = () => {
    const error = useRouteError();
    if (error !== null) {
        console.error(error);
    }
    return (
        <div className={cn('h-full flex items-center justify-center')}>
            <span
                className={cn(
                    'relative first-letter:tracking-[5rem] font-bold text-[12rem] w-fit block before:absolute before:size-full before:bg-no-repeat before:bg-contain before:bg-center before:bg-404 before:animate-404'
                )}
            >
                44
            </span>
        </div>
    );
};

export default Exception404;
