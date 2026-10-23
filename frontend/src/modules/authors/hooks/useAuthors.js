import { useCrud } from '../../../shared/hooks/useCrud';
import { authorService } from '../services/author.service';

export const useAuthors = (initialParams = {}) => {
    return useCrud(authorService, { initialParams });
};