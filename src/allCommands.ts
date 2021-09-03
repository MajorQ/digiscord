import commands from './commands/commands';
import pingPong from './commands/pingPong';
import listPraktikan from './commands/listPraktikan';
import Command from './model/Command';
import absen from './commands/absen';

const allCommands: Map<string, Command> = new Map();

allCommands.set('commands', commands);
allCommands.set('ping', pingPong);
allCommands.set('listpraktikan', listPraktikan);
allCommands.set('absen', absen);

export default allCommands;
