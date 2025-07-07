export function useDisableLastRow<T>(data: T[], lastRowIndices: number[]): boolean[] {
  const lastRowSet = new Set(lastRowIndices);
  return data.map((_, index) => lastRowSet.has(index));
}
