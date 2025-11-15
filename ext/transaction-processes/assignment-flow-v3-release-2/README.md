# Assignment Flow V3 - Release 2

## Changes from release-1:

### New transition: `add-portfolio`
- **Actor:** Customer (specialist/executor)
- **From state:** completed
- **To state:** completed (stays in same state)
- **Actions:** `update-protected-data` (stores portfolio image UUIDs and metadata)
- **Purpose:** Allow Customer to upload portfolio photos after task completion

### Usage:
1. Provider closes the task (`transition/complete`)
2. Task enters `state/completed`
3. Customer can:
   - **Option A:** Upload portfolio photos (`transition/add-portfolio`)
   - **Option B:** Leave a review (`transition/review-1-by-customer`)
   - **Both actions are optional and independent**
4. Portfolio data is stored in transaction `protectedData.portfolioData`:
   ```javascript
   {
     images: ['image-uuid-1', 'image-uuid-2'],
     title: 'Kitchen renovation',
     description: 'Completed full kitchen renovation...',
     addedToUserPortfolio: true, // flag to prevent duplicates
   }
   ```

### Migration from release-1:
- **Backward compatible:** No breaking changes
- Existing transactions continue to work
- New transition is optional

### Deployment:
1. Upload `process.edn` to Sharetribe Console
2. Create new process version: `assignment-flow-v3, version 2`
3. Update `src/config/configListing.js` to use `assignment-flow-v3/release-2`
