export interface RiskRequestDTO {
  age: number
  income: number
  loanAmount: number
  employmentStatus: string
}

export function createRiskRequest(overrides: Partial<RiskRequestDTO> = {}): RiskRequestDTO {
  return {
    age: 30,
    income: 4000,
    loanAmount: 1000,
    employmentStatus: 'employed',
    ...overrides,
  }
}
