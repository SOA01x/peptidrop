// lib/ai-engine.ts

export interface ProtocolInput {
  goal: string
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
  riskTolerance: number // 1-5
  age: number
  weight?: number
  bodyFat?: number
  symptoms?: string[]
  bloodwork?: string
  additionalNotes?: string
}

export function buildProtocolPrompt(input: ProtocolInput): string {
  return `You are an elite peptide research analyst and protocol designer. You have deep knowledge of peptide pharmacology, receptor interactions, synergy mechanisms, and clinical applications.

IMPORTANT DISCLAIMERS:
- All information is for EDUCATIONAL PURPOSES ONLY
- All dosing references are educational and non-prescriptive
- This is NOT medical advice
- Users should consult qualified healthcare professionals

---

USER PROFILE:
- Primary Goal: ${input.goal}
- Experience Level: ${input.experienceLevel}
- Risk Tolerance: ${input.riskTolerance}/5
- Age: ${input.age}
${input.weight ? `- Weight: ${input.weight} lbs` : ''}
${input.bodyFat ? `- Body Fat: ${input.bodyFat}%` : ''}
${input.symptoms?.length ? `- Symptoms: ${input.symptoms.join(', ')}` : ''}
${input.bloodwork ? `- Bloodwork Notes: ${input.bloodwork}` : ''}
${input.additionalNotes ? `- Additional: ${input.additionalNotes}` : ''}

---

Generate a comprehensive peptide protocol following this EXACT JSON structure:

{
  "protocolSummary": {
    "objective": "Clear primary objective",
    "strategicReasoning": "Why this protocol was designed this way for THIS specific user"
  },
  "coreStack": [
    {
      "name": "Peptide Name",
      "mechanism": "Brief mechanism description",
      "whySelected": "Specific reason for THIS user's profile",
      "synergyRole": "How it synergizes with other stack members",
      "timelineExpectation": "When to expect results",
      "educationalDosing": "Educational reference dosing only",
      "frequency": "Dosing frequency",
      "riskLevel": "low|moderate|high"
    }
  ],
  "synergyAnalysis": {
    "overview": "Overall synergy explanation",
    "amplifiers": ["Synergy pair descriptions"],
    "redundancies": ["Any overlapping mechanisms noted"],
    "interactionWarnings": ["Any interaction concerns"]
  },
  "riskAndTradeoffs": {
    "sideEffects": ["Potential side effects"],
    "suppressionRisks": ["Hormonal or system suppression risks"],
    "longTermConsiderations": ["Long-term concerns"],
    "monitoringRecommendations": ["What to monitor"]
  },
  "weeklyTimeline": [
    {
      "week": "1-2",
      "phase": "Phase name",
      "actions": "What happens this period",
      "expectations": "What to expect"
    }
  ],
  "adaptationLogic": {
    "plateauResponse": "What to change if plateau occurs",
    "rotationSchedule": "When to rotate compounds",
    "discontinuationCriteria": "When to stop"
  },
  "alternativeStacks": {
    "conservative": {
      "description": "Lower-risk alternative",
      "peptides": ["List of peptides"],
      "tradeoff": "What you sacrifice"
    },
    "aggressive": {
      "description": "More aggressive alternative",
      "peptides": ["List of peptides"],
      "tradeoff": "Additional risks accepted"
    }
  }
}

IMPORTANT:
- Be specific to the user's profile — do not give generic advice
- Explain WHY each peptide was chosen for THIS person
- Include realistic timelines
- Note when professional supervision is especially important
- All dosing information is educational reference only
- Return ONLY valid JSON, no markdown formatting`
}

export interface GeneratedProtocol {
  protocolSummary: {
    objective: string
    strategicReasoning: string
  }
  coreStack: Array<{
    name: string
    mechanism: string
    whySelected: string
    synergyRole: string
    timelineExpectation: string
    educationalDosing: string
    frequency: string
    riskLevel: string
  }>
  synergyAnalysis: {
    overview: string
    amplifiers: string[]
    redundancies: string[]
    interactionWarnings: string[]
  }
  riskAndTradeoffs: {
    sideEffects: string[]
    suppressionRisks: string[]
    longTermConsiderations: string[]
    monitoringRecommendations: string[]
  }
  weeklyTimeline: Array<{
    week: string
    phase: string
    actions: string
    expectations: string
  }>
  adaptationLogic: {
    plateauResponse: string
    rotationSchedule: string
    discontinuationCriteria: string
  }
  alternativeStacks: {
    conservative: {
      description: string
      peptides: string[]
      tradeoff: string
    }
    aggressive: {
      description: string
      peptides: string[]
      tradeoff: string
    }
  }
}
