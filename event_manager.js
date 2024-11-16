
import { EventEmitter } from 'events';
export default class event_manager extends EventEmitter {
    emit(event, ...args) {
        if (event !== "all"){
            super.emit('all', event, ...args);
        }
        return super.emit(event, ...args);
      }
}
  