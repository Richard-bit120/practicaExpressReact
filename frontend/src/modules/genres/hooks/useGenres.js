import { useCrud } from '../../../shared/hooks/useCrud';
import { genreService } from '../services/genre.service';

export const useGenres = (initialParams = {}) => {
    return useCrud(genreService, { initialParams });
};