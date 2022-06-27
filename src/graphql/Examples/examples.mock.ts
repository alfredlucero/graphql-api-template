import { ExamplesService } from './examples.service';
import { NexusGenObjects } from '../../../nexus-typegen';
import { ContextServiceInfo } from '../../context';

/** We can implement our own mock responses to simulate success/error states when we don't want to talk to the database or service */
export const examplesServiceMock: ExamplesService = {
  getExamples: async (contextInfo: ContextServiceInfo): Promise<NexusGenObjects['Example'][]> => {
    return [
      {
        id: 1,
        message: 'Mock Example 1',
      },
      {
        id: 2,
        message: 'Mock Example 2',
      },
    ];
  },
};
