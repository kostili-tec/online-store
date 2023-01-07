import { ClassLike } from 'jest-mock';
import { SearchParams } from '../src/scripts/router';
import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';

describe('SearchParams class', () => {
  const queryParams = new SearchParams();

  // eslint-disable-next-line
  const updateHistoryMock = jest.spyOn(SearchParams.prototype as any, 'updateHistory').mockImplementation(() => {
    return;
  });

  let windowSpy: jest.Spied<ClassLike>;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });
  afterEach(() => windowSpy.mockRestore());

  const setSearchParams = (search: string) =>
    windowSpy.mockImplementation(() => ({
      location: {
        search,
      },
    }));

  it('should have a get method which returns a value of a parameter if exits or empty string otherwise', () => {
    setSearchParams('?brand=test');
    expect(queryParams.get('brand')).toEqual('test');
    setSearchParams('?brand=');
    expect(queryParams.get('brand')).toEqual('');
    setSearchParams('');
    expect(queryParams.get('brand')).toEqual('');
  });

  it('should have a split method which returns an array of values split by comma  or returns undefined if parameter doesnt exist', () => {
    setSearchParams('?brand=test1,test2');
    expect(queryParams.split('brand')).toEqual(['test1', 'test2']);
    setSearchParams('');
    expect(queryParams.split('brand')).toBeUndefined;
  });

  it('should have a clear method which clears all search parameters', () => {
    setSearchParams('?brand=test1,test2');
    queryParams.clear();
    expect(updateHistoryMock).toBeCalledWith(new URLSearchParams());
  });

  it('should have a set method which creates a new parameter or overwrites an existing one', () => {
    setSearchParams('?brand=test1,test2&category=test');
    queryParams.set('brand', 'nike');
    expect(updateHistoryMock).toBeCalledWith(new URLSearchParams('?brand=nike&category=test'));

    setSearchParams('');
    queryParams.set('brand', 'nike');
    expect(updateHistoryMock).toBeCalledWith(new URLSearchParams('?brand=nike'));
  });

  it('should have an append method which appends a value for existing parameter or creates a new one', () => {
    setSearchParams('?brand=test1');
    queryParams.append('brand', 'nike');
    expect(updateHistoryMock).toBeCalledWith(new URLSearchParams('?brand=test1,nike'));

    setSearchParams('');
    queryParams.append('brand', 'nike');
    expect(updateHistoryMock).toBeCalledWith(new URLSearchParams('?brand=nike'));
  });

  it('should have a delete method which deletes paramter if no value given, or deletes a value from parameter otherwise', () => {
    setSearchParams('?brand=test1,test2,test3');
    queryParams.delete('brand');
    expect(updateHistoryMock).toBeCalledWith(new URLSearchParams());

    setSearchParams('?brand=test1,test2,test3');
    queryParams.delete('brand', 'test2');
    expect(updateHistoryMock).toBeCalledWith(new URLSearchParams('?brand=test1,test3'));

    setSearchParams('?brand=test1');
    queryParams.delete('brand', 'test1');
    expect(updateHistoryMock).toBeCalledWith(new URLSearchParams());
  });
});
