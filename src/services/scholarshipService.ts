import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Scholarship, SavedScholarship, UserProfile } from '../types';
import { INITIAL_SCHOLARSHIPS } from '../data/scholarshipsData';

const SCHOLARSHIPS_COLLECTION = 'scholarships';
const SAVED_SCHOLARSHIPS_COLLECTION = 'saved_scholarships';

export interface MatchResult {
  isEligible: boolean;
  matchScore: number;
  matchReasons: string[];
  unmetReasons: string[];
}

/**
 * Fetch all active scholarships from Firestore.
 * Automatically seeds initial verified scholarships if database collection is empty.
 */
export async function fetchScholarships(): Promise<Scholarship[]> {
  try {
    const colRef = collection(db, SCHOLARSHIPS_COLLECTION);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      console.log('Seeding initial verified scholarships into Firestore...');
      // Seed Firestore with verified scholarship data
      for (const item of INITIAL_SCHOLARSHIPS) {
        await setDoc(doc(db, SCHOLARSHIPS_COLLECTION, item.scholarshipId), item);
      }
      return INITIAL_SCHOLARSHIPS;
    }

    const items: Scholarship[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as Scholarship);
    });

    return items;
  } catch (error) {
    console.warn('Firestore fetch failed, returning initial verified scholarships fallback:', error);
    return INITIAL_SCHOLARSHIPS;
  }
}

/**
 * Add a new scholarship (Admin functionality)
 */
export async function createScholarshipInDB(scholarship: Scholarship): Promise<void> {
  const docRef = doc(db, SCHOLARSHIPS_COLLECTION, scholarship.scholarshipId);
  await setDoc(docRef, scholarship);
}

/**
 * Update an existing scholarship (Admin functionality)
 */
export async function updateScholarshipInDB(scholarshipId: string, updates: Partial<Scholarship>): Promise<void> {
  const docRef = doc(db, SCHOLARSHIPS_COLLECTION, scholarshipId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Delete a scholarship (Admin functionality)
 */
export async function deleteScholarshipFromDB(scholarshipId: string): Promise<void> {
  const docRef = doc(db, SCHOLARSHIPS_COLLECTION, scholarshipId);
  await deleteDoc(docRef);
}

/**
 * Fetch saved scholarship records for a given student user ID.
 */
export async function fetchSavedScholarships(userId: string): Promise<SavedScholarship[]> {
  if (!userId) return [];
  try {
    const q = query(collection(db, SAVED_SCHOLARSHIPS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const saved: SavedScholarship[] = [];
    snapshot.forEach((docSnap) => {
      saved.push(docSnap.data() as SavedScholarship);
    });
    return saved;
  } catch (error) {
    console.warn('Error fetching saved scholarships:', error);
    return [];
  }
}

/**
 * Bookmark a scholarship for a student.
 */
export async function saveScholarshipToDB(userId: string, scholarship: Scholarship): Promise<SavedScholarship> {
  const savedId = `saved_${userId}_${scholarship.scholarshipId}`;
  const entry: SavedScholarship = {
    id: savedId,
    userId,
    scholarshipId: scholarship.scholarshipId,
    scholarshipName: scholarship.scholarshipName,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, SAVED_SCHOLARSHIPS_COLLECTION, savedId), entry);
  return entry;
}

/**
 * Remove a saved scholarship bookmark.
 */
export async function unsaveScholarshipFromDB(userId: string, scholarshipId: string): Promise<void> {
  const savedId = `saved_${userId}_${scholarshipId}`;
  await deleteDoc(doc(db, SAVED_SCHOLARSHIPS_COLLECTION, savedId));
}

/**
 * Recommendation Engine: Evaluates a student's profile against a scholarship.
 * Strictly uses data stored in the database.
 */
export function evaluateScholarshipMatch(profile: Partial<UserProfile> | null, scholarship: Scholarship): MatchResult {
  if (!profile) {
    return {
      isEligible: true,
      matchScore: 50,
      matchReasons: ['Profile incomplete - complete your student profile to calculate exact eligibility.'],
      unmetReasons: []
    };
  }

  let matchScore = 0;
  const matchReasons: string[] = [];
  const unmetReasons: string[] = [];
  let isEligible = true;

  // 1. Education Level Check (25 pts)
  const studentLevel = profile.currentEducationLevel;
  if (scholarship.educationLevel === 'All') {
    matchScore += 25;
    matchReasons.push('Open to all educational levels');
  } else if (studentLevel && studentLevel === scholarship.educationLevel) {
    matchScore += 25;
    matchReasons.push(`Education level match: ${studentLevel}`);
  } else if (studentLevel) {
    // Compatible check
    matchScore += 10;
    unmetReasons.push(`Target level is ${scholarship.educationLevel} (Your level: ${studentLevel})`);
  } else {
    matchScore += 12;
  }

  // 2. State Check (15 pts)
  const studentState = profile.state;
  const isAllStates = scholarship.eligibleStates.some(s => s.toLowerCase().includes('all'));
  if (isAllStates) {
    matchScore += 15;
    matchReasons.push('Available across all Indian states');
  } else if (studentState && scholarship.eligibleStates.some(s => s.toLowerCase() === studentState.toLowerCase())) {
    matchScore += 15;
    matchReasons.push(`State domicile match: ${studentState}`);
  } else if (studentState) {
    isEligible = false;
    unmetReasons.push(`State restricted to ${scholarship.eligibleStates.join(', ')} (You selected: ${studentState})`);
  } else {
    matchScore += 8;
  }

  // 3. Category Check (15 pts)
  const studentCategory = profile.category;
  if (scholarship.category === 'All') {
    matchScore += 15;
    matchReasons.push('Open to all social categories');
  } else if (studentCategory && (studentCategory.toLowerCase() === scholarship.category.toLowerCase() || (scholarship.category === 'Minority' && studentCategory === 'Minority'))) {
    matchScore += 15;
    matchReasons.push(`Social category match: ${studentCategory}`);
  } else if (studentCategory) {
    isEligible = false;
    unmetReasons.push(`Category reserved for ${scholarship.category} (Your category: ${studentCategory})`);
  } else {
    matchScore += 8;
  }

  // 4. Gender Check (10 pts)
  const studentGender = profile.gender;
  if (scholarship.gender === 'All') {
    matchScore += 10;
    matchReasons.push('Open to all genders');
  } else if (studentGender && studentGender.toLowerCase() === scholarship.gender.toLowerCase()) {
    matchScore += 10;
    matchReasons.push(`Gender criteria match: ${studentGender}`);
  } else if (studentGender) {
    isEligible = false;
    unmetReasons.push(`Reserved for ${scholarship.gender} candidates`);
  } else {
    matchScore += 5;
  }

  // 5. Family Income Check (20 pts)
  const studentIncome = profile.familyIncome;
  if (scholarship.maximumFamilyIncome === 0 || scholarship.maximumFamilyIncome >= 9999999) {
    matchScore += 20;
    matchReasons.push('No upper family income restriction');
  } else if (studentIncome !== undefined && studentIncome !== null) {
    if (studentIncome <= scholarship.maximumFamilyIncome) {
      matchScore += 20;
      matchReasons.push(`Income eligible: ₹${studentIncome.toLocaleString('en-IN')} <= ₹${scholarship.maximumFamilyIncome.toLocaleString('en-IN')}`);
    } else {
      isEligible = false;
      unmetReasons.push(`Family income exceeds cap (Your income: ₹${studentIncome.toLocaleString('en-IN')}, Cap: ₹${scholarship.maximumFamilyIncome.toLocaleString('en-IN')})`);
    }
  } else {
    matchScore += 10;
    matchReasons.push(`Requires annual income <= ₹${scholarship.maximumFamilyIncome.toLocaleString('en-IN')}`);
  }

  // 6. Percentage / Marks Check (15 pts)
  const studentMarks = profile.percentageMarks;
  if (scholarship.minimumPercentage === 0) {
    matchScore += 15;
    matchReasons.push('No minimum percentage benchmark required');
  } else if (studentMarks !== undefined && studentMarks !== null) {
    if (studentMarks >= scholarship.minimumPercentage) {
      matchScore += 15;
      matchReasons.push(`Academic score met: ${studentMarks}% >= ${scholarship.minimumPercentage}% required`);
    } else {
      isEligible = false;
      unmetReasons.push(`Academic percentage below requirement (Your score: ${studentMarks}%, Required: ${scholarship.minimumPercentage}%)`);
    }
  } else {
    matchScore += 8;
  }

  return {
    isEligible,
    matchScore: Math.min(100, Math.round(matchScore)),
    matchReasons,
    unmetReasons
  };
}
