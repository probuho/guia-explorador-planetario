// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shuffleArray = (arr: any[]): any[] => {
    return arr
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  };