# Cursor AI Fix Process - Systematic Error Handling

A structured approach to identify, fix, and validate issues without introducing new bugs.

## 🎯 Fix Process Overview

### Phase 1: IDENTIFY → Phase 2: ISOLATE → Phase 3: FIX → Phase 4: VALIDATE → Phase 5: DEPLOY

---

## 📋 Phase 1: IDENTIFY (2-3 minutes)

### Step 1.1: Error Classification
\`\`\`
CRITICAL: App crashes, authentication fails, data loss
HIGH: Feature broken, navigation issues, payment problems  
MEDIUM: UI glitches, performance issues, minor bugs
LOW: Cosmetic issues, text errors, minor UX problems
\`\`\`

### Step 1.2: Information Gathering
\`\`\`
- What is the exact error message?
- Which file(s) are affected?
- What user action triggers the issue?
- Does it happen on iOS, Android, or both?
- Is it related to a recent change?
\`\`\`

### Step 1.3: Quick Diagnosis
\`\`\`bash
# Run these commands to gather info
npm run cursor:env-check    # Check environment
npm run type-check         # Check TypeScript errors
npx expo doctor           # Check Expo setup
\`\`\`

---

## 🔍 Phase 2: ISOLATE (3-5 minutes)

### Step 2.1: Locate the Problem
\`\`\`
1. Check error logs and console output
2. Identify the specific component/function
3. Review recent changes in git history
4. Check related dependencies
\`\`\`

### Step 2.2: Create Minimal Reproduction
\`\`\`typescript
// Create a simple test case
const testCase = {
  input: "what triggers the bug",
  expected: "what should happen", 
  actual: "what actually happens"
}
\`\`\`

### Step 2.3: Backup Current State
\`\`\`bash
# Create a backup branch
git checkout -b backup-before-fix-$(date +%Y%m%d-%H%M%S)
git add .
git commit -m "Backup before fixing [issue description]"
git checkout main
\`\`\`

---

## 🔧 Phase 3: FIX (5-10 minutes)

### Step 3.1: Apply Minimal Fix
\`\`\`
RULE: Make the smallest possible change that fixes the issue
- Fix only the specific problem
- Don't refactor unrelated code
- Don't add new features while fixing
- Keep changes focused and atomic
\`\`\`

### Step 3.2: Fix Categories & Templates

#### 3.2.1: TypeScript Errors
\`\`\`typescript
// Before fixing, understand the type error
interface FixTemplate {
  problem: string
  solution: string
  validation: string
}

// Common fixes:
// - Add missing type definitions
// - Fix import/export issues  
// - Correct prop types
// - Handle undefined/null cases
\`\`\`

#### 3.2.2: React Native Component Issues
\`\`\`typescript
// Component fix template
const ComponentFix = {
  // 1. Check props and state
  // 2. Verify lifecycle methods
  // 3. Check event handlers
  // 4. Validate styling
  // 5. Test on both platforms
}
\`\`\`

#### 3.2.3: Navigation Issues
\`\`\`typescript
// Navigation fix checklist
const NavigationFix = {
  // 1. Check route definitions
  // 2. Verify parameter passing
  // 3. Check navigation types
  // 4. Test deep linking
  // 5. Validate stack structure
}
\`\`\`

#### 3.2.4: Supabase/API Issues
\`\`\`typescript
// API fix template
const APIFix = {
  // 1. Check environment variables
  // 2. Verify API endpoints
  // 3. Check authentication
  // 4. Handle error responses
  // 5. Test network conditions
}
\`\`\`

### Step 3.3: Code Quality Checks
\`\`\`typescript
// Ensure fix follows patterns
const QualityChecklist = {
  typescript: "All types defined correctly",
  errorHandling: "Proper try/catch and error states",
  testing: "Fix doesn't break existing functionality", 
  performance: "No performance regressions",
  accessibility: "Maintains accessibility standards"
}
\`\`\`

---

## ✅ Phase 4: VALIDATE (3-5 minutes)

### Step 4.1: Immediate Testing
\`\`\`bash
# Run these tests immediately after fixing
npm run type-check        # TypeScript validation
npm start                # Basic app startup
# Test the specific feature that was broken
# Test related features that might be affected
\`\`\`

### Step 4.2: Platform Testing
\`\`\`
iOS Testing:
- Test on iOS simulator
- Check iOS-specific behaviors
- Verify safe area handling

Android Testing:  
- Test on Android emulator
- Check Android-specific behaviors
- Verify back button handling
\`\`\`

### Step 4.3: Regression Testing
\`\`\`typescript
// Test these areas after any fix
const RegressionTests = {
  authentication: "Login/logout still works",
  navigation: "All navigation flows work",
  dataFlow: "Data loading and saving works",
  notifications: "Push notifications work",
  payments: "Payment flow works",
  offline: "Offline functionality works"
}
\`\`\`

### Step 4.4: Performance Check
\`\`\`bash
# Check for performance regressions
# Monitor app startup time
# Check memory usage
# Verify smooth animations
\`\`\`

---

## 🚀 Phase 5: DEPLOY (2-3 minutes)

### Step 5.1: Final Validation
\`\`\`bash
# Clean build test
npm run cursor:clean
npm install
npm start
# Test the fix one more time
\`\`\`

### Step 5.2: Documentation
\`\`\`typescript
// Document the fix
const FixDocumentation = {
  issue: "Brief description of the problem",
  solution: "What was changed and why",
  testing: "How it was tested",
  impact: "What areas might be affected",
  rollback: "How to rollback if needed"
}
\`\`\`

### Step 5.3: Commit Strategy
\`\`\`bash
# Use clear commit messages
git add .
git commit -m "fix: [component] - [brief description]

- Problem: [what was broken]
- Solution: [what was changed]  
- Testing: [how it was verified]
- Impact: [affected areas]"
\`\`\`

---

## 🛡️ ROLLBACK PROCEDURES

### If Fix Causes New Issues
\`\`\`bash
# Quick rollback
git checkout backup-before-fix-[timestamp]
git checkout -b emergency-rollback
# Deploy the rollback immediately
\`\`\`

### If Fix Partially Works
\`\`\`bash
# Incremental approach
git checkout main
git revert [commit-hash]
# Apply a smaller, more targeted fix
\`\`\`

---

## 🎯 CURSOR AI PROMPT TEMPLATES

### For Bug Reports
\`\`\`
"Fix the [specific issue] in [file/component]. 

Current behavior: [what's happening]
Expected behavior: [what should happen]
Error message: [exact error]

Please:
1. Identify the root cause
2. Apply minimal fix
3. Ensure no regressions
4. Test on both platforms
5. Follow existing code patterns"
\`\`\`

### For Complex Issues
\`\`\`
"Debug and fix [complex issue] following the CURSOR_FIX_PROCESS.md:

1. First, help me identify the issue category and gather information
2. Isolate the problem to specific components
3. Propose a minimal fix
4. Create a testing plan
5. Implement with proper error handling"
\`\`\`

### For Performance Issues
\`\`\`
"Optimize [component/function] for better performance:

1. Profile the current performance
2. Identify bottlenecks  
3. Apply targeted optimizations
4. Measure improvements
5. Ensure no functionality is lost"
\`\`\`

---

## 📊 SUCCESS METRICS

### Fix Quality Indicators
\`\`\`
✅ Issue resolved completely
✅ No new bugs introduced  
✅ Performance maintained/improved
✅ Code follows project patterns
✅ Proper error handling added
✅ Tests pass on both platforms
✅ Documentation updated
\`\`\`

### Time Targets
\`\`\`
Simple fixes: 5-10 minutes
Medium fixes: 15-20 minutes  
Complex fixes: 30-45 minutes
Critical fixes: Immediate (with follow-up)
\`\`\`

---

## 🚨 EMERGENCY PROCEDURES

### For Critical Production Issues
\`\`\`
1. IMMEDIATE: Rollback to last known good state
2. ASSESS: Determine impact and urgency
3. FIX: Apply hotfix following abbreviated process
4. DEPLOY: Push fix immediately
5. MONITOR: Watch for any side effects
6. DOCUMENT: Full post-mortem after resolution
\`\`\`

### For Development Blockers
\`\`\`
1. ISOLATE: Create minimal reproduction
2. WORKAROUND: Find temporary solution
3. FIX: Apply proper solution
4. VALIDATE: Thorough testing
5. COMMUNICATE: Update team on resolution
\`\`\`

---

## 💡 BEST PRACTICES

### Do's
- ✅ Always backup before fixing
- ✅ Make minimal, focused changes
- ✅ Test immediately after fixing
- ✅ Document the fix clearly
- ✅ Follow existing code patterns
- ✅ Handle edge cases
- ✅ Test on both platforms

### Don'ts  
- ❌ Don't fix multiple issues at once
- ❌ Don't refactor while fixing bugs
- ❌ Don't skip testing steps
- ❌ Don't ignore TypeScript errors
- ❌ Don't deploy without validation
- ❌ Don't forget to document changes
- ❌ Don't ignore performance impact

This process ensures systematic, reliable fixes with minimal risk of introducing new issues.
\`\`\`

Now let's create a quick reference card for common fixes:
