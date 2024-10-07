import { useLocation } from 'react-router-dom';

export default function useCheckActiveNav() {
    const { pathname } = useLocation();

    const checkActiveNav = (nav: string) => {
        const pathArray = pathname.split('/').filter(item => item !== '');

        if (nav === '/' && pathArray.length < 1) return true;
        return pathArray.includes(nav.replace(/^\//, ''));
    };

    const checkIsActive = (nav: string) => {
        const pathArray = pathname.split('/').filter(item => item !== '');

        if (nav === '/' && pathArray.length < 1) return true;
        const navLink = nav.replace(/^\/|\/$/g, '');
        const pathLink = pathname.replace(/^\/|\/$/g, '');
        return navLink === pathLink;
    };

    return { checkActiveNav, checkIsActive };
}