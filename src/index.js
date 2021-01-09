import {Controller} from './controllers/controller';
import {View} from './views/view';
import {Model} from './models/model';


const app = new Controller(new Model(), new View());