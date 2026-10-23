import { useCrud } from '../../../shared/hooks/useCrud';
import { sagaService } from '../services/saga.service';

export const useSagas = (initialParams = {}) => {
    return useCrud(sagaService, { initialParams });
};