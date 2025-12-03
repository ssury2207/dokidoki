import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment-specific variables
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({
  path: `.env.${nodeEnv}`
});

console.log(`🔧 Send notifications running in ${nodeEnv} mode`);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(`❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.${nodeEnv} file`);
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Notification messages pool
const NOTIFICATION_MESSAGES = [
  {
    title: "Keep the Streak Going",
    description: "Your daily challenge is live! Don't break your streak today."
  },
  {
    title: "One Step Closer",
    description: "One question, one step closer — keep your streak alive!"
  },
  {
    title: "Build Mastery",
    description: "Consistency builds mastery. Write today's answer to stay on track!"
  },
  {
    title: "Stay Consistent",
    description: "You've come this far. Don't stop now — today's challenge awaits!"
  },
  {
    title: "Momentum Matters",
    description: "Keep the momentum going! Submit today's answer to continue your streak."
  },
  {
    title: "Hey Achiever!",
    description: "Your daily challenge is waiting — keep the streak burning."
  },
  {
    title: "Don't Let It Fade",
    description: "Don't let the streak fade — one short answer, that's all it takes!"
  },
  {
    title: "Your Streak Misses You",
    description: "Your writing streak misses you — come back and claim today's challenge."
  },
  {
    title: "You're on a Roll",
    description: "You're on a roll! Write today's answer before your streak cools off."
  },
  {
    title: "Make Today Count",
    description: "Every streak starts with one day. Let's make today count."
  },
  {
    title: "Stay Disciplined",
    description: "Today's challenge is ready. Maintain your discipline — keep your streak alive."
  },
  {
    title: "True Aspirant",
    description: "A true aspirant never skips practice. Attempt today's question to stay consistent."
  },
  {
    title: "Dedication Pays Off",
    description: "Streaks reflect dedication — submit today's answer to keep yours going."
  },
  {
    title: "Daily Discipline",
    description: "Daily discipline builds success. Don't miss today's writing challenge."
  },
  {
    title: "Stay Sharp",
    description: "Stay sharp, stay steady. Continue your daily answer streak today."
  }
];

// Function to pick random notification message
function getRandomNotificationMessage() {
  const randomIndex = Math.floor(Math.random() * NOTIFICATION_MESSAGES.length);
  return NOTIFICATION_MESSAGES[randomIndex];
}

// Function to send push notifications to Expo
async function sendExpoPushNotifications(messages) {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error sending push notifications:', error);
    throw error;
  }
}

// Function to handle token failure
async function handleTokenFailure(tokenId, tokenPreview) {
  const { data, error } = await supabase
    .from('push_tokens')
    .select('failure_count')
    .eq('id', tokenId)
    .single();

  if (error) {
    console.error(`   ⚠️  Error fetching failure count for ${tokenPreview}:`, error.message);
    return;
  }

  const newFailureCount = (data.failure_count || 0) + 1;

  if (newFailureCount >= 3) {
    // Delete token if failure count reaches 3
    const { error: deleteError } = await supabase
      .from('push_tokens')
      .delete()
      .eq('id', tokenId);

    if (deleteError) {
      console.error(`   ⚠️  Error deleting token ${tokenPreview}:`, deleteError.message);
    } else {
      console.log(`   🗑️  Deleted token ${tokenPreview} (reached 3 failures)`);
    }
  } else {
    // Increment failure count
    const { error: updateError } = await supabase
      .from('push_tokens')
      .update({ failure_count: newFailureCount })
      .eq('id', tokenId);

    if (updateError) {
      console.error(`   ⚠️  Error updating failure count for ${tokenPreview}:`, updateError.message);
    } else {
      console.log(`   ⚠️  Token ${tokenPreview} - Failure ${newFailureCount}/3`);
    }
  }
}

// Main function
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('📱 PUSH NOTIFICATION SERVICE');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Step 1: Fetch all push tokens
    console.log('🔍 Step 1: Fetching push tokens from database...');
    const { data: pushTokens, error } = await supabase
      .from('push_tokens')
      .select('id, token, user_id, failure_count');

    if (error) {
      console.error('❌ Error fetching tokens:', error.message);
      process.exit(1);
    }

    if (!pushTokens || pushTokens.length === 0) {
      console.log('⚠️  No push tokens found in database\n');
      process.exit(0);
    }

    console.log(`✅ Found ${pushTokens.length} token(s)\n`);

    // Step 2: Select random notification message
    console.log('🎲 Step 2: Selecting random notification message...');
    const selectedMessage = getRandomNotificationMessage();
    console.log(`✅ Selected: "${selectedMessage.title}"`);
    console.log(`   Message: "${selectedMessage.description}"\n`);

    // Step 3: Prepare notification payload
    console.log('📦 Step 3: Preparing notification payload...');
    const messages = pushTokens.map(pt => ({
      to: pt.token,
      sound: 'default',
      title: selectedMessage.title,
      body: selectedMessage.description,
      data: {
        type: 'daily_challenge',
        timestamp: new Date().toISOString(),
      },
      priority: 'high',
      channelId: 'default', // For Android
    }));
    console.log(`✅ Prepared ${messages.length} notification(s)\n`);

    // Step 4: Send notifications
    console.log('📤 Step 4: Sending notifications via Expo Push Service...');
    const result = await sendExpoPushNotifications(messages);
    console.log('✅ Request completed\n');

    // Step 5: Process results and handle failures
    console.log('📊 Step 5: Processing results...\n');

    let successCount = 0;
    let errorCount = 0;
    let deletedCount = 0;

    if (result.data && Array.isArray(result.data)) {
      for (let i = 0; i < result.data.length; i++) {
        const response = result.data[i];
        const tokenRecord = pushTokens[i];
        const tokenPreview = tokenRecord.token.substring(0, 40) + '...';

        if (response.status === 'ok') {
          successCount++;
          console.log(`   ✅ ${tokenPreview}`);
        } else {
          errorCount++;
          const errorMsg = response.message || response.details?.error || 'Unknown error';
          console.log(`   ❌ ${tokenPreview}`);
          console.log(`      Error: ${errorMsg}`);

          // Handle failure
          const beforeFailureCount = tokenRecord.failure_count || 0;
          await handleTokenFailure(tokenRecord.id, tokenPreview);

          // Check if token was deleted
          if (beforeFailureCount + 1 >= 3) {
            deletedCount++;
          }
        }
      }
    }

    // Final summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📈 SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Successful deliveries: ${successCount}`);
    console.log(`❌ Failed deliveries: ${errorCount}`);
    console.log(`🗑️  Tokens deleted: ${deletedCount}`);
    console.log(`📱 Total tokens remaining: ${pushTokens.length - deletedCount}`);
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ SCRIPT FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script
main();
