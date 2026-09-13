export interface IndianJobOccupation {
  code: string;
  title: string;
  description: string;
  sample_of_reported_job_titles?: string[];
  tasks?: string[];
  skills?: string[];
  knowledge?: string[];
  abilities?: string[];
  work_activities?: string[];
  education?: string;
  currency?: string;
  symbol?: string;
  wage_outlook?: {
    median_annual_salary?: string;
    entry_salary?: string;
    senior_salary?: string;
    growth_rate?: string;
    projected_job_openings?: string;
  };
}

export interface IndianJobSearchResponse {
  source: string;
  region: 'IN';
  keyword: string;
  occupations: IndianJobOccupation[];
  citations?: { title: string; url: string }[];
}

export async function fetchIndianJobData(query: string, lang?: string): Promise<IndianJobSearchResponse> {
  const response = await fetch('/api/jobs/india', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, lang: lang || 'en' }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Indian job data (${response.status})`);
  }

  const data = await response.json();
  return data;
}
