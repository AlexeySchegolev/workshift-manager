declare module 'javascript-lp-solver' {
  interface Variable {
    [constraint: string]: number;
  }

  interface Constraint {
    min?: number;
    max?: number;
    equal?: number;
  }

  interface Model {
    optimize: string;
    opType: 'min' | 'max';
    constraints: { [key: string]: Constraint };
    variables: { [key: string]: Variable };
  }

  interface Solution {
    feasible: boolean;
    result: number;
    [variable: string]: any;
  }

  export function Solve(model: Model): Solution;
}