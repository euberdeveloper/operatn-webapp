import store from '@/store';
import { RuoloUtente } from 'operatn-api-client';

export default function(): string {
    const role: RuoloUtente | undefined = store.state.user?.ruolo;
    
    switch (role) {
      case RuoloUtente.ROOT:
        return `/root`;
      case RuoloUtente.ADMIN:
        return `/admin`;
      case RuoloUtente.CONTROLLO_ALLOGGI:
        return `/controllo-alloggi`;
      case RuoloUtente.PORTINERIA:
        return `/portineria`;
      case RuoloUtente.RAGIONERIA:
        return `/ragioneria`;
      case RuoloUtente.SPORTELLO:
        return `/sportello`;
      default:
        return `/login`;
    }
}