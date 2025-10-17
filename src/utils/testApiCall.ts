/**
 * Test utility to verify the apiCall service
 * This file helps test that the Supabase integration is working correctly
 */

import apiCall from '../services/apiCall';

/**
 * Test fetching an itinerary by ID
 */
async function testGetItinerary(id: number) {
  console.log(`\n--- Testing getItinerary(${id}) ---`);
  try {
    const result = await apiCall.getItinerary({ id });
    console.log('✅ Success! Itinerary fetched:');
    console.log('Destination:', result.itinerary[0]?.destination);
    console.log('Inspiration:', result.itinerary[0]?.inspiration);
    console.log('Duration:', result.itinerary[0]?.durationOfTrip, 'days');
    console.log('Number of days in itinerary:', result.itinerary[0]?.result?.dailyItineraries?.length || 0);
    return result;
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Test handling of invalid IDs
 */
async function testInvalidId(id: number) {
  console.log(`\n--- Testing Invalid ID (${id}) ---`);
  try {
    await apiCall.getItinerary({ id });
    console.error('❌ Expected error but got success');
  } catch (error) {
    console.log('✅ Correctly handled invalid ID with error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Run all tests
 */
export async function runApiTests() {
  console.log('=== API Call Service Tests ===\n');
  
  try {
    // Test 1: Fetch the sample itinerary (ID 410)
    await testGetItinerary(410);
    
    // Test 2: Test with non-existent ID
    await testInvalidId(999999);
    
    console.log('\n=== All tests completed ===\n');
  } catch (error) {
    console.error('\n=== Tests failed ===');
    console.error(error);
  }
}

// Allow running from browser console
if (typeof window !== 'undefined') {
  (window as any).runApiTests = runApiTests;
  console.log('Test utility loaded. Run runApiTests() in console to test the API.');
}
