// import databaseConfig from 'src/modules/database/config/database.config';
import configuration, { Configuration } from '../configuration';

describe('Configuration', () => {
  let config: any;

  beforeEach(async () => {
    config = await configuration();
    // console.log(await databaseConfig());
    // console.log(await configuration());
    // throw new Error(await configuration());
    // throw new Error(JSON.stringify(await configuration()));
  });

  it('should be defined', async () => {
    // throw new Error(JSON.stringify(await configuration()));
    expect(config).toBeDefined();
    expect(config).toBe(JSON.stringify(await configuration()));
  });

  it('should return the correct app port', () => {
    expect(config.PORT).toBe(3000);
  });

  it('should return the correct app environment', () => {
    expect(config.NODE_ENV).toBe('test');
  });
});
