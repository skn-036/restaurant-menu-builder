import { PageSize } from '@/types/home/home';

const useTemplate = () => {
    const pageSizes: PageSize[] = [
        { size: 'A4', width: 596, height: 842 },
        { size: 'A5', width: 420, height: 596 },
    ];

    return {
        pageSizes,
    };
};

export default useTemplate;
