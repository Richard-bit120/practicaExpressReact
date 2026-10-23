import { useCrud } from '../../../shared/hooks/useCrud';
import { bookService } from '../services/book.service';

export const useBooks = (initialParams = {}) => {
    return useCrud(bookService, { initialParams });
};