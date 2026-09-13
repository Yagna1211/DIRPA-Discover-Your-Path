import i18n from 'i18next';
import { AcademicPathway } from '../types';
import { 
  ACADEMIC_PATHWAYS, 
  INTERMEDIATE_GROUPS, 
  POLYTECHNIC_DIPLOMAS, 
  ITI_VOCATIONAL_TRADES,
  IntermediateGroup,
  PolytechnicDiploma,
  ITIVocationalTrade
} from '../data/coursesData';

export function getLocalizedPathway(pathway: AcademicPathway): AcademicPathway {
  const pathwayKey = pathway.id.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return {
    ...pathway,
    name: i18n.t(`pathways.${pathwayKey}.name`, { defaultValue: pathway.name }),
    duration: i18n.t(`pathways.${pathwayKey}.duration`, { defaultValue: pathway.duration }),
    eligibility: i18n.t(`pathways.${pathwayKey}.eligibility`, { defaultValue: pathway.eligibility }),
    description: i18n.t(`pathways.${pathwayKey}.description`, { defaultValue: pathway.description }),
    category: i18n.t(`pathways.${pathwayKey}.category`, { defaultValue: pathway.category }) as AcademicPathway['category'],
  };
}

export function getLocalizedPathways(): AcademicPathway[] {
  return ACADEMIC_PATHWAYS.map(getLocalizedPathway);
}

export function getLocalizedIntermediateGroups(): IntermediateGroup[] {
  return INTERMEDIATE_GROUPS.map((group) => {
    const key = group.code ? group.code.toLowerCase() : group.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return {
      ...group,
      name: i18n.t(`pathways.${key}.name`, { defaultValue: group.name }),
    };
  });
}

export function getLocalizedPolytechnicDiplomas(): PolytechnicDiploma[] {
  return POLYTECHNIC_DIPLOMAS.map((diploma) => {
    const key = diploma.id ? diploma.id.toLowerCase() : diploma.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return {
      ...diploma,
      name: i18n.t(`pathways.${key}.name`, { defaultValue: diploma.name }),
    };
  });
}

export function getLocalizedITITrades(): ITIVocationalTrade[] {
  return ITI_VOCATIONAL_TRADES.map((trade) => {
    const key = trade.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return {
      ...trade,
      name: i18n.t(`pathways.${key}.name`, { defaultValue: trade.name }),
    };
  });
}
