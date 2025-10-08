import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../supabaseConfig";

const ARCHIVE_MAINS_KEY = 'archive_mains_questions';
const ARCHIVE_PRELIMS_KEY = 'archive_prelims_questions';
const ARCHIVE_META = 'archive_questions_meta';
const CACHE_VERSION = '2'; // Increment when data structure changes
const CACHE_VERSION_KEY = 'archive_cache_version';

export async function getArchiveQuestions() {
  const today = new Date().toISOString().substring(0, 10);

  // Check cache version and clear if outdated
  const currentVersion = await AsyncStorage.getItem(CACHE_VERSION_KEY);
  if (currentVersion !== CACHE_VERSION) {
    console.log('Cache version mismatch, clearing old cache');
    await AsyncStorage.multiRemove([ARCHIVE_MAINS_KEY, ARCHIVE_PRELIMS_KEY, ARCHIVE_META]);
    await AsyncStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
  }

  // Get local meta: { maxDate, lastCheckedDate }
  const metaRaw = await AsyncStorage.getItem(ARCHIVE_META);
  let meta = { maxDate: '', lastCheckedDate: '' };
  if (metaRaw) meta = JSON.parse(metaRaw);

  // If we already checked Supabase today, just use cached questions
  if (meta.lastCheckedDate === today) {
    const cachedMains = await AsyncStorage.getItem(ARCHIVE_MAINS_KEY);
    const cachedPrelims = await AsyncStorage.getItem(ARCHIVE_PRELIMS_KEY);
    if(cachedMains && cachedPrelims){
      return {
        mains: JSON.parse(cachedMains),
        prelims: JSON.parse(cachedPrelims),
      };
    }

    // If for some reason cache is missing, fall through to Supabase fetch
  }

  // Else, fetch fresh from Supabase
  // Fetch Mains
  const { data: mainsResult, error: mainsError } = await supabase
    .from("daily_mains_questions")
    .select("*")
    .order("date", { ascending: false });

  if (mainsError) {
    console.error("Error fetching mains archive:", mainsError);
  }

  const newestMains = mainsResult && mainsResult.length > 0 ? mainsResult[0].date : '';

  // Fetch Prelims
  const { data: prelimsResult, error: prelimsError } = await supabase
    .from("daily_prelims_questions")
    .select("*")
    .order("date", { ascending: false });

  if (prelimsError) {
    console.error("Error fetching prelims archive:", prelimsError);
  }

  const newestPrelims = prelimsResult && prelimsResult.length > 0 ? prelimsResult[0].date : '';

  // Transform snake_case to PascalCase for component compatibility
  const transformedMains = (mainsResult || []).map(item => ({
    id: item.id,
    date: item.date,
    questionId: item.question_id,
    Question: item.question,
    Year: item.year,
    Paper: item.paper,
    Marks: item.marks,
    Code: item.code,
  }));

  const transformedPrelims = (prelimsResult || []).map(item => ({
    id: item.id,
    date: item.date,
    questionId: item.question_id,
    Question: item.question,
    Year: item.year,
    Chapters: item.chapters,
    Answer: item.answer,
    Explanation: item.explanation,
    Options: item.options,
    Section: item.section,
    Table: item.table_name,
  }));

  console.log('fetchArchiveQuestions - Transformed mains sample:', transformedMains[0]);
  console.log('fetchArchiveQuestions - Transformed prelims sample:', transformedPrelims[0]);

  // Save transformed results and update meta with today's lastCheckedDate
  await AsyncStorage.setItem(ARCHIVE_MAINS_KEY, JSON.stringify(transformedMains));
  await AsyncStorage.setItem(ARCHIVE_PRELIMS_KEY, JSON.stringify(transformedPrelims));
  await AsyncStorage.setItem(ARCHIVE_META, JSON.stringify({
    maxDate: {
      mains: newestMains,
      prelims: newestPrelims,
    },
    lastCheckedDate: today
  }));

  return {
    mains: transformedMains,
    prelims: transformedPrelims,
  };
}
