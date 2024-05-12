import { ConvertMinutesPipe } from './convert-minutes.pipe';

describe('ConvertMinutesPipe', () => {
  let pipe: ConvertMinutesPipe;

  beforeEach(() => {
    pipe = new ConvertMinutesPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms 120 minutes to "2h 0m"', () => {
    expect(pipe.transform(120)).toEqual('2h 0m');
  });

  it('transforms 75 minutes to "1h 15m"', () => {
    expect(pipe.transform(75)).toEqual('1h 15m');
  });

  it('transforms 20 minutes to "20min"', () => {
    expect(pipe.transform(20)).toEqual('20min');
  });

  it('handles zero correctly, transforming 0 minutes to "0min"', () => {
    expect(pipe.transform(0)).toEqual('0min');
  });

  it('transforms negative minutes correctly', () => {
    expect(pipe.transform(-123)).toEqual('0m');
  });
});
