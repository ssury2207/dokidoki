import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../supabaseConfig";

const ARCHIVE_MAINS_KEY = 'archive_mains_questions';
const ARCHIVE_PRELIMS_KEY = 'archive_prelims_questions';
const ARCHIVE_META = 'archive_questions_meta';

export async function getArchiveQuestions() {
  const today = new Date().toISOString().substring(0, 10);

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

  // Save results and update meta with today's lastCheckedDate
  await AsyncStorage.setItem(ARCHIVE_MAINS_KEY, JSON.stringify(mainsResult || []));
  await AsyncStorage.setItem(ARCHIVE_PRELIMS_KEY, JSON.stringify(prelimsResult || []));
  await AsyncStorage.setItem(ARCHIVE_META, JSON.stringify({
    maxDate: {
      mains: newestMains,
      prelims: newestPrelims,
    },
    lastCheckedDate: today
  }));

  return {
    mains: mainsResult || [],
    prelims: prelimsResult || [],
  };
}
