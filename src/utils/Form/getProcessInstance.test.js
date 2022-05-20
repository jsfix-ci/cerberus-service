import getProcessInstance from './getProcessInstance';

describe('components.utils.Form', () => {
  describe('getProcessInstance', () => {
    it('should return an appropriate process instance', () => {
      const INSTANCE = { businessKey: 'KEY-12345678-90', id: 'instanceId' };
      const PROCESS_CONTEXT = {
        instance: INSTANCE,
      };
      const result = getProcessInstance(PROCESS_CONTEXT);
      expect(result).toEqual(INSTANCE);
    });

    it('should handle a missing instance', () => {
      const PROCESS_CONTEXT = {};
      const result = getProcessInstance(PROCESS_CONTEXT);
      expect(result).toEqual({});
    });

    it('should handle a null process context', () => {
      const result = getProcessInstance(null);
      expect(result).toEqual({});
    });
  });
});
