import { VoteModule } from './vote.module';

describe('VoteModule', () => {
  let voteModule: VoteModule;

  beforeEach(() => {
    voteModule = new VoteModule();
  });

  it('should create an instance', () => {
    expect(voteModule).toBeTruthy();
  });
});
