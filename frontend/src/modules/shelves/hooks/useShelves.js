import { useCrud } from '../../../shared/hooks/useCrud';
import { shelfService } from '../services/shelf.service';

export const useShelves = (initialParams = {}) => {
    return useCrud(shelfService, { initialParams });
};