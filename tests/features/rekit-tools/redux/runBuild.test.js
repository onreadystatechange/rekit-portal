import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  REKIT_TOOLS_RUN_BUILD_BEGIN,
  REKIT_TOOLS_RUN_BUILD_SUCCESS,
  REKIT_TOOLS_RUN_BUILD_FAILURE,
  REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR,
} from 'src/features/rekit-tools/redux/constants';

import {
  runBuild,
  dismissRunBuildError,
  reducer,
} from 'src/features/rekit-tools/redux/runBuild';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('rekit-tools/redux/runBuild', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when runBuild succeeds', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: REKIT_TOOLS_RUN_BUILD_BEGIN },
      { type: REKIT_TOOLS_RUN_BUILD_SUCCESS, data: {} },
    ];

    return store.dispatch(runBuild({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dispatches failure action when runBuild fails', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: REKIT_TOOLS_RUN_BUILD_BEGIN },
      { type: REKIT_TOOLS_RUN_BUILD_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(runBuild({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('returns correct action by dismissRunBuildError', () => {
    const expectedAction = {
      type: REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR,
    };
    expect(dismissRunBuildError()).to.deep.equal(expectedAction);
  });

  it('handles action type REKIT_TOOLS_RUN_BUILD_BEGIN correctly', () => {
    const prevState = { runBuildPending: true };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_RUN_BUILD_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runBuildPending).to.be.true;
  });

  it('handles action type REKIT_TOOLS_RUN_BUILD_SUCCESS correctly', () => {
    const prevState = { runBuildPending: true };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_RUN_BUILD_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runBuildPending).to.be.false;
  });

  it('handles action type REKIT_TOOLS_RUN_BUILD_FAILURE correctly', () => {
    const prevState = { runBuildPending: true };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_RUN_BUILD_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runBuildPending).to.be.false;
    expect(state.runBuildError).to.exist;
  });

  it('handles action type REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR correctly', () => {
    const prevState = { runBuildError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runBuildError).to.be.null;
  });
});
